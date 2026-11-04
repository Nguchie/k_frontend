import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchPanel } from "@/components/SearchPanel";
import { SectionHeading } from "@/components/SectionHeading";
import { TourCard } from "@/components/TourCard";
import { getAllTours } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Safari Tours",
  description: "Compare safari tours by destination, budget, duration, and travel style across East Africa.",
  canonical: "/tours",
});

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParams;
  const allTours = await getAllTours();
  const q = typeof filters.q === "string" ? filters.q.toLowerCase() : "";
  const budget = typeof filters.budget === "string" ? filters.budget : "";
  const duration = typeof filters.duration === "string" ? Number(filters.duration) : 0;
  const country = typeof filters.country === "string" ? filters.country : "";

  const tours = allTours.filter((tour) => {
    const destinations = tour.destinations?.length ? tour.destinations : [tour.destination];
    const destinationSearch = destinations.map((destination) => `${destination.name_en} ${destination.country.name}`).join(" ");
    const matchesQuery = !q || [tour.title_en, destinationSearch].join(" ").toLowerCase().includes(q);
    const matchesBudget = !budget || tour.budget_level === budget;
    const matchesDuration = !duration || tour.duration_days === duration;
    const matchesCountry = !country || destinations.some((destination) => destination.country.slug === country);
    return matchesQuery && matchesBudget && matchesDuration && matchesCountry;
  });
  const countryName = country ? tours[0]?.destination.country.slug === country
    ? tours[0].destination.country.name
    : (allTours.flatMap((tour) => (tour.destinations?.length ? tour.destinations : [tour.destination])).find((destination) => destination.country.slug === country)?.country.name || "")
    : "";

  return (
    <div className="archive-shell">
      <div className="archive-hero">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, ...(country ? [{ label: "Countries", href: "/countries" }, { label: countryName || country }] : []), { label: "Tours" }]} />
        <SectionHeading
          title={countryName ? `${countryName} Tours` : "Safari Tours"}
          body={countryName ? `Browse safari tours connected to ${countryName}.` : "Browse East Africa safari tours by destination, budget, duration, and travel style."}
          level="h1"
        />
        <SearchPanel compact />
      </div>
      <div className="grid cards-3">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
