import type { Metadata } from "next";
import { Suspense } from "react";

import { ToursArchive } from "@/components/ToursArchive";
import { getAllTours } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

// Statically rendered + ISR. Do not await searchParams here — that makes the
// route dynamic and every `/tours?q=…&budget=…` variant a function invocation.
// Filtering is applied client-side in ToursArchive.
export const revalidate = 3600;
export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Safari Tours",
  description: "Compare safari tours by destination, budget, duration, and travel style across East Africa.",
  canonical: "/tours",
});

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <div className="archive-shell">
      <Suspense fallback={<ToursArchiveFallback />}>
        <ToursArchive tours={tours} />
      </Suspense>
    </div>
  );
}

function ToursArchiveFallback() {
  return (
    <div className="archive-hero">
      <p className="eyebrow">Safari Tours</p>
      <h1>Safari Tours</h1>
    </div>
  );
}
