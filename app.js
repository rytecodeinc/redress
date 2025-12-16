const PRODUCTS = [
  "Aster Sculptural Mini Dress",
  "Calyx Draped Midi Dress",
  "Luna Cutout Knit Top",
  "Helios Pleated Maxi Skirt",
  "Solstice Raffia Tote",
  "Petra Beaded Shoulder Bag",
  "Muse Metallic Sandal",
  "Orchid Strapless Top",
  "Ripple Mesh Bodysuit",
  "Arc Resin Bangle",
  "Sable Wide-Leg Trouser",
  "Eden Satin Slip Dress",
  "Nova Halter Mini Dress",
  "Dune Linen Blazer",
  "Fable Cropped Cardigan",
  "Vela Ruched Mini Skirt",
  "Citrine Statement Earring",
  "Halo Heeled Mule",
  "Mirage Sheer Column Dress",
  "Cove Structured Tote",
  "Sylph Corset Top",
  "Iris Sculptural Clutch",
  "Drift Knit Midi Dress",
  "Tide Wrap Top",
  "Aurora Satin Wide Leg",
  "Grove Crochet Mini Dress",
  "Mica Chain Necklace",
  "Wisp Asymmetric Tank",
  "Prism Pleated Pant",
  "Bloom Cutout Maxi Dress",
  "Gala Strap Sandal",
  "Ember Ribbed Dress",
  "Rhea Denim Jacket",
  "Pearl Drop Earring",
  "Crescent Shoulder Bag",
  "Saffron Linen Short",
  "Opal Sheer Blouse",
  "Maris Draped Top",
  "Atlas Utility Pant",
  "Nectar Mini Tote",
  "Breeze Poplin Shirt",
  "Petal Knit Skirt",
  "Violet Cutout Dress",
  "Quartz Hoop Earring",
  "Waverly Maxi Dress",
  "Noir Sculpted Heel",
  "Seabird Raffia Hat",
  "Terra Twill Trench",
  "Siren Bias Midi",
  "Vale Organza Top",
  "Cassis Knit Set",
  "Cinder Wrap Dress",
  "Aloe Satin Skirt",
  "Cameo Corset Dress",
  "Poppy Knit Tank",
  "Citrine Mini Clutch",
  "Fawn Slingback Heel",
  "Ecru Tailored Vest",
  "Zephyr Pleated Dress",
  "Koru Statement Ring",
];

const PAGE_SIZE_COMPACT = 24; // 4-col mode
const PAGE_SIZE_GALLERY = 54; // 9-col mode (6 full rows)
const LAYOUT_KEY = "ns:gridLayout";

function byId(id) {
  return document.getElementById(id);
}

function getPageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = Number.parseInt(params.get("page") || "1", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

function setPageInUrl(page) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", String(page));
  window.history.pushState({ page }, "", url);
}

function buildProductList(names) {
  return names.map((name, idx) => {
    const id = idx + 1;
    const tag = idx % 7 === 0 ? "Just In" : idx % 11 === 0 ? "Trending" : "New";
    return { id, name, tag };
  });
}

function applySort(items, sortMode) {
  const copy = [...items];
  switch (sortMode) {
    case "newest":
      return copy.reverse();
    case "name-asc":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    case "featured":
    default:
      return copy;
  }
}

function pageCount(total, pageSize) {
  return Math.max(1, Math.ceil(total / pageSize));
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function makePageRange(current, total) {
  // Compact pagination: 1 … (current-1,current,current+1) … total
  const pages = new Set([1, total, current - 1, current, current + 1, current - 2, current + 2]);
  const list = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    out.push(list[i]);
    if (i < list.length - 1 && list[i + 1] - list[i] > 1) {
      out.push("…");
    }
  }
  return out;
}

function renderGrid(gridEl, items) {
  gridEl.innerHTML = items
    .map(
      (p) => `
      <li class="card ns-product" aria-label="Product ${escapeHtml(p.name)}">
        <a class="ns-product-link" href="#" aria-label="${escapeHtml(p.name)}">
          <div class="card-media ns-product-media">
            <div class="color-block" aria-hidden="true"></div>
          </div>
          <div class="ns-product-info">
            <div class="card-meta ns-product-tag">${escapeHtml(p.tag)}</div>
            <div class="card-title ns-product-title">${escapeHtml(p.name)}</div>
          </div>
        </a>
      </li>
    `,
    )
    .join("");
}

