import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DestinationCard } from "@/components/DestinationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllCountries, getAllDestinations, getAllGuides, getAllTours } from "@/lib/api";
import { getImageSource } from "@/lib/media";
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
  const tourCount = allTours.filter((tour) =>
    (tour.destinations?.length ? tour.destinations : [tour.destination]).some((destination) => destination.country.slug === country.slug),
  );
  const guideCount = allGuides.filter((guide) =>
    guide.country?.slug === country.slug
    || guide.destinations?.some((destination) => destination.country.slug === country.slug),
  );
  const countryImageSrc = getImageSource(country.image);

  return (
    <div className="detail-shell country-detail-shell">
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
            <span className="pill">{tourCount.length} tours</span>
            <span className="pill">{guideCount.length} guides</span>
          </div>
        </section>

        {countryImageSrc ? (
          <section className="detail-block">
            <div className="detail-media-frame">
              <img src={countryImageSrc} alt={country.image?.alt_text_en ?? country.name} />
            </div>
          </section>
        ) : null}

        <section className="detail-block">
          <SectionHeading title={`Destinations in ${country.name}`} body={`Wildlife areas, parks, and travel regions to explore across ${country.name}.`} />
          <div className="grid country-destination-grid">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </section>

        <section className="detail-block">
          <SectionHeading title="Continue Exploring" body="Move deeper into country-specific tours or planning guides once you have a destination in mind." />
          <div className="button-row">
            <Link href={`/tours?country=${country.slug}`} className="button primary">Browse Tours</Link>
            <Link href={`/blog?country=${country.slug}`} className="button secondary">Browse Guides</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
