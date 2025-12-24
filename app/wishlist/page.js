import { Suspense } from "react";
import { RedressFooter } from "../_components/RedressFooter";
import { RedressHeader } from "../_components/RedressHeader";
import { RedressPageHeader } from "../_components/RedressPageHeader";
import { ProductListingPage } from "../_components/ProductListingPage";

export const metadata = {
  title: "Redress — Wishlist",
};

export default function WishlistPage() {
  return (
    <>
      <RedressHeader active="wishlist" />

      <main id="main" className="page ob-page">
        <RedressPageHeader title="Wishlist" crumb="Wishlist" subtitle="Saved pieces you love." />
        <Suspense fallback={null}>
          <ProductListingPage wishlist />
        </Suspense>
      </main>

      <RedressFooter />
    </>
  );
}

