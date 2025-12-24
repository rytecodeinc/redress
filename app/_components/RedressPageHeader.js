"use client";

import Link from "next/link";

export function RedressPageHeader({ title, subtitle, crumb, homeLink = true }) {
  const safeTitle = title || "";
  const safeCrumb = crumb || safeTitle || "";

  return (
    <div className="page-top ob-top">
      <div className="ob-header-row">
        <div className="breadcrumbs-row ob-breadcrumb-row">
          <div className="breadcrumbs" aria-label="Breadcrumb">
            {homeLink ? (
              <>
                <Link href="/">Home</Link>
                <span className="crumb-sep" aria-hidden="true">
                  /
                </span>
                <span aria-current="page">{safeCrumb}</span>
              </>
            ) : (
              <span aria-current="page">{safeCrumb || "Home"}</span>
            )}
          </div>
        </div>

        <div className="title-row ob-title-row">
          <div>
            <h1 className="page-title">{safeTitle}</h1>
            <p className="page-subtitle">{subtitle || ""}</p>
          </div>
        </div>

        <div className="ob-header-spacer" aria-hidden="true" />
      </div>
    </div>
  );
}