function renderPagination({
  page,
  totalPages,
  prevBtn,
  nextBtn,
  pageNumbersEl,
  onPage,
}) {
  prevBtn.disabled = page <= 1;
  nextBtn.disabled = page >= totalPages;

  prevBtn.onclick = () => onPage(page - 1);
  nextBtn.onclick = () => onPage(page + 1);

  const range = makePageRange(page, totalPages);
  pageNumbersEl.innerHTML = "";

  for (const token of range) {
    if (token === "…") {
      const span = document.createElement("span");
      span.className = "ellipsis";
      span.textContent = "…";
      pageNumbersEl.appendChild(span);
      continue;
    }

    const p = token;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "page-number";
    btn.textContent = String(p);
    if (p === page) btn.setAttribute("aria-current", "page");
    btn.onclick = () => onPage(p);
    pageNumbersEl.appendChild(btn);
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function main() {
  const gridEl = byId("ns-product-grid");
  const resultsMetaEl = byId("resultsMeta");
  const prevBtn = byId("prevBtn");
  const nextBtn = byId("nextBtn");
  const pageNumbersEl = byId("pageNumbers");
  const sortSelect = byId("sortSelect");
  const galleryBtn = document.querySelector(".ns-toggle-gallery");
  const compactBtn = document.querySelector(".ns-toggle-compact");

  const allProducts = buildProductList(PRODUCTS);

  let sortMode = sortSelect.value;
  let sorted = applySort(allProducts, sortMode);
  let currentPage = getPageFromUrl();

  // Align to Cult Gaia style selectors for view switching.
  document.body.classList.add("ns-serp-body");

  function pageSizeForLayout() {
    return gridEl.dataset.layout === "gallery" ? PAGE_SIZE_GALLERY : PAGE_SIZE_COMPACT;
  }

  function setLayout(layout) {
    const next = layout === "gallery" ? "gallery" : "compact";
    gridEl.dataset.layout = next;
    document.body.dataset.view = next === "gallery" ? "-1" : "0";
    if (galleryBtn) galleryBtn.setAttribute("aria-pressed", String(next === "gallery"));
    if (compactBtn) compactBtn.setAttribute("aria-pressed", String(next === "compact"));
    try {
      window.localStorage.setItem(LAYOUT_KEY, next);
    } catch {
      // ignore
    }

    // Keep pagination aligned to the chosen layout's page size.
    render(currentPage);
  }

  function getInitialLayout() {
    try {
      const saved = window.localStorage.getItem(LAYOUT_KEY);
      if (saved === "gallery" || saved === "compact") return saved;
    } catch {
      // ignore
    }
    return "compact";
  }

  function render(page) {
    const pageSize = pageSizeForLayout();
    const totalPages = pageCount(sorted.length, pageSize);
    const safePage = clamp(page, 1, totalPages);
    currentPage = safePage;

    const start = (safePage - 1) * pageSize;
    const slice = sorted.slice(start, start + pageSize);
    const from = sorted.length === 0 ? 0 : start + 1;
    const to = start + slice.length;

    renderGrid(gridEl, slice);
    resultsMetaEl.textContent = `Showing ${from}–${to} of ${sorted.length}`;
    renderPagination({
      page: safePage,
      totalPages,
      prevBtn,
      nextBtn,
      pageNumbersEl,
      onPage: (p) => {
        const nextPage = clamp(p, 1, totalPages);
        currentPage = nextPage;
        setPageInUrl(nextPage);
        render(nextPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });

    // Keep URL consistent if user typed an out-of-range page.
    const currentUrlPage = getPageFromUrl();
    if (currentUrlPage !== safePage) setPageInUrl(safePage);
  }

  sortSelect.addEventListener("change", () => {
    sortMode = sortSelect.value;
    sorted = applySort(allProducts, sortMode);
    render(1);
  });

  if (galleryBtn) galleryBtn.addEventListener("click", () => setLayout("gallery"));
  if (compactBtn) compactBtn.addEventListener("click", () => setLayout("compact"));

  window.addEventListener("popstate", () => {
    currentPage = getPageFromUrl();
    render(currentPage);
  });

  const yearEl = byId("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  setLayout(getInitialLayout());
  render(currentPage);
}

main();
