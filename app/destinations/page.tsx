import type { Metadata } from "next";

import { DestinationCard } from "@/components/DestinationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllDestinations } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Safari Destinations",
  description: "Explore safari destinations across Kenya, Uganda, Tanzania, Rwanda, and Zanzibar with wildlife highlights, travel seasons, and route ideas.",
  canonical: "/destinations",
});

export default async function DestinationsPage() {
  const destinations = await getAllDestinations();

  return (
    <div className="archive-shell">
      <div className="archive-hero">
        <SectionHeading
          title="Safari Destinations"
          body="Compare safari regions, wildlife highlights, and travel seasons across East Africa."
          level="h1"
        />
      </div>
      <div className="grid cards-3">
        {destinations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </div>
  );
}
