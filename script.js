import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 1. Replace these:
const SUPABASE_URL = "https://aewbvdmzfrsemvidppri.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFld2J2ZG16ZnJzZW12aWRwcHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTAyMDMsImV4cCI6MjA5ODU2NjIwM30.FNdVcufwqhZULz-c4fIH41U2Bvqw7zuV8f1pSqPAf24";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

  render(data);
}

function render(items = []) {
  listEl.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    if (item.checked) li.classList.add("done");

    li.innerHTML = `
      <span>${item.text}</span>
      <div class="actions">
        <button data-id="${item.id}" class="toggle">✔</button>
        <button data-id="${item.id}" class="delete">🗑</button>
      </div>
    `;

    listEl.appendChild(li);
  });
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

addBtn.addEventListener("click", addItem);

// --------------------
// Click actions
// --------------------
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
// Enter key support
// --------------------
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addItem();
  }
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