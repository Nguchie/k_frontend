import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllCountries, getAllDestinations, getAllGuides, getAllTours } from "@/lib/api";
import { getImageSource } from "@/lib/media";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Explore Countries",
  description: "Browse East African safari countries, then move into destinations, tours, and planning guides for each one.",
  canonical: "/countries",
});

export default async function CountriesPage() {
  const [countries, destinations, tours, guides] = await Promise.all([
    getAllCountries(),
    getAllDestinations(),
    getAllTours(),
    getAllGuides(),
  ]);

  return (
    <div className="archive-shell">
      <div className="archive-hero">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Countries" }]} />
        <SectionHeading
          title="Explore Countries"
          body="Choose a country first, then narrow into the destinations, safari tours, and planning guides connected to it."
          level="h1"
        />
      </div>
      <div className="grid cards-3">
        {countries.map((country) => {
          const destinationCount = destinations.filter((destination) => destination.country.slug === country.slug).length;
          const tourCount = tours.filter((tour) =>
            (tour.destinations?.length ? tour.destinations : [tour.destination]).some((destination) => destination.country.slug === country.slug),
          ).length;
          const guideCount = guides.filter((guide) =>
            guide.country?.slug === country.slug
            || guide.destinations?.some((destination) => destination.country.slug === country.slug),
          ).length;

          return (
            <Link key={country.slug} href={`/countries/${country.slug}`} className="card card-link destination-card">
              {getImageSource(country.image) ? (
                <div className="card-image">
                  <img src={getImageSource(country.image) || ""} alt={country.image?.alt_text_en ?? country.name} />
                </div>
              ) : null}
              <div className="card-copy">
                <span className="pill">{country.code}</span>
                <h3>{country.name}</h3>
                <p className="card-summary">
                  {country.intro_en?.slice(0, 170).trim() || `Explore safari destinations, tours, and planning content across ${country.name}.`}
                </p>
                <div className="button-row">
                  <span className="pill">{destinationCount} destinations</span>
                  <span className="pill">{tourCount} tours</span>
                  <span className="pill">{guideCount} guides</span>
                </div>
                <div className="card-footer">
                  <span className="text-link">Explore country</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
