"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PRODUCTS } from "../_lib/products";

const PAGE_SIZE_COMPACT = 24; // 4-col mode
const PAGE_SIZE_GALLERY = 54; // 9-col mode (6 full rows)
const LAYOUT_KEY = "ns:gridLayout";

export function ProductListingPage({ wishlist = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allProducts = useMemo(() => buildProductList(PRODUCTS), []);

  const [sortMode, setSortMode] = useState("featured");
  const [layout, setLayout] = useState("compact"); // "compact" | "gallery"
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => applySort(allProducts, sortMode), [allProducts, sortMode]);
  const pageSize = layout === "gallery" ? PAGE_SIZE_GALLERY : PAGE_SIZE_COMPACT;
  const totalPages = useMemo(() => pageCount(sorted.length, pageSize), [sorted.length, pageSize]);
  const safePage = useMemo(() => clamp(page, 1, totalPages), [page, totalPages]);

  const pageSlice = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, safePage, pageSize]);

  const resultsMeta = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    const from = sorted.length === 0 ? 0 : start + 1;
    const to = start + pageSlice.length;
    return `Showing ${from}–${to} of ${sorted.length}`;
  }, [safePage, pageSize, sorted.length, pageSlice.length]);

  // Read initial layout preference from localStorage.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LAYOUT_KEY);
      if (saved === "gallery" || saved === "compact") setLayout(saved);
    } catch {
      // ignore
    }
  }, []);

  // Sync page from URL (?page=...).
  useEffect(() => {
    const raw = Number.parseInt(searchParams.get("page") || "1", 10);
    const next = Number.isFinite(raw) && raw > 0 ? raw : 1;
    setPage(next);
  }, [searchParams]);

  // Keep body classes/dataset in sync with existing CSS expectations.
  useEffect(() => {
    document.body.classList.add("ns-serp-body");
    document.body.dataset.view = layout === "gallery" ? "-1" : "0";
    return () => {
      document.body.classList.remove("ns-serp-body");
      delete document.body.dataset.view;
    };
  }, [layout]);

  // If user navigated to an out-of-range page, fix the URL.
  useEffect(() => {
    if (safePage === page) return;
    setPageInUrl({ pathname, router, page: safePage });
  }, [safePage, page, pathname, router]);

  function onPage(nextPage) {
    const clamped = clamp(nextPage, 1, totalPages);
    setPage(clamped);
    setPageInUrl({ pathname, router, page: clamped });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onLayout(nextLayout) {
    const next = nextLayout === "gallery" ? "gallery" : "compact";
    setLayout(next);
    try {
      window.localStorage.setItem(LAYOUT_KEY, next);
    } catch {
      // ignore
    }
    // Keep pagination aligned to the chosen layout's page size.
    onPage(1);
  }

  return (
    <section className="collection" aria-label={wishlist ? "Wishlist items" : "Items"}>
      <div className="ns-controls-row">
        <div role="group" aria-label="Collection controls" className="ns-controls ns-flex ns-flex-nowrap ns-items-center">
          <div role="group" aria-label="Filter and sort" className="ns-actions ns-flex ns-flex-nowrap ns-items-center">
            <button className="pill" type="button">
              Filter
            </button>
            <label className="select" aria-label="Sort">
              <span className="select-label">Sort</span>
              <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
              </select>
            </label>
          </div>

          <div role="group" aria-label="Layout options" className="ns-grid-controls ns-flex ns-flex-nowrap ns-items-center">
            <button
              aria-pressed={layout === "gallery" ? "true" : "false"}
              aria-label="Set to gallery layout"
              className="ns-grid-toggle ns-toggle-gallery"
              type="button"
              onClick={() => onLayout("gallery")}
            >
              <svg
                aria-hidden="true"
                role="presentation"
                width="16.8"
                height="10.8"
                viewBox="0 0 14 10"
                fill="#bac8c3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 .5h4v4H0zM0 5.5h4v4H0zM5 .5h4v4H5zM5 5.5h4v4H5zM10 .5h4v4h-4zM10 5.5h4v4h-4z" />
              </svg>
            </button>
            <button
              aria-pressed={layout === "compact" ? "true" : "false"}
              aria-label="Set to 4 column layout"
              className="ns-grid-toggle ns-toggle-compact"
              type="button"
              onClick={() => onLayout("compact")}
            >
              <svg
                aria-hidden="true"
                role="presentation"
                xmlns="http://www.w3.org/2000/svg"
                width="20.4"
                height="12"
                viewBox="0 0 88 58"
                fill="#bac8c3"
              >
                <g clipPath="url(#ns-clip-001)">
                  <path d="M20 0H0V58H20V0Z" />
                  <path d="M43 0H22V58H43V0Z" />
                  <path d="M45 0H65V58H45V0Z" />
                  <path d="M88 0H67V58H88V0Z" />
                </g>
                <defs>
                  <clipPath id="ns-clip-001">
                    <rect width="88" height="58" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="results-meta" id="resultsMeta" aria-live="polite">
        {resultsMeta}
      </div>

      <ol
        className="grid ns-serp"
        id="ns-product-grid"
        data-layout={layout}
        data-wishlist={wishlist ? "true" : undefined}
        aria-live="polite"
      >
        {pageSlice.map((p) => (
          <li className="card ns-product" key={p.id} aria-label={`Product ${p.name}`}>
            <a className="ns-product-link" href="#" aria-label={p.name}>
              <div className="card-media ns-product-media">
                <div className="color-block" aria-hidden="true" />
                {wishlist ? (
                  <span className="ns-wishlist-heart" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.8 4.9c-1.9-1.9-5.1-1.9-7 0l-.8.8-.8-.8c-1.9-1.9-5.1-1.9-7 0-1.9 1.9-1.9 5.1 0 7l.8.8L12 21l4.2-8.3.8-.8c1.9-1.9 1.9-5.1 0-7z" />
                    </svg>
                  </span>
                ) : null}
              </div>
              <div className="ns-product-info">
                <div className="card-meta ns-product-tag">{p.tag}</div>
                <div className="card-title ns-product-title">{p.name}</div>
              </div>
            </a>
          </li>
        ))}
      </ol>

      <div className="pagination" aria-label="Pagination">
        <button
          id="prevBtn"
          className="page-btn"
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPage(safePage - 1)}
        >
          Previous
        </button>
        <div id="pageNumbers" className="page-numbers" role="navigation" aria-label="Page numbers">
          {makePageRange(safePage, totalPages).map((token, idx) =>
            token === "…" ? (
              <span className="ellipsis" key={`ellipsis-${idx}`}>
                …
              </span>
            ) : (
              <button
                key={`page-${token}`}
                type="button"
                className="page-number"
                aria-current={token === safePage ? "page" : undefined}
                onClick={() => onPage(token)}
              >
                {token}
              </button>
            ),
          )}
        </div>
        <button
          id="nextBtn"
          className="page-btn"
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPage(safePage + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}

function setPageInUrl({ pathname, router, page }) {
  const url = new URL(window.location.href);
  url.pathname = pathname;
  url.searchParams.set("page", String(page));
  router.push(`${url.pathname}?${url.searchParams.toString()}`);
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
  const pages = new Set([1, total, current - 1, current, current + 1, current - 2, current + 2]);
  const list = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    out.push(list[i]);
    if (i < list.length - 1 && list[i + 1] - list[i] > 1) out.push("…");
  }
  return out;
}

