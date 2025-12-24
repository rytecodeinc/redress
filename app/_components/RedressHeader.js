"use client";

import Link from "next/link";

export function RedressHeader({ active = "" }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            R
          </div>
          <div className="brand-text">
            <div className="brand-name">Redress</div>
            <div className="brand-sub">Digital Closet</div>
          </div>
        </div>

        <nav className="nav" aria-label="Primary">
          <Link className={navClass(active === "home")} data-nav="home" href="/">
            Home
          </Link>
          <Link className={navClass(active === "closet")} data-nav="closet" href="/closet">
            Closet
          </Link>
          <Link className={navClass(active === "wishlist")} data-nav="wishlist" href="/wishlist">
            Wishlist
          </Link>
          <Link
            className={navClass(active === "outfit-builder")}
            data-nav="outfit-builder"
            href="/outfit-builder"
          >
            Outfit Builder
          </Link>
          <a className="nav-link" data-nav="resale" href="#">
            Resale
          </a>
        </nav>

        <div className="header-actions">
          <button className="icon-btn" type="button" aria-label="Search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.2-3.2" />
            </svg>
          </button>
          <button className="icon-btn" type="button" aria-label="Notifications">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
          <button className="avatar" type="button" aria-label="Account">
            <span className="avatar-initials" aria-hidden="true">
              AJ
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function navClass(isActive) {
  return `nav-link${isActive ? " nav-link-active" : ""}`;
}

