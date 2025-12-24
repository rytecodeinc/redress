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

const OB_LAYOUT_KEY = "ob:gridLayout";

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

function getActiveFilters(root) {
  const cats = new Set(qsa('input[name="cat"]:checked', root).map((i) => i.value));
  const colors = new Set(qsa('input[name="color"]:checked', root).map((i) => i.value));
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
    <button type="button" class="ob-canvas-item-delete" aria-label="Remove item" tabindex="-1">×</button>
    <div class="ob-canvas-item-size-controls" aria-hidden="true">
      <button type="button" class="ob-canvas-item-size-btn ob-size-minus" aria-label="Decrease size" tabindex="-1">−</button>
      <button type="button" class="ob-canvas-item-size-btn ob-size-plus" aria-label="Increase size" tabindex="-1">+</button>
    </div>
  `;
  return el;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function truncateToWidth(ctx, text, maxWidth) {
  if (!text) return "";
  if (ctx.measureText(text).width <= maxWidth) return text;
  const ellipsis = "…";
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    const candidate = text.slice(0, mid) + ellipsis;
    if (ctx.measureText(candidate).width <= maxWidth) lo = mid;
    else hi = mid - 1;
  }
  return text.slice(0, Math.max(0, lo)) + ellipsis;
}

function sanitizeFilename(name) {
  return String(name)
    .replaceAll(/[\\/:*?"<>|]+/g, "-")
    .replaceAll(/\s+/g, " ")
    .trim();
}

export function initOutfitBuilder({ root = document } = {}) {
  const controller = new AbortController();
  const { signal } = controller;

  const gridEl = qs("#obItemGrid", root);
  const metaEl = qs("#obResultsMeta", root);
  const canvasEl = qs("#obCanvas", root);
  const clearFiltersBtn = qs(".ob-clear-filters", root);
  const clearCanvasBtn = qs(".ob-clear-canvas", root);
  const deleteSelectedBtn = qs(".ob-delete-selected", root);
  const downloadBtn = qs(".ob-download-canvas", root);
  const galleryBtn = qs(".ob-toggle-gallery", root);
  const compactBtn = qs(".ob-toggle-compact", root);

  if (!(gridEl instanceof HTMLElement)) return () => controller.abort();
  if (!(metaEl instanceof HTMLElement)) return () => controller.abort();
  if (!(canvasEl instanceof HTMLElement)) return () => controller.abort();
  if (!(clearFiltersBtn instanceof HTMLElement)) return () => controller.abort();
  if (!(clearCanvasBtn instanceof HTMLElement)) return () => controller.abort();
  if (!(deleteSelectedBtn instanceof HTMLButtonElement)) return () => controller.abort();

  let filtered = [...OUTFIT_ITEMS];
  let selectedCanvasItem = null;
  let zCounter = 1;
  let dragState = null;

  function setLayout(layout) {
    const next = layout === "gallery" ? "gallery" : "compact";
    gridEl.dataset.layout = next;
    if (galleryBtn) galleryBtn.setAttribute("aria-pressed", String(next === "gallery"));
    if (compactBtn) compactBtn.setAttribute("aria-pressed", String(next === "compact"));
    try {
      window.localStorage.setItem(OB_LAYOUT_KEY, next);
    } catch {
      // ignore
    }
  }

  function getInitialLayout() {
    try {
      const saved = window.localStorage.getItem(OB_LAYOUT_KEY);
      if (saved === "gallery" || saved === "compact") return saved;
    } catch {
      // ignore
    }
    return "compact";
  }

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
    const filters = getActiveFilters(root);
    filtered = filterItems(OUTFIT_ITEMS, filters);
    renderGrid(gridEl, filtered);
    metaEl.textContent = `Items: ${filtered.length}`;
  }

  function canvasPointFromEvent(clientX, clientY) {
    const rect = canvasEl.getBoundingClientRect();
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

  async function downloadCanvasImage() {
    const canvasRect = canvasEl.getBoundingClientRect();
    const width = Math.max(1, Math.round(canvasRect.width));
    const height = Math.max(1, Math.round(canvasRect.height));

    const items = Array.from(canvasEl.querySelectorAll(".ob-canvas-item"));

    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    const out = document.createElement("canvas");
    out.width = Math.round(width * dpr);
    out.height = Math.round(height * dpr);
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const bg = getComputedStyle(canvasEl).backgroundColor;
    ctx.fillStyle = bg && bg !== "rgba(0, 0, 0, 0)" ? bg : "#fff";
    ctx.fillRect(0, 0, width, height);

    const ordered = items
      .map((el, idx) => ({
        el,
        idx,
        z: Number.parseInt(el.style.zIndex || "0", 10) || 0,
      }))
      .sort((a, b) => (a.z !== b.z ? a.z - b.z : a.idx - b.idx));

    for (const { el } of ordered) {
      const mediaEl = el.querySelector(".ob-canvas-item-media");
      const labelEl = el.querySelector(".ob-canvas-item-label");
      if (!(mediaEl instanceof HTMLElement)) continue;

      const mediaRect = mediaEl.getBoundingClientRect();
      const mx = mediaRect.left - canvasRect.left;
      const my = mediaRect.top - canvasRect.top;
      const mw = mediaRect.width;
      const mh = mediaRect.height;

      const colorBlock = mediaEl.querySelector(".color-block");
      const fill =
        colorBlock instanceof HTMLElement
          ? getComputedStyle(colorBlock).backgroundColor
          : getComputedStyle(el).getPropertyValue("--tile").trim() || "#c8c7ba";

      ctx.fillStyle = fill || "#c8c7ba";
      ctx.fillRect(mx, my, mw, mh);

      ctx.strokeStyle = "rgba(57, 57, 57, 0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(mx + 0.5, my + 0.5, Math.max(0, mw - 1), Math.max(0, mh - 1));

      if (labelEl instanceof HTMLElement) {
        const labelRect = labelEl.getBoundingClientRect();
        const lx = labelRect.left - canvasRect.left;
        const ly = labelRect.top - canvasRect.top;
        const lw = labelRect.width;

        const cs = getComputedStyle(labelEl);
        const fontSize = Number.parseFloat(cs.fontSize || "12") || 12;
        const fontFamily =
          cs.fontFamily || "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
        const fontWeight = cs.fontWeight || "400";
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = cs.color || "rgba(57, 57, 57, 0.75)";
        ctx.textBaseline = "top";

        const raw = (labelEl.textContent || "").trim();
        const text = truncateToWidth(ctx, raw, Math.max(0, lw));
        ctx.fillText(text, lx, ly);
      }
    }

    const stamp = new Date().toISOString().slice(0, 10);
    const suggestedName = sanitizeFilename(`redress-outfit-${stamp}.png`);

    const blob = await new Promise((resolve) => {
      out.toBlob((b) => resolve(b), "image/png");
    });
    if (!blob) return;

    if (typeof window.showSaveFilePicker === "function") {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName,
          types: [
            {
              description: "PNG image",
              accept: { "image/png": [".png"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch {
        // fall back
      }
    }

    const chosen = window.prompt("Save image as…", suggestedName);
    const filename = sanitizeFilename(chosen || suggestedName) || suggestedName;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function resizeCanvasItem(itemEl, deltaPx) {
    const canvasRect = canvasEl.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();

    const currentW = Number.parseFloat(itemEl.style.width || "") || itemRect.width;
    const nextW = clamp(currentW + deltaPx, 84, 220);
    itemEl.style.width = `${nextW}px`;

    const nextRect = itemEl.getBoundingClientRect();
    const currentLeft = Number.parseFloat(itemEl.style.left || "0");
    const currentTop = Number.parseFloat(itemEl.style.top || "0");
    const maxLeft = Math.max(0, canvasRect.width - nextRect.width);
    const maxTop = Math.max(0, canvasRect.height - nextRect.height);
    itemEl.style.left = `${clamp(currentLeft, 0, maxLeft)}px`;
    itemEl.style.top = `${clamp(currentTop, 0, maxTop)}px`;
  }

  // Grid: click to add, drag to canvas.
  gridEl.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest(".ob-card");
      if (!btn) return;
      const name = btn.getAttribute("data-item-name") || "Item";
      const color = btn.getAttribute("data-item-color") || "#c8c7ba";
      const rect = canvasEl.getBoundingClientRect();
      addToCanvas({ name, color }, { x: rect.width * 0.25, y: rect.height * 0.2 });
    },
    { signal },
  );

  gridEl.addEventListener(
    "dragstart",
    (e) => {
      const btn = e.target.closest(".ob-card");
      if (!btn) return;
      const payload = {
        name: btn.getAttribute("data-item-name") || "Item",
        color: btn.getAttribute("data-item-color") || "#c8c7ba",
      };
      e.dataTransfer.setData("application/json", JSON.stringify(payload));
      e.dataTransfer.effectAllowed = "copy";
    },
    { signal },
  );

  // Canvas: accept drops.
  canvasEl.addEventListener(
    "dragover",
    (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    { signal },
  );

  canvasEl.addEventListener(
    "drop",
    (e) => {
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
    },
    { signal },
  );

  // Canvas selection.
  canvasEl.addEventListener(
    "pointerdown",
    (e) => {
      if (
        e.target &&
        (e.target.closest(".ob-canvas-item-delete") || e.target.closest(".ob-canvas-item-size-btn"))
      )
        return;
      const item = e.target.closest(".ob-canvas-item");
      if (!item) {
        setSelected(null);
        return;
      }
      setSelected(item);
    },
    { signal },
  );

  // Delete / resize buttons on selected item.
  canvasEl.addEventListener(
    "click",
    (e) => {
      const deleteBtn = e.target.closest(".ob-canvas-item-delete");
      if (deleteBtn) {
        e.preventDefault();
        e.stopPropagation();
        const item = deleteBtn.closest(".ob-canvas-item");
        if (!item) return;
        item.remove();
        if (selectedCanvasItem === item) setSelected(null);
        return;
      }

      const sizeBtn = e.target.closest(".ob-canvas-item-size-btn");
      if (sizeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const item = sizeBtn.closest(".ob-canvas-item");
        if (!item) return;
        const delta = sizeBtn.classList.contains("ob-size-plus") ? 14 : -14;
        resizeCanvasItem(item, delta);
      }
    },
    { signal },
  );

  // Drag items around inside canvas via pointer events.
  canvasEl.addEventListener(
    "pointerdown",
    (e) => {
      if (
        e.target &&
        (e.target.closest(".ob-canvas-item-delete") || e.target.closest(".ob-canvas-item-size-btn"))
      )
        return;
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
    },
    { signal },
  );

  canvasEl.addEventListener(
    "pointermove",
    (e) => {
      if (!dragState) return;
      const rect = canvasEl.getBoundingClientRect();
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      const nextLeft = clamp(dragState.originLeft + dx, 0, rect.width - 20);
      const nextTop = clamp(dragState.originTop + dy, 0, rect.height - 20);
      dragState.el.style.left = `${nextLeft}px`;
      dragState.el.style.top = `${nextTop}px`;
    },
    { signal },
  );

  const endDrag = () => {
    dragState = null;
  };
  canvasEl.addEventListener("pointerup", endDrag, { signal });
  canvasEl.addEventListener("pointercancel", endDrag, { signal });

  deleteSelectedBtn.addEventListener(
    "click",
    () => {
      if (!selectedCanvasItem) return;
      selectedCanvasItem.remove();
      setSelected(null);
    },
    { signal },
  );

  clearCanvasBtn.addEventListener(
    "click",
    () => {
      canvasEl.innerHTML = "";
      setSelected(null);
    },
    { signal },
  );

  if (downloadBtn) {
    downloadBtn.addEventListener(
      "click",
      () => {
        void downloadCanvasImage();
      },
      { signal },
    );
  }

  clearFiltersBtn.addEventListener(
    "click",
    () => {
      qsa('input[name="cat"], input[name="color"]', root).forEach((i) => {
        i.checked = false;
      });
      rerender();
    },
    { signal },
  );

  document.addEventListener(
    "change",
    (e) => {
      if (!(e.target instanceof HTMLInputElement)) return;
      if (e.target.name === "cat" || e.target.name === "color") rerender();
    },
    { signal },
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Backspace" && e.key !== "Delete") return;
      if (!selectedCanvasItem) return;
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
      selectedCanvasItem.remove();
      setSelected(null);
    },
    { signal },
  );

  if (galleryBtn) galleryBtn.addEventListener("click", () => setLayout("gallery"), { signal });
  if (compactBtn) compactBtn.addEventListener("click", () => setLayout("compact"), { signal });

  setLayout(getInitialLayout());
  rerender();

  return () => controller.abort();
}

