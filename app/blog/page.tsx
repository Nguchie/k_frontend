import type { Metadata } from "next";
import { Suspense } from "react";

import { BlogArchive } from "@/components/BlogArchive";
import { getAllGuides, getGuideCategories } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

// Statically rendered + ISR. Do not await searchParams here — that makes the
// route dynamic and every `/blog?country=…` variant a function invocation.
// Country filtering is applied client-side in BlogArchive.
export const revalidate = 3600;
export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Safari Guides",
  description: "Read safari guides on timing, packing, routes, and destination planning before you book.",
  canonical: "/blog",
});

export default async function BlogPage() {
  const [guides, categories] = await Promise.all([getAllGuides(), getGuideCategories()]);

  return (
    <div className="archive-shell">
      <Suspense fallback={<BlogArchiveFallback />}>
        <BlogArchive guides={guides} categories={categories} />
      </Suspense>
    </div>
  );
}

function BlogArchiveFallback() {
  return (
    <div className="archive-hero">
      <p className="eyebrow">Safari Guides</p>
      <h1>Safari Guides</h1>
    </div>
  );
}
