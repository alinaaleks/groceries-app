export function renderList(items, listEl) {
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