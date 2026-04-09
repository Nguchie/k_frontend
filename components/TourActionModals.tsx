"use client";

import { useState } from "react";

import { BookingForm } from "@/components/BookingForm";
import { BookingDateOption } from "@/lib/types";

type TourActionModalsProps = {
  sourcePage: string;
  tourId: number;
  destinationId: number;
  title: string;
  dateOptions: BookingDateOption[];
};

type PanelType = "book" | "custom" | "notify" | null;

export function TourActionModals({
  sourcePage,
  tourId,
  destinationId,
  title,
  dateOptions,
}: TourActionModalsProps) {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  function togglePanel(panel: Exclude<PanelType, null>) {
    setActivePanel((current) => (current === panel ? null : panel));
  }

  return (
    <div className="tour-action-panels">
      <div className="tour-cta-stack">
        <button type="button" className="button primary" onClick={() => togglePanel("book")}>
          Book This Tour
        </button>
        {activePanel === "book" ? (
          <div className="inline-panel">
            <div className="inline-panel-header">
              <div>
                <p className="eyebrow">Booking</p>
                <h3>Book This Tour</h3>
              </div>
              <button type="button" className="inline-panel-close" onClick={() => setActivePanel(null)}>
                Close
              </button>
            </div>
            <BookingForm
              sourcePage={sourcePage}
              compact
              tourId={tourId}
              destinationId={destinationId}
              titleHint={title}
              dateOptions={dateOptions}
              submitLabel="Book Today"
            />
          </div>
        ) : null}

        <button type="button" className="button ghost-dark" onClick={() => togglePanel("custom")}>
          Plan A Tailored Safari
        </button>
        {activePanel === "custom" ? (
          <div className="inline-panel">
            <div className="inline-panel-header">
              <div>
                <p className="eyebrow">Custom Request</p>
                <h3>Plan A Tailored Safari</h3>
              </div>
              <button type="button" className="inline-panel-close" onClick={() => setActivePanel(null)}>
                Close
              </button>
            </div>
            <BookingForm
              sourcePage={`${sourcePage}#custom`}
              compact
              inquiryType="custom"
              submitLabel="Send Custom Request"
              tourId={tourId}
              destinationId={destinationId}
              titleHint={`${title} custom request`}
              useDateRange
              dateOptions={dateOptions}
              suggestedDateLabel="Closest matching departure"
            />
          </div>
        ) : null}

        <button type="button" className="button ghost-dark" onClick={() => togglePanel("notify")}>
          Can&apos;t Find Your Ideal Date?
        </button>
        {activePanel === "notify" ? (
          <div className="inline-panel">
            <div className="inline-panel-header">
              <div>
                <p className="eyebrow">Notify Me</p>
                <h3>Request Another Date</h3>
              </div>
              <button type="button" className="inline-panel-close" onClick={() => setActivePanel(null)}>
                Close
              </button>
            </div>
            <BookingForm
              sourcePage={`${sourcePage}#notify`}
              compact
              inquiryType="notify"
              submitLabel="Notify Me"
              tourId={tourId}
              destinationId={destinationId}
              titleHint={`${title} notify request`}
              dateOptions={dateOptions}
              suggestedDateLabel="Preferred tour date"
            />
          </div>
        ) : null}

      </div>
    </div>
  );
}
