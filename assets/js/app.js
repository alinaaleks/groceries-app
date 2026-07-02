import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 1. Replace these:
const SUPABASE_URL = "https://aewbvdmzfrsemvidppri.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFld2J2ZG16ZnJzZW12aWRwcHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTAyMDMsImV4cCI6MjA5ODU2NjIwM30.FNdVcufwqhZULz-c4fIH41U2Bvqw7zuV8f1pSqPAf24";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let currentCategory = "groceries";
let lastDeleted = null;

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
    .eq("category", currentCategory)
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

  await supabase.from("groceries").insert([
  {
    text,
    category: currentCategory
  }
]);

  input.value = "";
  loadItems();
}

<<<<<<< Updated upstream:script.js
addBtn.addEventListener("click", addItem);
=======
// Enter key support
>>>>>>> Stashed changes:assets/js/app.js

// --------------------
// Click actions
<<<<<<< Updated upstream:script.js
listEl.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
=======
addBtn.addEventListener("click", addItem);
>>>>>>> Stashed changes:assets/js/app.js

listEl.addEventListener("change", async (e) => {
  li.classList.add("removing");

  setTimeout(async () => {
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
  }, 200);
}

if (e.target.classList.contains("delete")) {
  const { data } = await supabase
    .from("groceries")
    .select("*")
    .eq("id", id)
    .single();

  lastDeleted = data;

  await supabase.from("groceries").delete().eq("id", id);
  loadItems();

  showUndo();
}

  

    loadItems();
  }
});


// --------------------
// UNDO logic
// --------------------
const undoBar = document.getElementById("undoBar");
const undoBtn = document.getElementById("undoBtn");

function showUndo() {
  undoBar.classList.remove("hidden");

  setTimeout(() => {
    undoBar.classList.add("hidden");
    lastDeleted = null;
  }, 4000);
}

undoBtn.addEventListener("click", async () => {
  if (!lastDeleted) return;

  await supabase.from("groceries").insert([lastDeleted]);
  lastDeleted = null;

  undoBar.classList.add("hidden");
  loadItems();

  showUndo();
}

  

    loadItems();
  }
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
<<<<<<< Updated upstream:script.js
loadItems();
=======
loadItems();

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    currentCategory = tab.dataset.category;
    loadItems();
  });
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}
>>>>>>> Stashed changes:assets/js/app.js
