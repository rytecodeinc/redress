const OUTFIT_ITEMS = [
  { id: "t1", name: "Ribbed Tank", category: "Tops", color: "#bac8c3" },
  { id: "t2", name: "Cropped Shirt", category: "Tops", color: "#e7dfd2" },
  { id: "t3", name: "Satin Cami", category: "Tops", color: "#d9d2c7" },
  { id: "b1", name: "Wide Leg Pant", category: "Bottoms", color: "#c8c7ba" },
  { id: "b2", name: "Mini Skirt", category: "Bottoms", color: "#bac8c3" },
  { id: "b3", name: "Pleated Trouser", category: "Bottoms", color: "#d9d2c7" },
  { id: "d1", name: "Slip Dress", category: "Dresses", color: "#e7dfd2" },
  { id: "d2", name: "Cutout Maxi", category: "Dresses", color: "#c8c7ba" },
  { id: "d3", name: "Knit Midi", category: "Dresses", color: "#bac8c3" },
  { id: "s1", name: "Heeled Mule", category: "Shoes", color: "#d9d2c7" },
  { id: "s2", name: "Strap Sandal", category: "Shoes", color: "#e7dfd2" },
  { id: "s3", name: "Slingback Heel", category: "Shoes", color: "#c8c7ba" },
  { id: "g1", name: "Mini Tote", category: "Bags", color: "#bac8c3" },
  { id: "g2", name: "Shoulder Bag", category: "Bags", color: "#d9d2c7" },
  { id: "g3", name: "Clutch", category: "Bags", color: "#e7dfd2" },
  { id: "a1", name: "Hoop Earring", category: "Accessories", color: "#c8c7ba" },
  { id: "a2", name: "Statement Ring", category: "Accessories", color: "#bac8c3" },
  { id: "a3", name: "Chain Necklace", category: "Accessories", color: "#d9d2c7" },
];

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getActiveFilters() {
  const cats = new Set(qsa('input[name="cat"]:checked').map((i) => i.value));
  const colors = new Set(qsa('input[name="color"]:checked').map((i) => i.value));
  return { cats, colors };
}

function filterItems(items, filters) {
  return items.filter((it) => {
    const catOk = filters.cats.size === 0 || filters.cats.has(it.category);
    const colorOk = filters.colors.size === 0 || filters.colors.has(it.color);
    return catOk && colorOk;
  });
}

function renderGrid(gridEl, items) {
  gridEl.innerHTML = items
    .map(
      (it) => `
      <button
        type="button"
        class="card ob-card"
        draggable="true"
        data-item-id="${escapeHtml(it.id)}"
        data-item-name="${escapeHtml(it.name)}"
        data-item-color="${escapeHtml(it.color)}"
        aria-label="Add ${escapeHtml(it.name)} to canvas"
        style="--tile:${escapeHtml(it.color)}"
      >
        <div class="card-media">
          <div class="color-block" aria-hidden="true"></div>
        </div>
        <div class="card-title">${escapeHtml(it.name)}</div>
        <div class="card-meta">${escapeHtml(it.category)}</div>
      </button>
    `,
    )
    .join("");
}

