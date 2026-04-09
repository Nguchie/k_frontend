import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/BlogCard";
import { BookingForm } from "@/components/BookingForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { TourCard } from "@/components/TourCard";
import { getAllGuides, getAllTours, getDestination } from "@/lib/api";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}): Promise<Metadata> {
  const { country, slug } = await params;
  const destination = await getDestination(country, slug);

  if (!destination) {
    return buildMetadata({
      title: "Destination Not Found",
      description: "This safari destination could not be found.",
      canonical: `/destinations/${country}/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: destination.seo_title_en || destination.name_en,
    description: destination.meta_description_en || destination.summary_en,
    canonical: destination.canonical_url || `/destinations/${country}/${slug}`,
  });
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country, slug } = await params;
  const destination = await getDestination(country, slug);

  if (!destination) {
    notFound();
  }

  const [allTours, allGuides] = await Promise.all([getAllTours(), getAllGuides()]);
  const relatedTours = allTours.filter((tour) => tour.destination.slug === destination.slug);
  const relatedGuides = allGuides.filter((guide) => guide.destinations?.some((item) => item.slug === destination.slug));
  const name = destination.name_en;
  const summary = destination.summary_en;
  const canonical = destination.canonical_url || `/destinations/${country}/${slug}`;
  const aggregateRating = destination.reviews?.length
    ? {
        "@type": "AggregateRating",
        ratingValue: Number((destination.reviews.reduce((sum, review) => sum + review.rating, 0) / destination.reviews.length).toFixed(1)),
        reviewCount: destination.reviews.length,
        bestRating: 5,
        worstRating: 1,
      }
    : null;

  return (
    <div className="detail-shell">
      <div className="detail-content">
        <section className="detail-hero">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Destinations", href: "/destinations" },
              { label: destination.country.name },
              { label: name },
            ]}
          />
          <h1>{name}</h1>
          <p>{summary}</p>
          <div className="button-row">
            {destination.safari_styles?.map((style) => (
              <span className="pill" key={style}>
                {style}
              </span>
            ))}
          </div>
        </section>
        <section className="detail-block">
          <SectionHeading title="Wildlife and highlights" />
          <p>{destination.wildlife_en}</p>
        </section>
        <section className="detail-block">
          <SectionHeading title="Best time to visit" />
          <p>{destination.best_time_en}</p>
        </section>
        <section className="detail-block">
          <SectionHeading title="Travel tips" />
          <p>{destination.travel_tips_en}</p>
        </section>
        <section className="detail-block">
          <SectionHeading title="Recommended tours" body="Tour ideas that pair well with this destination." />
          <div className="grid cards-3">
            {relatedTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} compact />
            ))}
          </div>
        </section>
        <section className="detail-block">
          <SectionHeading title="Safari Guides" body="Useful planning articles related to this destination." />
          <div className="grid cards-3">
            {relatedGuides.map((guide) => (
              <BlogCard key={guide.id} guide={guide} />
            ))}
          </div>
        </section>
        {destination.map_embed_url ? (
          <section className="detail-block">
            <SectionHeading title="Map" />
            <div className="detail-map-frame">
              <iframe
                title={`${name} map`}
                src={destination.map_embed_url}
                width="100%"
                height="360"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        ) : null}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "TouristDestination",
                name,
                description: destination.meta_description_en || summary,
                url: absoluteUrl(canonical),
                touristType: destination.safari_styles,
                image: destination.gallery?.map((image) => image.image).slice(0, 6),
                containedInPlace: destination.country.name,
                aggregateRating,
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                  { "@type": "ListItem", position: 2, name: "Destinations", item: absoluteUrl("/destinations") },
                  { "@type": "ListItem", position: 3, name: destination.country.name },
                  { "@type": "ListItem", position: 4, name, item: absoluteUrl(canonical) },
                ],
              },
              destination.faqs?.length
                ? {
                    "@type": "FAQPage",
                    mainEntity: destination.faqs.map((faq) => ({
                      "@type": "Question",
                      name: faq.question_en,
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.answer_en,
                      },
                    })),
                  }
                : null,
            ],
          }}
        />
      </div>
      <aside className="detail-aside">
        <SectionHeading title="Plan this destination" body="Send your dates and interests to get help choosing the right route." />
        <BookingForm sourcePage={`/destinations/${country}/${slug}`} compact />
        <div className="button-row">
          <Link href="/tours" className="button primary">
            Compare tours
          </Link>
        </div>
      </aside>
    </div>
  );
}
