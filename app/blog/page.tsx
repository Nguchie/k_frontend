import type { Metadata } from "next";

import { BlogSidebar } from "@/components/BlogSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BlogCard } from "@/components/BlogCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllGuides, getGuideCategories } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Safari Guides",
  description: "Read safari guides on timing, packing, routes, and destination planning before you book.",
  canonical: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParams;
  const [guides, categories] = await Promise.all([getAllGuides(), getGuideCategories()]);
  const country = typeof filters.country === "string" ? filters.country : "";
  const filteredGuides = country
    ? guides.filter((guide) =>
      guide.country?.slug === country
      || guide.destinations?.some((destination) => destination.country.slug === country),
    )
    : guides;
  const countryName = country
    ? (guides.find((guide) =>
      guide.country?.slug === country
      || guide.destinations?.some((destination) => destination.country.slug === country),
    )?.country?.name
      || guides.flatMap((guide) => guide.destinations || []).find((destination) => destination.country.slug === country)?.country.name
      || "")
    : "";

  return (
    <div className="archive-shell">
      <div className="archive-hero">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, ...(country ? [{ label: "Countries", href: "/countries" }, { label: countryName || country }] : []), { label: "Blog" }]} />
        <SectionHeading
          title={countryName ? `${countryName} Guides` : "Safari Guides"}
          body={countryName ? `Use these guides to plan routes, timing, and safari decisions in ${countryName}.` : "Use these guides to plan timing, packing, routes, and the right safari style before booking."}
          level="h1"
        />
      </div>
      <div className="blog-archive-layout">
        <div className="grid cards-3">
          {filteredGuides.map((guide) => (
            <BlogCard key={guide.id} guide={guide} />
          ))}
        </div>
        <aside>
          <BlogSidebar categories={categories} guides={filteredGuides} />
        </aside>
      </div>
    </div>
  );
}
