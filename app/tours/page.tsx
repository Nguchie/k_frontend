import type { Metadata } from "next";

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

  const tours = allTours.filter((tour) => {
    const destinationSearch = (tour.destinations?.length ? tour.destinations : [tour.destination])
      .map((destination) => `${destination.name_en} ${destination.country.name}`)
      .join(" ");
    const matchesQuery = !q || [tour.title_en, destinationSearch].join(" ").toLowerCase().includes(q);
    const matchesBudget = !budget || tour.budget_level === budget;
    const matchesDuration = !duration || tour.duration_days === duration;
    return matchesQuery && matchesBudget && matchesDuration;
  });

  return (
    <div className="archive-shell">
      <div className="archive-hero">
        <SectionHeading
          title="Safari Tours"
          body="Browse East Africa safari tours by destination, budget, duration, and travel style."
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
