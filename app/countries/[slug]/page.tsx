import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/BlogCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DestinationCard } from "@/components/DestinationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { TourCard } from "@/components/TourCard";
import { getAllCountries, getAllDestinations, getAllGuides, getAllTours } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const countries = await getAllCountries();
  const country = countries.find((item) => item.slug === slug);

  if (!country) {
    return buildMetadata({
      title: "Country Not Found",
      description: "This country page could not be found.",
      canonical: `/countries/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: country.seo_title_en || `${country.name} Safari Travel`,
    description: country.meta_description_en || country.intro_en || `Explore destinations, tours, and safari planning content for ${country.name}.`,
    canonical: country.canonical_url || `/countries/${country.slug}`,
  });
}

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [countries, allDestinations, allTours, allGuides] = await Promise.all([
    getAllCountries(),
    getAllDestinations(),
    getAllTours(),
    getAllGuides(),
  ]);

  const country = countries.find((item) => item.slug === slug);
  if (!country) {
    notFound();
  }

  const destinations = allDestinations.filter((destination) => destination.country.slug === country.slug);
  const destinationIds = new Set(destinations.map((destination) => destination.id));
  const tours = allTours.filter((tour) =>
    (tour.destinations?.length ? tour.destinations : [tour.destination]).some((destination) => destination.country.slug === country.slug),
  );
  const guides = allGuides.filter((guide) =>
    guide.country?.slug === country.slug
    || guide.destinations?.some((destination) => destinationIds.has(destination.id)),
  );

  return (
    <div className="detail-shell">
      <div className="detail-content">
        <section className="detail-hero">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Countries", href: "/countries" },
              { label: country.name },
            ]}
          />
          <h1>{country.name}</h1>
          <p>{country.intro_en || `Browse safari destinations, tours, and planning content across ${country.name}.`}</p>
          <div className="button-row">
            <span className="pill">{destinations.length} destinations</span>
            <span className="pill">{tours.length} tours</span>
            <span className="pill">{guides.length} guides</span>
          </div>
        </section>

        <section className="detail-block">
          <SectionHeading title="Destinations" body={`Wildlife areas, parks, and travel regions to explore in ${country.name}.`} />
          <div className="grid cards-3">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>

        <section className="detail-block">
          <SectionHeading title="Tours" body={`Safari trips tied to ${country.name}, including routes that cross multiple destinations.`} />
          <div className="grid cards-3">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </section>

        <section className="detail-block">
          <SectionHeading title="Guides" body={`Planning articles and travel advice connected to ${country.name}.`} />
          <div className="grid cards-3">
            {guides.map((guide) => (
              <BlogCard key={guide.id} guide={guide} />
            ))}
          </div>
        </section>
      </div>

      <aside className="detail-aside">
        <SectionHeading title="Continue Exploring" body="Move deeper from country level into destinations or compare tours directly." />
        <div className="button-row">
          <Link href="/destinations" className="button primary">Browse Destinations</Link>
          <Link href="/tours" className="button secondary">Browse Tours</Link>
        </div>
      </aside>
    </div>
  );
}
