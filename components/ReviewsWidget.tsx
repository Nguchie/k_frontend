import { Review } from "@/lib/types";

import { ReviewCarousel } from "@/components/ReviewCarousel";

const widgetUrl = process.env.NEXT_PUBLIC_REVIEWS_WIDGET_URL;

export function ReviewsWidget({ reviews }: { reviews: Review[] }) {
  const wrapper = (content: React.ReactNode) => (
    <section className="reviews-showcase">
      <h2>Traveler Reviews</h2>
      <div className="reviews-shell">{content}</div>
    </section>
  );

  if (widgetUrl) {
    return wrapper(
      <div className="reviews-widget-frame">
        <iframe
          title="Google reviews widget"
          src={widgetUrl}
          width="100%"
          height="520"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>,
    );
  }

  if (reviews.length > 0) {
    return wrapper(<ReviewCarousel reviews={reviews} />);
  }

  return wrapper(
    <div className="detail-block reviews-empty">
      <p>Reviews widget will appear here once the Google Business Profile widget URL is added to the frontend environment.</p>
    </div>,
  );
}
