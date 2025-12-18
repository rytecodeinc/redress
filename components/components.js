class RedressHeader extends HTMLElement {
  connectedCallback() {
    const active = (this.getAttribute("active") || "").trim();
    const basePath = getBasePath();
    const baseUrl = new URL(basePath, window.location.origin).toString();

    this.innerHTML = `
      <header class="site-header">
        <div class="header-inner">
          <div class="brand">
            <div class="brand-mark" aria-hidden="true">R</div>
            <div class="brand-text">
              <div class="brand-name">Redress</div>
              <div class="brand-sub">Digital Closet</div>
            </div>
          </div>

          <nav class="nav" aria-label="Primary">
            <a class="nav-link" data-nav="home" href="${baseUrl}">Home</a>
            <a class="nav-link" data-nav="closet" href="${new URL("closet/", baseUrl).toString()}">Closet</a>
            <a class="nav-link" data-nav="wishlist" href="${new URL("wishlist/", baseUrl).toString()}">Wishlist</a>
            <a class="nav-link" data-nav="outfit-builder" href="${new URL("outfit-builder/", baseUrl).toString()}">Outfit Builder</a>
            <a class="nav-link" data-nav="resale" href="#">Resale</a>
          </nav>

          <div class="header-actions">
            <button class="icon-btn" type="button" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7"></circle>
                <path d="M20 20l-3.2-3.2"></path>
              </svg>
            </button>
            <button class="icon-btn" type="button" aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"></path>
                <path d="M13.73 21a2 2 0 01-3.46 0"></path>
              </svg>
            </button>
            <button class="avatar" type="button" aria-label="Account">
              <span class="avatar-initials" aria-hidden="true">AJ</span>
            </button>
          </div>
        </div>
      </header>
    `;

    const links = this.querySelectorAll("[data-nav]");
    links.forEach((a) => {
      a.classList.toggle("nav-link-active", a.getAttribute("data-nav") === active);
    });
  }
}

class RedressFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <div>© <span data-year></span> Redress</div>
          <div class="footer-links">
            <a href="#">Help</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    `;
    const yearEl = this.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }
}

class RedressPageHeader extends HTMLElement {
  connectedCallback() {
    const active = (this.getAttribute("active") || "").trim();
    const title = this.getAttribute("title") || "";
    const subtitle = this.getAttribute("subtitle") || "";
    const crumb = this.getAttribute("crumb") || title || "";
    const showHomeLink = this.getAttribute("home-link") !== "false";

    const basePath = getBasePath();
    const baseUrl = new URL(basePath, window.location.origin).toString();

    const crumbsHtml = showHomeLink
      ? `
        <a href="${baseUrl}">Home</a>
        <span class="crumb-sep" aria-hidden="true">/</span>
        <span aria-current="page">${escapeHtml(crumb)}</span>
      `
      : `
        <span aria-current="page">${escapeHtml(crumb || "Home")}</span>
      `;

    // Reuse the Outfit Builder header structure/classes everywhere.
    this.innerHTML = `
      <div class="page-top ob-top">
        <div class="ob-header-row">
          <div class="breadcrumbs-row ob-breadcrumb-row">
            <div class="breadcrumbs" aria-label="Breadcrumb">
              ${crumbsHtml}
            </div>
          </div>

          <div class="title-row ob-title-row">
            <div>
              <h1 class="page-title">${escapeHtml(title)}</h1>
              <p class="page-subtitle">${escapeHtml(subtitle)}</p>
            </div>
          </div>

          <div class="ob-header-spacer" aria-hidden="true"></div>
        </div>
      </div>
    `;

    // Optional: keep active attribute for future use/inspection.
    this.dataset.active = active;
  }
}

customElements.define("redress-header", RedressHeader);
customElements.define("redress-footer", RedressFooter);
customElements.define("redress-page-header", RedressPageHeader);

function getBasePath() {
  // Supports GitHub Pages project sites (e.g. /Redress/...) and local root (/).
  const { hostname, pathname } = window.location;
  const segments = pathname.split("/").filter(Boolean);
  if (hostname.endsWith("github.io") && segments.length >= 1) {
    return `/${segments[0]}/`;
  }
  return "/";
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

