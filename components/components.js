class RedressHeader extends HTMLElement {
  connectedCallback() {
    const active = (this.getAttribute("active") || "").trim();

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
            <a class="nav-link" data-nav="home" href="./index.html">Home</a>
            <a class="nav-link" data-nav="closet" href="/closet/">Closet</a>
            <a class="nav-link" data-nav="outfit-builder" href="./outfit-builder.html">Outfit Builder</a>
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

customElements.define("redress-header", RedressHeader);
customElements.define("redress-footer", RedressFooter);

