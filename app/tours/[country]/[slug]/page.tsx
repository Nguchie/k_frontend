import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/BlogCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { TourActionModals } from "@/components/TourActionModals";
import { TourCard } from "@/components/TourCard";
import { TourGallery } from "@/components/TourGallery";
import { TourTabs } from "@/components/TourTabs";
import { getAllGuides, getAllTours, getTour } from "@/lib/api";
import { getEmbeddableVideoUrl } from "@/lib/media";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}): Promise<Metadata> {
  const { country, slug } = await params;
  const tour = await getTour(country, slug);

  if (!tour) {
    return buildMetadata({
      title: "Tour Not Found",
      description: "This safari tour could not be found.",
      canonical: `/tours/${country}/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: tour.seo_title_en || tour.title_en,
    description: tour.meta_description_en || tour.summary_en,
    canonical: tour.canonical_url || `/tours/${country}/${slug}`,
  });
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country, slug } = await params;
  const tour = await getTour(country, slug);

  if (!tour) {
    notFound();
  }

  const [allTours, allGuides] = await Promise.all([getAllTours(), getAllGuides()]);
  const relatedTours = allTours.filter((item) => item.destination.slug === tour.destination.slug && item.slug !== tour.slug);
  const relatedGuides = allGuides.filter((guide) => guide.tours?.some((item) => item.slug === tour.slug || item.destination.slug === tour.destination.slug));
  const dateOptions = (tour.available_dates || []).map((item) => ({
    value: `${item.start_date} to ${item.end_date}`,
    label: `${item.label} - ${item.start_date} to ${item.end_date}`,
  }));
  const canonical = tour.canonical_url || `/tours/${country}/${slug}`;
  const heroVideoUrl = getEmbeddableVideoUrl(tour.hero_video_url);
  const aggregateRating = tour.reviews?.length
    ? {
        "@type": "AggregateRating",
        ratingValue: Number((tour.reviews.reduce((sum, review) => sum + review.rating, 0) / tour.reviews.length).toFixed(1)),
        reviewCount: tour.reviews.length,
        bestRating: 5,
        worstRating: 1,
      }
    : null;

  return (
    <div className="tour-page">
      <section className="tour-hero-wrap">
        <div className={`tour-hero-shell ${tour.gallery?.length ? "" : "tour-hero-shell-single"}`}>
          <div className="tour-hero-copy">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Tours", href: "/tours" },
                { label: tour.destination.country.name },
                { label: tour.destination.name_en, href: `/destinations/${tour.destination.country.slug}/${tour.destination.slug}` },
                { label: tour.title_en },
              ]}
            />
            <p className="eyebrow">{tour.destination.name_en}</p>
            <h1>{tour.title_en}</h1>
            <p className="tour-hero-summary">{tour.summary_en}</p>
            <div className="tour-key-stats">
              <div><strong>${tour.from_price_usd}</strong><span>From price</span></div>
              <div><strong>{tour.duration_days} days</strong><span>Duration</span></div>
              <div><strong>{tour.budget_level}</strong><span>Style</span></div>
              <div><strong>{tour.safari_type}</strong><span>Format</span></div>
            </div>
            {tour.urgency_message_en ? <p className="tour-urgency">{tour.urgency_message_en}</p> : null}
          </div>
          <TourGallery title={tour.title_en} gallery={tour.gallery} />
        </div>
      </section>

      <div className="detail-shell tour-detail-shell">
        <div className="detail-content">
          <TourTabs tour={tour} />

          {heroVideoUrl ? (
            <section className="detail-block">
              <SectionHeading title="See This Tour In Action" body="A quick look at the landscapes, wildlife, and travel experience on this route." />
              <div className="tour-video-frame">
                <iframe
                  title={`${tour.title_en} video`}
                  src={heroVideoUrl}
                  width="100%"
                  height="420"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}

          {relatedGuides.length ? (
            <section className="detail-block">
              <SectionHeading title="Related Guides" />
              <div className="grid cards-3">
                {relatedGuides.map((guide) => (
                  <BlogCard key={guide.id} guide={guide} />
                ))}
              </div>
            </section>
          ) : null}

          {relatedTours.length ? (
            <section className="detail-block">
              <SectionHeading title="Related Tours" />
              <div className="grid cards-3">
                {relatedTours.map((item) => (
                  <TourCard key={item.id} tour={item} />
                ))}
              </div>
            </section>
          ) : null}

          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "TouristTrip",
                  url: absoluteUrl(canonical),
                  name: tour.title_en,
                  description: tour.meta_description_en || tour.summary_en,
                  itinerary: tour.itinerary_en?.map((item) => item.title),
                  offers: { "@type": "Offer", priceCurrency: "USD", price: tour.from_price_usd },
                  touristType: tour.safari_type,
                  includedInPackage: tour.included_en,
                  image: tour.gallery?.map((image) => image.image).slice(0, 6),
                  aggregateRating,
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                    { "@type": "ListItem", position: 2, name: "Tours", item: absoluteUrl("/tours") },
                    { "@type": "ListItem", position: 3, name: tour.destination.name_en, item: absoluteUrl(`/destinations/${tour.destination.country.slug}/${tour.destination.slug}`) },
                    { "@type": "ListItem", position: 4, name: tour.title_en, item: absoluteUrl(canonical) },
                  ],
                },
                tour.faqs?.length
                  ? {
                      "@type": "FAQPage",
                      mainEntity: tour.faqs.map((faq) => ({
                        "@type": "Question",
                        name: faq.question_en,
                        acceptedAnswer: {
                          "@type": "Answer",
                          text: faq.answer_en,
                        },
                      })),
                    }
                  : null,
              ].filter(Boolean),
            }}
          />
        </div>

        <aside className="detail-aside" id="tour-booking">
          <SectionHeading title="Ready To Plan?" body="Pick the action you need and the form opens in place." />
          <TourActionModals
            sourcePage={`/tours/${country}/${slug}`}
            tourId={tour.id}
            destinationId={tour.destination.id}
            title={tour.title_en}
            dateOptions={dateOptions}
          />
          <div className="button-row">
            <Link href={`/destinations/${tour.destination.country.slug}/${tour.destination.slug}`} className="button secondary">
              View Destination
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
