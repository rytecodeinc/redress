import { Suspense } from "react";
import { RedressFooter } from "../_components/RedressFooter";
import { RedressHeader } from "../_components/RedressHeader";
import { RedressPageHeader } from "../_components/RedressPageHeader";
import { ProductListingPage } from "../_components/ProductListingPage";

export const metadata = {
  title: "Redress — Closet",
};

export default function ClosetPage() {
  return (
    <>
      <RedressHeader active="closet" />

      <main id="main" className="page ob-page">
        <RedressPageHeader title="Closet" crumb="Closet" subtitle="All your items, organized in one place." />
        <Suspense fallback={null}>
          <ProductListingPage wishlist={false} />
        </Suspense>
      </main>

      <RedressFooter />
    </>
  );
}

