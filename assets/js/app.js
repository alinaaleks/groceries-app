import { supabase } from "./supabase.js";
import { renderList } from "./ui.js";

let currentCategory = "groceries";
let draggedId = null;
let lastDeleted = null;
let undoTimer = null;

const listEl = document.getElementById("list");
const input = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const undoBar = document.getElementById("undoBar");
const undoBtn = document.getElementById("undoBtn");

// --------------------
// Load items
// --------------------
async function loadItems() {
  try {
    const { data, error } = await supabase
      .from("groceries")
      .select("*")
      .eq("category", currentCategory)
      .order("checked", { ascending: true })
      .order("id", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return;
    }

    console.log("Loaded items:", data); // 👈 DEBUG LINE

    renderList(data, listEl);
  } catch (err) {
    console.error("Fatal load error:", err);
  }
}

// --------------------
// Add item
// --------------------
async function addItem() {
  const text = input.value.trim();
  if (!text) return;

  await supabase.from("groceries").insert([
    {
      text,
      category: currentCategory,
      checked: false
    }
  ]);

  input.value = "";
  loadItems();
}

// --------------------
// UNDO
// --------------------
function showUndo() {
  undoBar.classList.remove("hidden");

  // ❗ important: clear previous timer
  if (undoTimer) clearTimeout(undoTimer);

  undoTimer = setTimeout(() => {
    hideUndo();
  }, 5000);
}

function hideUndo() {
  undoBar.classList.add("hidden");
  lastDeleted = null;

  if (undoTimer) {
    clearTimeout(undoTimer);
    undoTimer = null;
  }
}

// --------------------
// Events: add item
// --------------------
addBtn.addEventListener("click", addItem);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addItem();
});

// --------------------
// List interactions (event delegation)
// --------------------
listEl.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  // DELETE
  if (e.target.classList.contains("delete")) {
    const id = e.target.dataset.id;

    const { data } = await supabase
      .from("groceries")
      .select("*")
      .eq("id", id)
      .single();

    lastDeleted = data;

    await supabase.from("groceries").delete().eq("id", id);

    showUndo();
    loadItems();
  }
});

listEl.addEventListener("change", async (e) => {
  if (e.target.type !== "checkbox") return;

  const id = e.target.dataset.id;

  const { data } = await supabase
    .from("groceries")
    .select("checked")
    .eq("id", id)
    .single();

  await supabase
    .from("groceries")
    .update({ checked: !data.checked })
    .eq("id", id);

  loadItems();
});


// --------------------
// DRAG AND DROP
// --------------------
// listEl.addEventListener("dragstart", (e) => {
//   draggedId = e.target.dataset.id;
// });

// listEl.addEventListener("dragover", (e) => {
//   e.preventDefault();
// });

// listEl.addEventListener("drop", async (e) => {
//   const targetId = e.target.closest("li")?.dataset.id;
//   if (!targetId || targetId === draggedId) return;

//   // simple swap strategy (works for MVP)
//   const { data: dragged } = await supabase
//     .from("groceries")
//     .select("*")
//     .eq("id", draggedId)
//     .single();

//   const { data: target } = await supabase
//     .from("groceries")
//     .select("*")
//     .eq("id", targetId)
//     .single();

//   // swap a simple "position" field (we'll add it)
// });



undoBtn.addEventListener("click", async () => {
  if (!lastDeleted) return;

  const { id, ...rest } = lastDeleted;

  await supabase.from("groceries").insert([rest]);

  lastDeleted = null;

  hideUndo();
  loadItems();
});

// --------------------
// Tabs
// --------------------
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) =>
      t.classList.remove("active")
    );

    tab.classList.add("active");

    currentCategory = tab.dataset.category;
    loadItems();
  });
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

// --------------------
// Init
// --------------------
loadItems();

// service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}