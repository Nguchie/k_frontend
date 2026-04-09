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

export default async function BlogPage() {
  const [guides, categories] = await Promise.all([getAllGuides(), getGuideCategories()]);

  return (
    <div className="archive-shell">
      <div className="archive-hero">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
        <SectionHeading
          title="Safari Guides"
          body="Use these guides to plan timing, packing, routes, and the right safari style before booking."
          level="h1"
        />
      </div>
      <div className="blog-archive-layout">
        <div className="grid cards-3">
          {guides.map((guide) => (
            <BlogCard key={guide.id} guide={guide} />
          ))}
        </div>
        <aside>
          <BlogSidebar categories={categories} guides={guides} />
        </aside>
      </div>
    </div>
  );
}
