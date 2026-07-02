export function renderList(items, listEl) {
  listEl.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");

    if (item.checked) li.classList.add("done");

    li.innerHTML = `
  <label class="checkbox">
    <input type="checkbox" ${item.checked ? "checked" : ""} data-id="${item.id}" />
    <span class="checkmark"></span>
  </label>

  <span class="text">${item.text}</span>

  <button class="delete" data-id="${item.id}" aria-label="Delete">
    🗑
  </button>
`;

    listEl.appendChild(li);
  });
}