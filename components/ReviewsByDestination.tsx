"use client";

import { useMemo, useState } from "react";

import { ReviewCarousel } from "@/components/ReviewCarousel";
import { Review } from "@/lib/types";

type ReviewsByDestinationProps = {
  reviews: Review[];
};

export function ReviewsByDestination({ reviews }: ReviewsByDestinationProps) {
  const destinations = useMemo(
    () => Array.from(new Set(reviews.map((review) => review.destination_name).filter(Boolean))) as string[],
    [reviews],
  );
  const [selectedDestination, setSelectedDestination] = useState("all");

  const filteredReviews =
    selectedDestination === "all"
      ? reviews
      : reviews.filter((review) => review.destination_name === selectedDestination);

  return (
    <section className="detail-block">
      <div className="reviews-filter-bar">
        <div>
          <p className="eyebrow">Destination Reviews</p>
          <h2>{selectedDestination === "all" ? "All Destinations" : selectedDestination}</h2>
        </div>
        <label className="reviews-filter-select">
          Show reviews for
          <select value={selectedDestination} onChange={(event) => setSelectedDestination(event.target.value)}>
            <option value="all">All destinations</option>
            {destinations.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ReviewCarousel reviews={filteredReviews} />
    </section>
  );
}
