import Link from "next/link";

import { getFirstGalleryImage, getImageSource } from "@/lib/media";
import { Tour } from "@/lib/types";

export function TourCard({ tour, compact = false }: { tour: Tour; compact?: boolean }) {
  const leadImage = getFirstGalleryImage(tour.gallery);
  const imageSrc = getImageSource(leadImage);
  const summary = tour.summary_en.length > 160 ? `${tour.summary_en.slice(0, 157).trimEnd()}...` : tour.summary_en;

  return (
    <Link href={`/tours/${tour.destination.country.slug}/${tour.slug}`} className={`card tour-card card-link ${compact ? "tour-card-compact" : ""}`}>
      {imageSrc ? (
        <div className="card-image">
          <img src={imageSrc} alt={leadImage?.alt_text_en ?? tour.title_en} />
        </div>
      ) : null}
      <div className="card-copy">
        <span className="pill">{tour.destination.name_en}</span>
        <h3>{tour.title_en}</h3>
        <p className="card-summary tour-card-summary">{summary}</p>
        <div className="card-footer">
          <div className="tour-meta">
            <strong>From ${tour.from_price_usd}</strong>
            <span>{tour.duration_days} days</span>
          </div>
          <span className="button secondary">View Tour</span>
        </div>
      </div>
    </Link>
  );
}
