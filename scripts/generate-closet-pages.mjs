import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = process.cwd();

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
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

function inferCategory(name) {
  const n = String(name || "").toLowerCase();

  if (/(tote|shoulder bag|bag|clutch)\b/.test(n)) return "Bags";
  if (/(earring|necklace|bangle|ring|hat)\b/.test(n)) return "Accessories";
  if (/(trench|coat|jacket|blazer)\b/.test(n)) return "Outerwear";
  if (/(sandal|mule|heel|slingback|boot|sneaker|shoe)\b/.test(n)) return "Shoes";
  if (/\bdress\b/.test(n)) return "Dresses";
  if (/(skirt|trouser|pant|pants|jean|denim|short)\b/.test(n)) return "Bottoms";
  if (/(top|tank|cami|shirt|blouse|cardigan|sweater|knit|corset|vest|wrap)\b/.test(n)) return "Tops";

  // Fallback (stable-ish).
  return sampleFrom(CLOSET_CATEGORIES, slugify(name).length || 0);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safePathSegment(str) {
  // Keep spaces (so URL becomes %20) but avoid path separators and odd control chars.
  return String(str)
    .trim()
    .replaceAll("/", " - ")
    .replaceAll("\\", " - ")
    .replaceAll(/\s+/g, " ")
    .replaceAll(/\p{Cc}+/gu, "");
}

function extractProductsFromAppJs(appJsText) {
  const match = appJsText.match(/const PRODUCTS\s*=\s*\[([\s\S]*?)\];/m);
  if (!match) throw new Error("Could not find PRODUCTS array in app.js");
  const body = match[1];
  const out = [];
  const re = /"([^"\\]*(?:\\.[^"\\]*)*)"\s*,?/g;
  let m;
  // Strings in this repo are simple; this covers basic escape sequences.
  while ((m = re.exec(body))) {
    out.push(m[1].replaceAll('\\"', '"'));
  }
  if (out.length === 0) throw new Error("Parsed 0 PRODUCTS from app.js");
  return out;
}

const CLOSET_CATEGORIES = ["Tops", "Bottoms", "Shoes", "Outerwear", "Bags", "Accessories", "Dresses"];
const CLOSET_SIZES = ["XS", "S", "M", "L"];
const CLOSET_COLORS = ["Sage", "Stone", "Ivory", "Sand", "Black", "Navy"];
const CLOSET_SEASONS = ["Spring", "Summer", "Fall", "Winter"];
const CLOSET_BRANDS = ["Redress", "Cult Gaia", "Meshki", "Aritzia", "Zara", "COS"];
const CLOSET_TILES = ["#bac8c3", "#d9d2c7", "#e7dfd2", "#c8c7ba", "#393939", "#4b5563"];

function buildClosetItems(names) {
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
      name,
      category,
      size,
      colors,
      seasons,
      brand,
      price,
      link,
      notes,
      tile,
    };
  });
}

function renderItemPage(item) {
  // Path depth: /closet/<Category>/<Item name>/index.html
  const cssPath = "../../../styles.css";
  const componentsPath = "../../../components/components.js";
  const closetRootHref = "../../";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(`Redress — ${item.name}`)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${cssPath}" />
  </head>
  <body class="redress-app">
    <a class="skip-link" href="#main">Skip to content</a>
    <redress-header active="closet"></redress-header>

    <main id="main" class="page ob-page">
      <redress-page-header
        active="closet"
        crumb="${escapeHtml(item.name)}"
        parent-title="Closet"
        parent-href="${closetRootHref}"
        parent2-title="${escapeHtml(item.category)}"
        hide-title="true"
      ></redress-page-header>

      <section class="closet-detail" aria-label="Item details">
        <div class="closet-detail-layout">
          <div class="closet-detail-media" aria-label="Item image">
            <div class="closet-detail-image" style="--tile:${escapeHtml(item.tile)}">
              <div class="color-block" aria-hidden="true"></div>
            </div>
          </div>

          <div class="closet-detail-info" aria-label="Item info">
            <h2 class="closet-detail-title">${escapeHtml(item.name)}</h2>
            <div class="closet-attrs" role="list" aria-label="Item attributes">
              <div class="closet-attr-row" role="listitem"><div class="closet-attr-key">Category</div><div class="closet-attr-val">${escapeHtml(item.category)}</div></div>
              <div class="closet-attr-row" role="listitem"><div class="closet-attr-key">Size</div><div class="closet-attr-val">${escapeHtml(item.size)}</div></div>
              <div class="closet-attr-row" role="listitem"><div class="closet-attr-key">Colors</div><div class="closet-attr-val">${escapeHtml(item.colors.join(", "))}</div></div>
              <div class="closet-attr-row" role="listitem"><div class="closet-attr-key">Seasons</div><div class="closet-attr-val">${escapeHtml(item.seasons.join(", "))}</div></div>
              <div class="closet-attr-row" role="listitem"><div class="closet-attr-key">Brand</div><div class="closet-attr-val">${escapeHtml(item.brand)}</div></div>
              <div class="closet-attr-row" role="listitem"><div class="closet-attr-key">Price</div><div class="closet-attr-val">${escapeHtml(`$${Math.round(item.price)}`)}</div></div>
              <div class="closet-attr-row" role="listitem"><div class="closet-attr-key">Link</div><div class="closet-attr-val"><a href="${escapeHtml(
                item.link,
              )}" target="_blank" rel="noreferrer">Open link</a></div></div>
              <div class="closet-attr-row is-notes" role="listitem"><div class="closet-attr-key">Notes</div><div class="closet-attr-val closet-notes">${escapeHtml(
                item.notes,
              )}</div></div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <redress-footer></redress-footer>
    <script src="${componentsPath}"></script>
  </body>
</html>
`;
}

function writeFileEnsuringDir(path, contents) {
  ensureDir(dirname(path));
  writeFileSync(path, contents, "utf8");
}

function main() {
  const appJsPath = join(ROOT, "app.js");
  const appJs = readFileSync(appJsPath, "utf8");
  const names = extractProductsFromAppJs(appJs);
  const items = buildClosetItems(names);

  let count = 0;
  for (const item of items) {
    const categorySeg = safePathSegment(item.category);
    const nameSeg = safePathSegment(item.name);
    const outPath = join(ROOT, "closet", categorySeg, nameSeg, "index.html");
    writeFileEnsuringDir(outPath, renderItemPage(item));
    count += 1;
  }

  // Also ensure the closet root exists (already does), but keep this for safety.
  ensureDir(join(ROOT, "closet"));

  // eslint-disable-next-line no-console
  console.log(`Generated ${count} closet detail pages.`);
}

main();

