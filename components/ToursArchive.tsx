"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchPanel } from "@/components/SearchPanel";
import { SectionHeading } from "@/components/SectionHeading";
import { TourCard } from "@/components/TourCard";
import type { Tour } from "@/lib/types";

type ToursArchiveProps = {
  tours: Tour[];
};

function tourDestinations(tour: Tour) {
  return tour.destinations?.length ? tour.destinations : [tour.destination];
}

function resolveCountryName(tours: Tour[], country: string) {
  if (!country) return "";
  for (const tour of tours) {
    const match = tourDestinations(tour).find((destination) => destination.country.slug === country);
    if (match) return match.country.name;
  }
  return "";
}

export function ToursArchive({ tours }: ToursArchiveProps) {
  // useSearchParams stays in this client island; the server page must not await
  // searchParams or /tours becomes dynamic again.
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const budget = (searchParams.get("budget") ?? "").trim();
  const durationRaw = (searchParams.get("duration") ?? "").trim();
  const duration = durationRaw ? Number(durationRaw) : 0;
  const country = (searchParams.get("country") ?? "").trim();

  const filteredTours = useMemo(
    () =>
      tours.filter((tour) => {
        const destinations = tourDestinations(tour);
        const destinationSearch = destinations
          .map((destination) => `${destination.name_en} ${destination.country.name}`)
          .join(" ");
        const matchesQuery = !q || [tour.title_en, destinationSearch].join(" ").toLowerCase().includes(q);
        const matchesBudget = !budget || tour.budget_level === budget;
        const matchesDuration = !duration || tour.duration_days === duration;
        const matchesCountry = !country || destinations.some((destination) => destination.country.slug === country);
        return matchesQuery && matchesBudget && matchesDuration && matchesCountry;
      }),
    [tours, q, budget, duration, country],
  );

  const countryName = useMemo(() => resolveCountryName(tours, country), [tours, country]);

  return (
    <>
      <div className="archive-hero">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            ...(country
              ? [{ label: "Countries", href: "/countries" }, { label: countryName || country }]
              : []),
            { label: "Tours" },
          ]}
        />
        <SectionHeading
          title={countryName ? `${countryName} Tours` : "Safari Tours"}
          body={
            countryName
              ? `Browse safari tours connected to ${countryName}.`
              : "Browse East Africa safari tours by destination, budget, duration, and travel style."
          }
          level="h1"
        />
        <SearchPanel compact />
      </div>
      <div className="grid cards-3">
        {filteredTours.length ? (
          filteredTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
        ) : (
          <article className="card card-copy empty-state-card">
            <h3>No tours matched those filters.</h3>
            <p>Try a broader search, clear a filter, or browse all safari tours.</p>
          </article>
        )}
      </div>
    </>
  );
}
