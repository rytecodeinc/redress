"use client";

import { useEffect } from "react";
import { initOutfitBuilder } from "../_lib/outfitBuilder";

export function OutfitBuilderClient() {
  useEffect(() => {
    document.body.classList.add("page-outfit-builder");
    const cleanup = initOutfitBuilder({ root: document });
    return () => {
      cleanup?.();
      document.body.classList.remove("page-outfit-builder");
    };
  }, []);

  return (
    <section className="ob-layout" aria-label="Outfit builder">
      <div className="ob-main">
        <div className="ob-panels">
          <div className="ob-canvas-panel" aria-label="Canvas">
            <div className="ob-panel-head ob-canvas-head">
              <button className="pill ob-download-canvas" type="button">
                Download
              </button>
              <div className="ob-canvas-actions">
                <button className="pill ob-clear-canvas" type="button">
                  Clear canvas
                </button>
                <button className="pill ob-delete-selected" type="button" disabled>
                  Delete selected
                </button>
              </div>
            </div>
            <div className="ob-canvas-hint">Drag items here to create your outfit collage.</div>
            <div id="obCanvas" className="ob-canvas" role="application" aria-label="Outfit canvas" />
          </div>

          <div className="ob-grid-panel" aria-label="Items">
            <div className="ob-filters-bar" aria-label="Filters">
              <div className="ob-filters-left">
                <div className="ob-filter-group" aria-label="Category filters">
                  <div className="ob-filter-title">Category</div>
                  <div className="ob-chips">
                    <label className="ob-chip">
                      <input type="checkbox" name="cat" value="Tops" />
                      <span>Tops</span>
                    </label>
                    <label className="ob-chip">
                      <input type="checkbox" name="cat" value="Bottoms" />
                      <span>Bottoms</span>
                    </label>
                    <label className="ob-chip">
                      <input type="checkbox" name="cat" value="Dresses" />
                      <span>Dresses</span>
                    </label>
                    <label className="ob-chip">
                      <input type="checkbox" name="cat" value="Shoes" />
                      <span>Shoes</span>
                    </label>
                    <label className="ob-chip">
                      <input type="checkbox" name="cat" value="Bags" />
                      <span>Bags</span>
                    </label>
                    <label className="ob-chip">
                      <input type="checkbox" name="cat" value="Accessories" />
                      <span>Accessories</span>
                    </label>
                  </div>
                </div>

                <div className="ob-filter-group" aria-label="Color filters">
                  <div className="ob-filter-title">Color</div>
                  <div className="ob-chips">
                    <label className="ob-chip">
                      <input type="checkbox" name="color" value="#c8c7ba" />
                      <span>
                        <span className="ob-swatch" style={{ "--tile": "#c8c7ba" }} />
                        Sand
                      </span>
                    </label>
                    <label className="ob-chip">
                      <input type="checkbox" name="color" value="#bac8c3" />
                      <span>
                        <span className="ob-swatch" style={{ "--tile": "#bac8c3" }} />
                        Sage
                      </span>
                    </label>
                    <label className="ob-chip">
                      <input type="checkbox" name="color" value="#d9d2c7" />
                      <span>
                        <span className="ob-swatch" style={{ "--tile": "#d9d2c7" }} />
                        Stone
                      </span>
                    </label>
                    <label className="ob-chip">
                      <input type="checkbox" name="color" value="#e7dfd2" />
                      <span>
                        <span className="ob-swatch" style={{ "--tile": "#e7dfd2" }} />
                        Ivory
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <button className="pill ob-clear-filters" type="button">
                Clear
              </button>
            </div>

            <div className="ob-panel-head">
              <div className="results-meta" id="obResultsMeta" aria-live="polite" />
              <div role="group" aria-label="Layout options" className="ns-grid-controls ns-flex ns-flex-nowrap ns-items-center">
                <button aria-pressed="false" aria-label="Set to gallery layout" className="ns-grid-toggle ob-toggle-gallery" type="button">
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
                <button aria-pressed="true" aria-label="Set to 4 column layout" className="ns-grid-toggle ob-toggle-compact" type="button">
                  <svg
                    aria-hidden="true"
                    role="presentation"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20.4"
                    height="12"
                    viewBox="0 0 88 58"
                    fill="#bac8c3"
                  >
                    <g clipPath="url(#ns-clip-ob-001)">
                      <path d="M20 0H0V58H20V0Z" />
                      <path d="M43 0H22V58H43V0Z" />
                      <path d="M45 0H65V58H45V0Z" />
                      <path d="M88 0H67V58H88V0Z" />
                    </g>
                    <defs>
                      <clipPath id="ns-clip-ob-001">
                        <rect width="88" height="58" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>

            <div className="ob-grid" id="obItemGrid" aria-live="polite" />
          </div>
        </div>
      </div>
    </section>
  );
}

