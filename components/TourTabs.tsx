"use client";

import { useEffect, useState } from "react";

import { ReviewCarousel } from "@/components/ReviewCarousel";
import { Tour } from "@/lib/types";

type TourTabsProps = {
  tour: Tour;
};

export function TourTabs({ tour }: TourTabsProps) {
  const departureOptions = tour.available_dates || [];
  const [selectedDepartureKey, setSelectedDepartureKey] = useState(departureOptions[0]?.date_key || departureOptions[0]?.start_date || "");
  const selectedDeparture = departureOptions.find((item) => (item.date_key || item.start_date) === selectedDepartureKey) || departureOptions[0];
  const itinerarySummary = {
    breakfasts: tour.itinerary_summary_en?.breakfasts,
    lunches: tour.itinerary_summary_en?.lunches,
    dinners: tour.itinerary_summary_en?.dinners,
    nights: tour.itinerary_summary_en?.nights ?? tour.itinerary_summary_en?.accommodation_nights,
  };
  const hasItinerarySummary = Object.values(itinerarySummary).some((value) => typeof value === "number");
  const sections = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="tour-tab-copy">
          {renderRichText(tour.overview_en || tour.summary_en)}
          {tour.highlights_en?.length ? (
            <div className="chip-row">
              {tour.highlights_en.map((item) => (
                <span key={item} className="pill">{item}</span>
              ))}
            </div>
          ) : null}
        </div>
      ),
    },
    {
      id: "special-offers",
      label: "Special Offers",
      content: (
        <div className="tour-tab-copy">
          {tour.special_offers_en?.length ? (
            <div className="tour-offer-grid">
              {tour.special_offers_en.map((offer) => (
                <article key={offer.title} className="tour-offer-card">
                  <p className="eyebrow">Offer</p>
                  <h3>{toDisplayText(offer.title) || "Offer"}</h3>
                  {renderRichText(offer.body)}
                  <strong>From ${tour.from_price_usd}</strong>
                </article>
              ))}
            </div>
          ) : (
            <p>No special offers are available for this tour right now.</p>
          )}
        </div>
      ),
    },
    {
      id: "itinerary",
      label: "Itinerary",
      content: (
        <div className="tour-itinerary-list">
          {hasItinerarySummary ? (
            <div className="tour-summary-grid">
              <div><strong>{itinerarySummary.breakfasts ?? 0}</strong><span>Breakfasts</span></div>
              <div><strong>{itinerarySummary.lunches ?? 0}</strong><span>Lunches</span></div>
              <div><strong>{itinerarySummary.dinners ?? 0}</strong><span>Dinners</span></div>
              <div><strong>{itinerarySummary.nights ?? 0}</strong><span>Nights</span></div>
            </div>
          ) : null}
          <div className="button-row">
            <button type="button" className="button secondary" onClick={() => window.print()}>
              Print Itinerary
            </button>
          </div>
          {sanitizeItineraryItems(tour.itinerary_en).map((item, index) => (
            <article key={`${item.title}-${index}`} className="tour-itinerary-card">
              <h3>{item.title}</h3>
              <div className="tour-day-meta">
                {item.location ? <span className="pill">{item.location}</span> : null}
                {item.stay ? <span className="pill">{item.stay}</span> : null}
                {item.meals.length ? <span className="pill">{item.meals.join(" | ")}</span> : null}
              </div>
              {item.body ? <p>{item.body}</p> : null}
              <div className="tour-day-grid">
                <TimelineBlock title="Breakfast" items={item.breakfast} />
                <TimelineBlock title="Morning" items={item.morning} />
                <TimelineBlock title="Lunch" items={item.lunch} />
                <TimelineBlock title="Afternoon" items={item.afternoon} />
                <TimelineBlock title="Evening" items={item.evening} />
              </div>
            </article>
          ))}
        </div>
      ),
    },
    {
      id: "dates",
      label: "View Dates",
      content: (
        <div className="tour-tab-copy">
          {departureOptions.length > 1 ? (
            <label className="tour-filter-select">
              Select departure
              <select value={selectedDepartureKey} onChange={(event) => setSelectedDepartureKey(event.target.value)}>
                {departureOptions.map((item) => (
                  <option key={item.date_key || item.start_date} value={item.date_key || item.start_date}>
                    {toDisplayText(item.label) || "Departure"} - {toDisplayText(item.start_date)}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {departureOptions.length ? (
            <div className="tour-date-list">
              {departureOptions.map((item) => (
                <article key={`${item.start_date}-${item.label}`} className={`tour-date-card ${(item.date_key || item.start_date) === (selectedDeparture?.date_key || selectedDeparture?.start_date) ? "active" : ""}`}>
                  <div>
                    <h3>{toDisplayText(item.label) || "Departure"}</h3>
                    <p>{toDateRangeText(item.start_date, item.end_date)}</p>
                  </div>
                  <div>
                    <strong>{typeof item.price_usd === "number" ? `$${item.price_usd}` : toDisplayText(item.price_usd)}</strong>
                    {item.availability ? <p>{toDisplayText(item.availability)}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>Dates for this tour have not been published yet.</p>
          )}
        </div>
      ),
    },
    {
      id: "reviews",
      label: "Reviews",
      content: <ReviewCarousel reviews={tour.reviews || []} />,
    },
  ];
  const availableSections = sections.filter((section) => {
    if (section.id === "special-offers") {
      return Boolean(tour.special_offers_en?.length);
    }
    if (section.id === "itinerary") {
      return Boolean(tour.itinerary_en?.length || hasItinerarySummary);
    }
    if (section.id === "reviews") {
      return Boolean(tour.reviews?.length);
    }
    return true;
  });

  const [activeSection, setActiveSection] = useState(availableSections[0]?.id ?? "overview");

  useEffect(() => {
    const syncSectionFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const mappedSection = hash.startsWith("tour-tab-") ? hash.replace("tour-tab-", "") : hash;
      if (availableSections.some((section) => section.id === mappedSection)) {
        setActiveSection(mappedSection);
      }
    };

    syncSectionFromHash();
    window.addEventListener("hashchange", syncSectionFromHash);
    return () => window.removeEventListener("hashchange", syncSectionFromHash);
  }, [availableSections]);

  useEffect(() => {
    if (!availableSections.some((section) => section.id === activeSection)) {
      setActiveSection(availableSections[0]?.id ?? "overview");
    }
  }, [activeSection, availableSections]);

  return (
    <section className="detail-block tour-tabs" id="tour-tabs">
      <div className="tour-tab-list" role="tablist" aria-label="Tour details">
        {availableSections.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-controls={`panel-${section.id}`}
            id={`tab-${section.id}`}
            aria-selected={section.id === activeSection}
            className={`tour-tab-trigger ${section.id === activeSection ? "active" : ""}`}
            onClick={() => {
              setActiveSection(section.id);
              window.history.replaceState(null, "", `#tour-tab-${section.id}`);
            }}
          >
            {section.label}
          </button>
        ))}
      </div>
      {availableSections.map((section) => (
        <div
          key={section.id}
          id={`panel-${section.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${section.id}`}
          hidden={section.id !== activeSection}
          className="tour-tab-panel"
        >
          {section.content}
        </div>
      ))}
    </section>
  );
}

function TimelineBlock({ title, items }: { title: string; items?: Array<{ title: string; body?: string }> }) {
  const cleanItems = sanitizeTimelineItems(items);
  if (!cleanItems.length) {
    return null;
  }

  return (
    <div className="tour-timeline-block">
      <h4>{title}</h4>
      {cleanItems.map((item, index) => (
        <div key={`${title}-${item.title || index}`} className="tour-timeline-item">
          {item.title ? <strong>{item.title}</strong> : null}
          {item.body ? <p>{item.body}</p> : null}
        </div>
      ))}
    </div>
  );
}

function renderRichText(value: unknown) {
  const text = safeText(value);
  return text ? <p>{text}</p> : null;
}

function toDisplayText(value: unknown): string {
  if (typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => safeText(item)).filter(Boolean).join(" | ");
  }
  return safeText(value);
}

function toDateRangeText(startDate: unknown, endDate: unknown): string {
  const start = toDisplayText(startDate);
  const end = toDisplayText(endDate);
  if (start && end) {
    return `${start} to ${end}`;
  }
  return start || end || "Dates to be confirmed";
}

function safeText(value: unknown): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return "";
    }
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      return "";
    }
    return trimmed;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}

function sanitizeTimelineItems(items?: Array<{ title: string; body?: string }>) {
  return (items || [])
    .map((item) => ({
      title: safeText(item.title),
      body: safeText(item.body),
    }))
    .filter((item) => item.title || item.body);
}

function sanitizeItineraryItems(items?: Tour["itinerary_en"]) {
  return (items || [])
    .map((item) => ({
      title: safeText(item.title),
      location: safeText(item.location),
      stay: safeText(item.stay),
      meals: (item.meals || []).map((meal) => safeText(meal)).filter(Boolean),
      body: safeText(item.body),
      breakfast: sanitizeTimelineItems(item.breakfast),
      morning: sanitizeTimelineItems(item.morning),
      lunch: sanitizeTimelineItems(item.lunch),
      afternoon: sanitizeTimelineItems(item.afternoon),
      evening: sanitizeTimelineItems(item.evening),
    }))
    .filter((item) => item.title || item.body || item.location || item.stay || item.meals.length || item.breakfast.length || item.morning.length || item.lunch.length || item.afternoon.length || item.evening.length);
}
