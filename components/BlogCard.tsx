import Link from "next/link";

import { getImageSource } from "@/lib/media";
import { Guide } from "@/lib/types";

export function BlogCard({ guide }: { guide: Guide }) {
  const imageSrc = getImageSource(guide.hero_image);
  const pillLabel = guide.category?.name ?? guide.country?.name ?? "Safari Guide";
  const excerpt = guide.excerpt_en.length > 140 ? `${guide.excerpt_en.slice(0, 137).trimEnd()}...` : guide.excerpt_en;

  return (
    <Link href={`/blog/${guide.slug}`} className="card blog-card card-link">
      {imageSrc ? (
        <div className="card-image">
          <img src={imageSrc} alt={guide.hero_image?.alt_text_en ?? guide.title_en} />
        </div>
      ) : null}
      <div className="card-copy">
        <span className="pill">{pillLabel}</span>
        <h3>{guide.title_en}</h3>
        <p className="card-summary">{excerpt}</p>
        <div className="card-footer">
          <span className="text-link">Read guide</span>
        </div>
      </div>
    </Link>
  );
}
