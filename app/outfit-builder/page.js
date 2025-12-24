import { RedressFooter } from "../_components/RedressFooter";
import { RedressHeader } from "../_components/RedressHeader";
import { RedressPageHeader } from "../_components/RedressPageHeader";
import { OutfitBuilderClient } from "./OutfitBuilderClient";

export const metadata = {
  title: "Redress — Outfit Builder",
};

export default function OutfitBuilderPage() {
  return (
    <>
      <RedressHeader active="outfit-builder" />

      <main id="main" className="page ob-page">
        <RedressPageHeader
          title="Outfit Builder"
          crumb="Outfit Builder"
          subtitle="Click or drag items onto the canvas to build a look."
        />
        <OutfitBuilderClient />
      </main>

      <RedressFooter />
    </>
  );
}

