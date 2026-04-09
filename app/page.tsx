import Link from "next/link";
import type { Metadata } from "next";

import { BlogCard } from "@/components/BlogCard";
import { BookingForm } from "@/components/BookingForm";
import { DestinationCard } from "@/components/DestinationCard";
import { HeroSection } from "@/components/HeroSection";
import { KenniceReasons } from "@/components/KenniceReasons";
import { ReviewsWidget } from "@/components/ReviewsWidget";
import { SectionHeading } from "@/components/SectionHeading";
import { TourCard } from "@/components/TourCard";
import { TrustBar } from "@/components/TrustBar";
import { dictionaries } from "@/lib/copy";
import { getHomepageData } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "East Africa Safari Tours",
  description: "Browse East Africa safari tours, destinations, traveler reviews, and planning guides for Kenya, Uganda, Tanzania, Rwanda, and Zanzibar.",
  canonical: "/",
});

export default async function RootPage() {
  const copy = dictionaries.en;
  const data = await getHomepageData();

  return (
    <>
      <HeroSection slides={data.hero_slides} />
      <section className="section-band warm">
        <div className="page-section">
          <SectionHeading
            title="Why Choose Kennice Tours?"
            body="Affordable safari planning, dependable support, and travel experiences shaped around the kind of trip you actually want."
            centered
          />
          <KenniceReasons />
        </div>
      </section>
      <section className="section-band warm">
        <div className="page-section">
          <SectionHeading
            title="Why Tour With Us"
            body="Clear planning, strong local safari knowledge, and a booking flow that gives travelers the details they actually need."
            centered
          />
          <TrustBar />
        </div>
      </section>
      <section className="section-band warm">
        <div className="page-section">
          <SectionHeading
            title={copy.featuredTours}
            body="Explore standout safari itineraries with clear pricing, departure dates, and trip styles."
          />
          {data.featured_tours.length ? (
            <div className="grid cards-3">
              {data.featured_tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="detail-block empty-state-card">
              <h3>Tours are being added</h3>
              <p>Featured safari departures will appear here once they are published from the admin panel.</p>
            </div>
          )}
        </div>
      </section>
      <section className="section-band mist">
        <div className="page-section">
          <SectionHeading
            title={copy.destinationExplorer}
            body="Discover East Africa's wildlife regions, landscapes, beaches, and travel seasons before choosing your tour."
          />
          {data.featured_destinations.length ? (
            <div className="grid cards-3">
              {data.featured_destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          ) : (
            <div className="detail-block empty-state-card">
              <h3>Destinations are being added</h3>
              <p>Destination highlights will appear here once they are published from the admin panel.</p>
            </div>
          )}
        </div>
      </section>
      <section className="section-band sand">
        <div className="page-section">
          <ReviewsWidget reviews={data.featured_reviews} />
        </div>
      </section>
      <section className="section-band warm">
        <div className="page-section">
          <SectionHeading
            title={copy.safariGuides}
            body="Read planning tips, destination advice, and safari guidance before you book."
          />
          {data.featured_guides.length ? (
            <div className="grid cards-3">
              {data.featured_guides.map((guide) => (
                <BlogCard key={guide.id} guide={guide} />
              ))}
            </div>
          ) : (
            <div className="detail-block empty-state-card">
              <h3>Safari guides are being added</h3>
              <p>Planning guides and travel articles will appear here once they are published from the admin panel.</p>
            </div>
          )}
        </div>
      </section>
      <section className="section-band mist">
        <div className="page-section">
          <div className="detail-block">
            <SectionHeading title={copy.ctaTitle} body={copy.ctaBody} />
            <div className="button-row">
              <Link href="/tours" className="button primary">
                Browse Tours
              </Link>
              <Link href="/contact" className="button secondary">
                Start Planning
              </Link>
            </div>
            <BookingForm sourcePage="/" useDateRange useIntlPhone />
          </div>
        </div>
      </section>
    </>
  );
}
