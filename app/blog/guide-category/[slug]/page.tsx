import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogSidebar } from "@/components/BlogSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BlogCard } from "@/components/BlogCard";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { getGuideCategories, getGuideCategory } from "@/lib/api";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getGuideCategory(slug);

  if (!data) {
    return buildMetadata({
      title: "Guide Category Not Found",
      description: "This guide category could not be found.",
      canonical: `/blog/guide-category/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: `${data.category.name} Safari Guides`,
    description: `Browse ${data.category.name.toLowerCase()} safari guides from Kennice Tours Limited.`,
    canonical: `/blog/guide-category/${slug}`,
    noindex: data.category.guide_count === 0,
  });
}

export async function generateStaticParams() {
  const categories = await getGuideCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function GuideCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [data, categories] = await Promise.all([getGuideCategory(slug), getGuideCategories()]);

  if (!data) {
    notFound();
  }

  const { category, guides } = data;
  const canonical = `/blog/guide-category/${category.slug}`;

  return (
    <div className="archive-shell">
      <div className="archive-hero">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: category.name },
          ]}
        />
        <SectionHeading
          title={category.name}
          body={`Browse ${category.guide_count} published guides in this category.`}
          level="h1"
        />
      </div>
      <div className="blog-archive-layout">
        <div className="grid cards-3">
          {guides.length ? (
            guides.map((guide) => (
              <BlogCard key={guide.id} guide={guide} />
            ))
          ) : (
            <article className="card card-copy empty-state-card">
              <h3>No published guides in this category yet</h3>
              <p>Assign this category to a published guide in admin and it will appear here.</p>
            </article>
          )}
        </div>
        <aside>
          <BlogSidebar categories={categories} guides={guides} currentCategorySlug={category.slug} />
        </aside>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: `${category.name} Safari Guides`,
              url: absoluteUrl(canonical),
              description: `Browse ${category.name.toLowerCase()} safari guides from Kennice Tours Limited.`,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
                { "@type": "ListItem", position: 3, name: category.name, item: absoluteUrl(canonical) },
              ],
            },
          ],
        }}
      />
    </div>
  );
}
