import { Review } from "@/lib/types";

export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  return (
    <div className="review-grid">
      {reviews.map((review) => (
        <article key={review.id} className="review-card">
          <div className="review-stars">
            {Array.from({ length: review.rating }).map((_, index) => (
              <span key={index}>★</span>
            ))}
          </div>
          {review.title ? <h3>{review.title}</h3> : null}
          <p>{review.content}</p>
          <footer>
            <strong>{review.reviewer_name}</strong>
            <span>
              {[review.reviewer_country, formatTravelDate(review.travel_date)].filter(Boolean).join(" · ")}
            </span>
          </footer>
        </article>
      ))}
    </div>
  );
}

function formatTravelDate(value?: string) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
