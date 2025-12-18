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

const OUTFITS = Array.from({ length: 48 }, (_, i) => `Outfit ${String(i + 1).padStart(2, "0")}`);

const CLOSET_CATEGORIES = ["Tops", "Bottoms", "Shoes", "Outerwear", "Bags", "Accessories", "Dresses"];
const CLOSET_SIZES = ["XS", "S", "M", "L"];
const CLOSET_COLORS = ["Sage", "Stone", "Ivory", "Sand", "Black", "Navy"];
const CLOSET_SEASONS = ["Spring", "Summer", "Fall", "Winter"];
const CLOSET_BRANDS = ["Redress", "Cult Gaia", "Meshki", "Aritzia", "Zara", "COS"];
const CLOSET_TILES = ["#bac8c3", "#d9d2c7", "#e7dfd2", "#c8c7ba", "#393939", "#4b5563"];

const PAGE_SIZE_COMPACT = 24; // 4-col mode
const PAGE_SIZE_GALLERY = 54; // 9-col mode (6 full rows)
const LAYOUT_KEY = "ns:gridLayout";

function byId(id) {
  return document.getElementById(id);
}

function getBasePath() {
  // Mirrors components/components.js logic.
  const { hostname, pathname } = window.location;
  const segments = pathname.split("/").filter(Boolean);
  if (hostname.endsWith("github.io") && segments.length >= 1) {
    return `/${segments[0]}/`;
  }
  return "/";
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

function buildOutfitList(names) {
  return names.map((name, idx) => {
    const id = idx + 1;
    return {
      id: `outfit-${id}`,
      name,
      tag: idx % 5 === 0 ? "Pinned" : idx % 3 === 0 ? "Recent" : "Saved",
      tile: "#e5e7eb",
    };
  });
}

function slugify(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .replaceAll(/['"]/g, "")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}

function sampleFrom(list, idx) {
  return list[idx % list.length];
}

function buildClosetList(names) {
  return names.map((name, idx) => {
    const category = inferCategory(name);
    const size = sampleFrom(CLOSET_SIZES, idx);
    const brand = sampleFrom(CLOSET_BRANDS, idx);
    const tile = sampleFrom(CLOSET_TILES, idx);

    const colors = [sampleFrom(CLOSET_COLORS, idx), sampleFrom(CLOSET_COLORS, idx + 2)].filter(
      (v, i, a) => a.indexOf(v) === i,
    );
    const seasons = [sampleFrom(CLOSET_SEASONS, idx), sampleFrom(CLOSET_SEASONS, idx + 1)].filter(
      (v, i, a) => a.indexOf(v) === i,
    );

    const price = 48 + (idx % 9) * 12 + (idx % 3) * 5;
    const link = `https://example.com/items/${encodeURIComponent(slugify(name) || String(idx + 1))}`;
    const notes = `Placeholder notes for ${name}.\nReplace with real notes later.\nGreat for styling demos.`;

    return {
      id: `closet-${idx + 1}`,
      name,
      tag: category,
      category,
      size,
      colors,
      seasons,
      brand,
      price,
      link,
      notes,
      tile,
      slugName: slugify(name),
      slugCategory: slugify(category),
    };
  });
}

function inferCategory(name) {
  const n = String(name || "").toLowerCase();

  // Specific buckets first.
  if (/(tote|shoulder bag|bag|clutch)\b/.test(n)) return "Bags";
  if (/(earring|necklace|bangle|ring|hat)\b/.test(n)) return "Accessories";
  if (/(trench|coat|jacket|blazer)\b/.test(n)) return "Outerwear";
  if (/(sandal|mule|heel|slingback|boot|sneaker|shoe)\b/.test(n)) return "Shoes";
  if (/\bdress\b/.test(n)) return "Dresses";

  // Bottoms.
  if (/(skirt|trouser|pant|pants|jean|denim|short)\b/.test(n)) return "Bottoms";

  // Tops / sets / misc clothing.
  if (/(top|tank|cami|shirt|blouse|cardigan|sweater|knit|corset|vest|wrap)\b/.test(n)) return "Tops";

  // Default fallback.
  return sampleFrom(CLOSET_CATEGORIES, slugify(name).length || 0);
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
  const showWishlistBadge = gridEl.dataset.wishlist === "true";
  const isCloset = gridEl.dataset.closet === "true";
  const isOutfits = gridEl.dataset.outfits === "true";
  const basePath = getBasePath();
  gridEl.innerHTML = items
    .map(
      (p) => `
      <li class="card ns-product" aria-label="Product ${escapeHtml(p.name)}">
        <a class="ns-product-link" href="${
          isCloset
            ? `${basePath}closet/${encodeURIComponent(p.category || p.slugCategory || "item")}/${encodeURIComponent(
                p.name,
              )}`
            : "#"
        }" ${isCloset ? `data-closet-id="${escapeHtml(p.id)}"` : ""} aria-label="${escapeHtml(p.name)}">
          <div class="card-media ns-product-media${isOutfits ? " outfit-media" : ""}" style="${
            p.tile ? `--tile:${escapeHtml(p.tile)}` : isOutfits ? "--tile:#e5e7eb" : ""
          }">
            <div class="color-block" aria-hidden="true"></div>
            ${
              showWishlistBadge
                ? `
              <span class="ns-wishlist-heart" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m12 19.056 -0.288 -0.24C5.52 13.776 3.84 12 3.84 9.12c0 -2.4 1.92 -4.32 4.32 -4.32 1.968 0 3.072 1.104 3.84 1.968 0.768 -0.864 1.872 -1.968 3.84 -1.968 2.4 0 4.32 1.92 4.32 4.32 0 2.88 -1.68 4.656 -7.872 9.696zM8.16 5.76c-1.872 0 -3.36 1.488 -3.36 3.36 0 2.448 1.536 4.08 7.2 8.688 5.664 -4.608 7.2 -6.24 7.2 -8.688 0 -1.872 -1.488 -3.36 -3.36 -3.36 -1.68 0 -2.592 1.008 -3.312 1.824L12 8.208l-0.528 -0.624C10.752 6.768 9.84 5.76 8.16 5.76"/>
                </svg>
              </span>
              `
                : ""
            }
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
  if (!gridEl) return;
  const resultsMetaEl = byId("resultsMeta");
  const prevBtn = byId("prevBtn");
  const nextBtn = byId("nextBtn");
  const pageNumbersEl = byId("pageNumbers");
  const sortSelect = byId("sortSelect");
  const galleryBtn = document.querySelector(".ns-toggle-gallery");
  const compactBtn = document.querySelector(".ns-toggle-compact");

  const isCloset = gridEl.dataset.closet === "true";
  const isOutfits = gridEl.dataset.outfits === "true";
  const allProducts = isCloset
    ? buildClosetList(PRODUCTS)
    : isOutfits
      ? buildOutfitList(OUTFITS)
      : buildProductList(PRODUCTS);

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
    // If closet detail is open, never render the list/pagination.
    const detailEl = byId("closetDetail");
    if (isCloset && detailEl && !detailEl.hidden) return;

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

  function getClosetItemFromPath() {
    const basePath = getBasePath();
    const pathname = window.location.pathname;
    if (!pathname.startsWith(basePath)) return null;
    const rel = pathname.slice(basePath.length);
    const parts = rel.split("/").filter(Boolean);
    if (parts[0] !== "closet") return null;
    // /closet/ => list view
    if (parts.length < 3) return null;
    const rawCategory = decodeURIComponent(parts[1] || "");
    const rawName = decodeURIComponent(parts[2] || "");
    const catSlug = slugify(rawCategory);
    const nameSlug = slugify(rawName);
    return (
      allProducts.find(
        (it) =>
          (slugify(it.category || "") === catSlug && slugify(it.name || "") === nameSlug) ||
          (String(it.category || "").toLowerCase() === String(rawCategory).toLowerCase() &&
            String(it.name || "").toLowerCase() === String(rawName).toLowerCase()),
      ) || null
    );
  }

  function formatPrice(value) {
    if (typeof value === "number" && Number.isFinite(value)) return `$${value.toFixed(0)}`;
    return value ? String(value) : "—";
  }

  function setClosetHeaderForList() {
    const headerEl = document.querySelector("redress-page-header");
    if (!headerEl) return;
    headerEl.setAttribute("active", "closet");
    headerEl.setAttribute("title", "Closet");
    headerEl.setAttribute("subtitle", "All your items, organized in one place.");
    headerEl.setAttribute("crumb", "Closet");
    headerEl.removeAttribute("hide-title");
    headerEl.removeAttribute("parent-title");
    headerEl.removeAttribute("parent-href");
    document.title = "Redress — Closet";
  }

  function setClosetHeaderForDetail(item) {
    const headerEl = document.querySelector("redress-page-header");
    if (!headerEl) return;
    const basePath = getBasePath();
    const categoryHref = `${basePath}closet/${encodeURIComponent(item.category || "Category")}/`;
    headerEl.setAttribute("active", "closet");
    headerEl.setAttribute("crumb", item.name);
    headerEl.setAttribute("parent-title", "Closet");
    headerEl.setAttribute("parent-href", `${basePath}closet/`);
    headerEl.setAttribute("parent2-title", item.category || "Category");
    headerEl.setAttribute("parent2-href", categoryHref);
    headerEl.setAttribute("hide-title", "true");
    document.title = `Redress — ${item.name}`;
  }

  function showClosetList() {
    const collectionEl = document.querySelector(".collection");
    const detailEl = byId("closetDetail");
    if (collectionEl) collectionEl.hidden = false;
    if (detailEl) detailEl.hidden = true;
    setClosetHeaderForList();
    currentPage = getPageFromUrl();
    render(currentPage);
  }

  function showClosetDetail(item, { push = true } = {}) {
    const collectionEl = document.querySelector(".collection");
    const detailEl = byId("closetDetail");
    if (!detailEl) return;
    if (collectionEl) collectionEl.hidden = true;
    detailEl.hidden = false;

    setClosetHeaderForDetail(item);

    const titleEl = byId("closetDetailTitle");
    const catEl = byId("closetDetailCategory");
    const sizeEl = byId("closetDetailSize");
    const colorsEl = byId("closetDetailColors");
    const seasonsEl = byId("closetDetailSeasons");
    const brandEl = byId("closetDetailBrand");
    const priceEl = byId("closetDetailPrice");
    const linkEl = byId("closetDetailLink");
    const notesEl = byId("closetDetailNotes");
    const colorEl = byId("closetDetailColor");

    if (titleEl) titleEl.textContent = item.name;
    if (catEl) catEl.textContent = item.category || "—";
    if (sizeEl) sizeEl.textContent = item.size || "—";
    if (colorsEl) colorsEl.textContent = (item.colors || []).join(", ") || "—";
    if (seasonsEl) seasonsEl.textContent = (item.seasons || []).join(", ") || "—";
    if (brandEl) brandEl.textContent = item.brand || "—";
    if (priceEl) priceEl.textContent = formatPrice(item.price);
    if (linkEl) {
      linkEl.href = item.link || "#";
      linkEl.textContent = item.link ? "Open link" : "—";
    }
    if (notesEl) notesEl.textContent = item.notes || "";
    if (colorEl) colorEl.style.setProperty("--tile", item.tile || "#e7dfd2");

    if (push) {
      const basePath = getBasePath();
      const url = `${basePath}closet/${encodeURIComponent(item.category || "Item")}/${encodeURIComponent(item.name)}`;
      window.history.pushState({ closet: true, itemId: item.id }, "", url);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  window.addEventListener("popstate", () => {
    if (isCloset) {
      const item = getClosetItemFromPath();
      if (item) showClosetDetail(item, { push: false });
      else showClosetList();
      return;
    }
    currentPage = getPageFromUrl();
    render(currentPage);
  });

  if (isCloset) {
    // No click interception: closet items navigate to pre-generated static pages.
  }

  const yearEl = byId("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  setLayout(getInitialLayout());
  if (isCloset) {
    const item = getClosetItemFromPath();
    if (item) showClosetDetail(item, { push: false });
    else showClosetList();
  } else {
    render(currentPage);
  }
}

main();
