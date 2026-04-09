import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { ReviewsByDestination } from "@/components/ReviewsByDestination";
import { ReviewSubmissionForm } from "@/components/ReviewSubmissionForm";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllTours, getReviews } from "@/lib/api";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Traveler Reviews",
  description: "Read traveler reviews for East Africa safari tours and destinations, and submit your own review.",
  canonical: "/reviews",
});

export default async function ReviewsPage() {
  const [reviews, tours] = await Promise.all([getReviews(), getAllTours()]);
  const tourOptions = tours.map((tour) => ({
    id: tour.id,
    title: `${tour.title_en} - ${tour.destination.name_en}`,
    destinationId: tour.destination.id,
  }));
  const avgRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  return (
    <div className="archive-shell">
      <div className="archive-hero">
        <SectionHeading
          title="Traveler Reviews"
          body="Browse reviews by destination and submit your own review for the specific tour you traveled on."
          level="h1"
        />
      </div>
      <section className="detail-block">
        <SectionHeading title="Leave Your Review" body="Choose the exact tour you traveled on before submitting your review." />
        <ReviewSubmissionForm tourOptions={tourOptions} />
      </section>
      <ReviewsByDestination reviews={reviews} />
      <section className="detail-block">
        <SectionHeading title="Explore Destinations" body="See the destinations behind the reviews." />
        <div className="reviews-destination-links">
          {Array.from(
            new Map(
              reviews
                .filter((review) => review.destination_name && review.destination_country_slug && review.destination_slug)
                .map((review) => [
                  `${review.destination_country_slug}-${review.destination_slug}`,
                  {
                    name: review.destination_name as string,
                    href: `/destinations/${review.destination_country_slug}/${review.destination_slug}`,
                  },
                ]),
            ).values(),
          ).map((destination) => (
            <Link key={destination.href} href={destination.href} className="pill">
              {destination.name}
            </Link>
          ))}
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: "Traveler Reviews",
              url: absoluteUrl("/reviews"),
            },
            reviews.length
              ? {
                  "@type": "AggregateRating",
                  ratingValue: Number(avgRating.toFixed(1)),
                  reviewCount: reviews.length,
                  bestRating: 5,
                  worstRating: 1,
                }
              : null,
          ].filter(Boolean),
        }}
      />
    </div>
  );
}
