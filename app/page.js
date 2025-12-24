import Link from "next/link";
import { RedressFooter } from "./_components/RedressFooter";
import { RedressHeader } from "./_components/RedressHeader";
import { RedressPageHeader } from "./_components/RedressPageHeader";

export const metadata = {
  title: "Redress — Home",
};

export default function HomePage() {
  return (
    <>
      <RedressHeader active="home" />

      <main id="main" className="page">
        <RedressPageHeader
          title="Redress"
          crumb="Home"
          subtitle="Your digital closet—organized, searchable, and ready to style."
          homeLink={false}
        />

        <section className="home-hero" aria-label="Hero">
          <div className="home-hero-inner">
            <div className="home-hero-copy">
              <div className="home-hero-kicker">Digital closet • Outfit builder • Planning</div>
              <h2 className="home-hero-title">See your wardrobe clearly. Build outfits in minutes.</h2>
              <p className="home-hero-subtitle">
                Upload items, tag what you own, and create outfits on a drag-and-drop canvas—so getting dressed is
                simple.
              </p>
              <div className="home-hero-cta">
                <Link className="pill pill-primary" href="/closet">
                  Open Closet
                </Link>
                <Link className="pill" href="/outfit-builder">
                  Try Outfit Builder
                </Link>
              </div>
            </div>

            <div className="home-hero-preview" aria-hidden="true">
              <div className="home-preview-grid">
                <div className="home-preview-tile" />
                <div className="home-preview-tile" />
                <div className="home-preview-tile" />
                <div className="home-preview-tile" />
                <div className="home-preview-tile" />
                <div className="home-preview-tile" />
                <div className="home-preview-tile" />
                <div className="home-preview-tile" />
              </div>
            </div>
          </div>
        </section>

        <section className="home-features" aria-label="Features">
          <h3 className="home-section-title">Features</h3>
          <div className="home-feature-grid">
            <div className="home-feature">
              <div className="home-feature-title">Smart organization</div>
              <div className="home-feature-body">
                Categorize, tag, and search your closet by color, type, season, and more.
              </div>
            </div>
            <div className="home-feature">
              <div className="home-feature-title">Outfit Builder canvas</div>
              <div className="home-feature-body">
                Drag items onto a canvas, resize, and arrange to create a look you can reuse.
              </div>
            </div>
            <div className="home-feature">
              <div className="home-feature-title">Plan faster</div>
              <div className="home-feature-body">Save outfits and revisit them for events, trips, or weekly planning.</div>
            </div>
            <div className="home-feature">
              <div className="home-feature-title">Cleaner closet decisions</div>
              <div className="home-feature-body">Spot gaps, reduce duplicates, and make intentional purchases.</div>
            </div>
          </div>
        </section>

        <section className="home-faq" aria-label="FAQ">
          <h3 className="home-section-title">FAQ</h3>
          <div className="home-faq-list">
            <details className="home-faq-item">
              <summary>How do I add items to my closet?</summary>
              <div className="home-faq-body">
                Start with placeholders now; later you can upload photos and add details like brand, size, and notes.
              </div>
            </details>
            <details className="home-faq-item">
              <summary>Can I build outfits on desktop and mobile?</summary>
              <div className="home-faq-body">Yes. The Outfit Builder is designed to work across screen sizes.</div>
            </details>
            <details className="home-faq-item">
              <summary>Can I delete items and outfits?</summary>
              <div className="home-faq-body">Yes—remove items from the canvas, clear the canvas, and manage your closet as you go.</div>
            </details>
          </div>
        </section>

        <section className="home-reviews" aria-label="Reviews">
          <h3 className="home-section-title">What users say</h3>
          <div className="home-review-grid">
            <div className="home-review">
              <div className="home-review-quote">“I finally know what I own. I stopped buying duplicates.”</div>
              <div className="home-review-meta">Alyssa • Closet organizer</div>
            </div>
            <div className="home-review">
              <div className="home-review-quote">“The canvas makes outfit planning feel effortless.”</div>
              <div className="home-review-meta">Jules • Outfit planner</div>
            </div>
            <div className="home-review">
              <div className="home-review-quote">“Clean, simple, and the grid is gorgeous.”</div>
              <div className="home-review-meta">Morgan • Daily user</div>
            </div>
          </div>
        </section>
      </main>

      <RedressFooter />
    </>
  );
}

