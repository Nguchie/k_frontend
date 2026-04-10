import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogSidebar } from "@/components/BlogSidebar";
import { BookingForm } from "@/components/BookingForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { TourCard } from "@/components/TourCard";
import { getAllGuides, getGuide, getGuideCategories } from "@/lib/api";
import { getImageSource } from "@/lib/media";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    return buildMetadata({
      title: "Guide Not Found",
      description: "This safari guide could not be found.",
      canonical: `/blog/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: guide.seo_title_en || guide.title_en,
    description: guide.meta_description_en || guide.excerpt_en,
    canonical: guide.canonical_url || `/blog/${slug}`,
  });
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [guide, categories, allGuides] = await Promise.all([
    getGuide(slug),
    getGuideCategories(),
    getAllGuides(),
  ]);

  if (!guide) {
    notFound();
  }

  const title = guide.title_en;
  const excerpt = guide.excerpt_en;
  const body = guide.body_en || "";
  const canonical = guide.canonical_url || `/blog/${slug}`;
  const guideImageSrc = getImageSource(guide.hero_image);
  const breadcrumbItems: Array<{ label: string; href?: string }> = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  if (guide.category?.slug) {
    breadcrumbItems.push({
      label: guide.category.name,
      href: `/blog/guide-category/${guide.category.slug}`,
    });
  }

  breadcrumbItems.push({ label: title });

  return (
    <div className="detail-shell">
      <div className="detail-content">
        <section className="detail-hero">
          <Breadcrumbs items={breadcrumbItems} />
          <h1>{title}</h1>
          <p>{excerpt}</p>
        </section>
        {guideImageSrc ? (
          <section className="detail-block">
            <div className="detail-media-frame">
              <img src={guideImageSrc} alt={guide.hero_image?.alt_text_en ?? title} />
            </div>
          </section>
        ) : null}
        <section className="detail-block">
          <SectionHeading title="Guide" />
          {renderParagraphs(body)}
        </section>
        {guide.destinations?.length ? (
          <section className="detail-block">
            <SectionHeading title="Related destination" />
            {guide.destinations.map((destination) => (
              <p key={destination.slug}>
                <Link href={`/destinations/${destination.country.slug}/${destination.slug}`} className="text-link">
                  {destination.name_en}
                </Link>
              </p>
            ))}
          </section>
        ) : null}
        {guide.tours?.length ? (
          <section className="detail-block">
            <SectionHeading title="Recommended tours" />
            <div className="grid cards-3">
              {guide.tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} compact />
              ))}
            </div>
          </section>
        ) : null}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                headline: title,
                description: guide.meta_description_en || excerpt,
                url: absoluteUrl(canonical),
                wordCount: body.split(/\s+/).filter(Boolean).length,
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                  { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
                  ...(guide.category?.slug
                    ? [{
                        "@type": "ListItem",
                        position: 3,
                        name: guide.category.name,
                        item: absoluteUrl(`/blog/guide-category/${guide.category.slug}`),
                      }]
                    : []),
                  {
                    "@type": "ListItem",
                    position: guide.category?.slug ? 4 : 3,
                    name: title,
                    item: absoluteUrl(canonical),
                  },
                ],
              },
            ],
          }}
        />
      </div>
      <aside className="detail-aside">
        <SectionHeading title="Turn research into a plan" body="Send your dates and interests if you want help turning this guide into a trip." />
        <BookingForm sourcePage={`/blog/${slug}`} compact />
        <BlogSidebar
          categories={categories}
          guides={allGuides}
          currentCategorySlug={guide.category?.slug}
          currentGuideSlug={guide.slug}
        />
      </aside>
    </div>
  );
}

function renderParagraphs(value?: string) {
  const text = value?.trim();
  if (!text) {
    return null;
  }

  return text.split(/\r?\n\r?\n+/).map((paragraph, index) => (
    <p key={index}>{paragraph.trim()}</p>
  ));
}