function makeCanvasItem({ name, color }, { x, y }) {
  const el = document.createElement("div");
  el.className = "ob-canvas-item";
  el.tabIndex = 0;
  el.setAttribute("role", "group");
  el.setAttribute("aria-label", `${name} on canvas`);
  el.style.setProperty("--tile", color);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.innerHTML = `
    <div class="ob-canvas-item-media">
      <div class="color-block" aria-hidden="true"></div>
    </div>
    <div class="ob-canvas-item-label">${escapeHtml(name)}</div>
  `;
  return el;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function main() {
  const gridEl = qs("#obItemGrid");
  const metaEl = qs("#obResultsMeta");
  const canvasEl = qs("#obCanvas");
  const clearFiltersBtn = qs(".ob-clear-filters");
  const clearCanvasBtn = qs(".ob-clear-canvas");
  const deleteSelectedBtn = qs(".ob-delete-selected");

  let filtered = [...OUTFIT_ITEMS];
  let selectedCanvasItem = null;
  let zCounter = 1;

  function setSelected(el) {
    if (selectedCanvasItem) selectedCanvasItem.classList.remove("is-selected");
    selectedCanvasItem = el;
    deleteSelectedBtn.disabled = !selectedCanvasItem;
    if (selectedCanvasItem) {
      selectedCanvasItem.classList.add("is-selected");
      selectedCanvasItem.style.zIndex = String(++zCounter);
      selectedCanvasItem.focus({ preventScroll: true });
    }
  }

  function rerender() {
    const filters = getActiveFilters();
    filtered = filterItems(OUTFIT_ITEMS, filters);
    renderGrid(gridEl, filtered);
    metaEl.textContent = `Items: ${filtered.length}`;
  }

  function canvasPointFromEvent(clientX, clientY) {
    const rect = canvasEl.getBoundingClientRect();
    // Default item size matches CSS (approx 120x180); place by top-left
    const x = clamp(clientX - rect.left - 24, 0, rect.width - 40);
    const y = clamp(clientY - rect.top - 24, 0, rect.height - 40);
    return { x, y };
  }

  function addToCanvas({ name, color }, pt) {
    const itemEl = makeCanvasItem({ name, color }, pt);
    itemEl.style.zIndex = String(++zCounter);
    canvasEl.appendChild(itemEl);
    setSelected(itemEl);
  }

  // Grid: click to add (center-ish), drag to canvas.
  gridEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".ob-card");
    if (!btn) return;
    const name = btn.getAttribute("data-item-name") || "Item";
    const color = btn.getAttribute("data-item-color") || "#c8c7ba";
    const rect = canvasEl.getBoundingClientRect();
    addToCanvas({ name, color }, { x: rect.width * 0.25, y: rect.height * 0.2 });
  });

  gridEl.addEventListener("dragstart", (e) => {
    const btn = e.target.closest(".ob-card");
    if (!btn) return;
    const payload = {
      name: btn.getAttribute("data-item-name") || "Item",
      color: btn.getAttribute("data-item-color") || "#c8c7ba",
    };
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  });

  // Canvas: accept drops.
  canvasEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  });

  canvasEl.addEventListener("drop", (e) => {
    e.preventDefault();
    let payload = null;
    try {
      payload = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch {
      payload = null;
    }
    if (!payload) return;
    const pt = canvasPointFromEvent(e.clientX, e.clientY);
    addToCanvas(payload, pt);
  });

  // Canvas selection.
  canvasEl.addEventListener("pointerdown", (e) => {
    const item = e.target.closest(".ob-canvas-item");
    if (!item) {
      setSelected(null);
      return;
    }
    setSelected(item);
  });

  // Drag items around inside canvas via pointer events.
  let dragState = null;
  canvasEl.addEventListener("pointerdown", (e) => {
    const item = e.target.closest(".ob-canvas-item");
    if (!item) return;
    item.setPointerCapture(e.pointerId);
    const rect = canvasEl.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    dragState = {
      el: item,
      startX: e.clientX,
      startY: e.clientY,
      originLeft: itemRect.left - rect.left,
      originTop: itemRect.top - rect.top,
    };
  });

  canvasEl.addEventListener("pointermove", (e) => {
    if (!dragState) return;
    const rect = canvasEl.getBoundingClientRect();
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    const nextLeft = clamp(dragState.originLeft + dx, 0, rect.width - 20);
    const nextTop = clamp(dragState.originTop + dy, 0, rect.height - 20);
    dragState.el.style.left = `${nextLeft}px`;
    dragState.el.style.top = `${nextTop}px`;
  });

  const endDrag = () => {
    dragState = null;
  };
  canvasEl.addEventListener("pointerup", endDrag);
  canvasEl.addEventListener("pointercancel", endDrag);

  // Delete / clear.
  deleteSelectedBtn.addEventListener("click", () => {
    if (!selectedCanvasItem) return;
    selectedCanvasItem.remove();
    setSelected(null);
  });

  clearCanvasBtn.addEventListener("click", () => {
    canvasEl.innerHTML = "";
    setSelected(null);
  });

  clearFiltersBtn.addEventListener("click", () => {
    qsa('input[name="cat"], input[name="color"]').forEach((i) => {
      i.checked = false;
    });
    rerender();
  });

  document.addEventListener("change", (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    if (e.target.name === "cat" || e.target.name === "color") rerender();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Backspace" && e.key !== "Delete") return;
    if (!selectedCanvasItem) return;
    // Avoid deleting while typing in an input (future-proofing)
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
    selectedCanvasItem.remove();
    setSelected(null);
  });

  rerender();
}

main();

