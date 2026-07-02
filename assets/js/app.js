import { supabase } from "./supabase.js";
import { renderList } from "./ui.js";

const listEl = document.getElementById("list");
const input = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");

// --------------------
// Load items
// --------------------
async function loadItems() {
  const { data, error } = await supabase
    .from("groceries")
    .select("*")
    .order("checked", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  renderList(data, listEl);
}

// --------------------
// Add item
// --------------------
async function addItem() {
  const text = input.value.trim();
  if (!text) return;

  await supabase.from("groceries").insert([{ text }]);

  input.value = "";
  loadItems();
}

// --------------------
// Click actions
// --------------------
addBtn.addEventListener("click", addItem);

// Enter key support
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addItem();
});

listEl.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("toggle")) {
    const { data } = await supabase
      .from("groceries")
      .select("checked")
      .eq("id", id)
      .single();

    await supabase
      .from("groceries")
      .update({ checked: !data.checked })
      .eq("id", id);
  }

  if (e.target.classList.contains("delete")) {
    await supabase.from("groceries").delete().eq("id", id);
  }

  loadItems();
});

// --------------------
// Realtime sync
// --------------------
supabase
  .channel("groceries-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "groceries" },
    () => loadItems()
  )
  .subscribe();

// initial load
loadItems();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}