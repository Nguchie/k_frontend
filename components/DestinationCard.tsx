import Link from "next/link";

import { getFirstGalleryImage, getImageSource } from "@/lib/media";
import { Destination } from "@/lib/types";

export function DestinationCard({ destination }: { destination: Destination }) {
  const leadImage = getFirstGalleryImage(destination.gallery);
  const imageSrc = getImageSource(leadImage);
  const summaryText = destination.summary_en || "";
  const summary = summaryText.length > 140 ? `${summaryText.slice(0, 137).trimEnd()}...` : summaryText;

  return (
    <Link href={`/destinations/${destination.country.slug}/${destination.slug}`} className="card destination-card card-link">
      {imageSrc ? (
        <div className="card-image">
          <img src={imageSrc} alt={leadImage?.alt_text_en ?? destination.name_en} />
        </div>
      ) : null}
      <div className="card-copy">
        <span className="pill">{destination.country.name}</span>
        <h3>{destination.name_en}</h3>
        <p className="card-summary">{summary}</p>
        <div className="card-footer">
          <span className="text-link">Explore destination</span>
        </div>
      </div>
    </Link>
  );
}
