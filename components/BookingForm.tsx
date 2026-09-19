"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

import { PhoneField } from "@/components/PhoneField";
import { submitInquiry } from "@/lib/api";
import { getTravelDateError, safeResetForm } from "@/lib/form";
import { BookingDateOption } from "@/lib/types";

type BookingFormProps = {
  sourcePage: string;
  compact?: boolean;
  tourId?: number;
  destinationId?: number;
  inquiryType?: "quote" | "notify" | "custom";
  submitLabel?: string;
  titleHint?: string;
  useDateRange?: boolean;
  useIntlPhone?: boolean;
  dateOptions?: BookingDateOption[];
  suggestedDateLabel?: string;
};

function localISODate(date = new Date()) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function formatTravelDates(from: string, to: string) {
  return [from, to].filter(Boolean).join(" to ");
}

export function BookingForm({
  sourcePage,
  compact = false,
  tourId,
  destinationId,
  inquiryType = "quote",
  submitLabel = "Get Custom Quote",
  titleHint,
  useDateRange = false,
  useIntlPhone = false,
  dateOptions = [],
  suggestedDateLabel,
}: BookingFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [travelFrom, setTravelFrom] = useState("");
  const [travelTo, setTravelTo] = useState("");
  const minTravelDate = useMemo(() => localISODate(), []);
  const minReturnDate = travelFrom && travelFrom > minTravelDate ? travelFrom : minTravelDate;
  const isNotifyRequest = inquiryType === "notify";
  const isCustomRequest = inquiryType === "custom";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) {
      return;
    }

    setError(null);

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const from = String(payload.travel_date_from || travelFrom || "");
    const to = String(payload.travel_date_to || travelTo || "");

    if (useDateRange) {
      const dateError = getTravelDateError(from, to, minTravelDate);
      if (dateError) {
        setError(dateError);
        return;
      }
    }

    setState("loading");

    try {
      await submitInquiry({
        name: String(payload.name || ""),
        email: String(payload.email || ""),
        phone: useIntlPhone
          ? `${String(payload.phone_country_code || "")} ${String(payload.phone_number || "")}`.trim()
          : String(payload.phone || ""),
        travel_dates: useDateRange
          ? formatTravelDates(from, to)
          : String(payload.travel_dates || ""),
        preferred_tour_date: String(payload.preferred_tour_date || ""),
        message: String(payload.message || ""),
        inquiry_type: inquiryType,
        subject: titleHint,
        source_page: sourcePage,
        source_locale: "en",
        tour: tourId,
        destination: destinationId,
        group_size: Number(payload.group_size || 2),
      });
      safeResetForm(form);
      setTravelFrom("");
      setTravelTo("");
      setState("done");
    } catch {
      setState("idle");
      setError("We could not send your request. Please try again shortly.");
    }
  }

    const isSending = state === "loading";

    return (
    <form
      ref={formRef}
      className={`booking-form ${compact ? "compact" : ""} ${isSending ? "is-sending" : ""}`}
      onSubmit={onSubmit}
      aria-busy={isSending}
    >
      <fieldset className="booking-form-fields" disabled={isSending}>
      <input type="hidden" name="source_page" value={sourcePage} />
      <input type="hidden" name="source_locale" value="en" />
      <input type="hidden" name="inquiry_type" value={inquiryType} />
      {titleHint ? (
        <label className="full">
          {tourId ? "Selected tour" : "Request"}
          <input value={titleHint} readOnly />
        </label>
      ) : null}
      <label>
        Name
        <input name="name" placeholder="Your name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="you@example.com" required />
      </label>
      {!compact || inquiryType === "notify" || inquiryType === "custom" ? (
        useIntlPhone ? (
          <PhoneField />
        ) : (
          <label>
            Phone
            <input name="phone" placeholder="+254..." />
          </label>
        )
      ) : null}
      {dateOptions.length > 0 ? (
        <label>
          {suggestedDateLabel || (isNotifyRequest ? "Preferred tour date" : isCustomRequest ? "Suggested departure" : "Available departure")}
          <select
            name={isNotifyRequest || isCustomRequest ? "preferred_tour_date" : "travel_dates"}
            defaultValue={dateOptions[0]?.value}
          >
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {useDateRange ? (
        <div className="booking-date-grid">
          <label>
            Travel from
            <input
              name="travel_date_from"
              type="date"
              min={minTravelDate}
              value={travelFrom}
              onChange={(event) => {
                const nextFrom = event.target.value;
                setTravelFrom(nextFrom);
                if (travelTo && nextFrom && travelTo < nextFrom) {
                  setTravelTo("");
                }
              }}
            />
          </label>
          <label>
            Travel to
            <input
              name="travel_date_to"
              type="date"
              min={minReturnDate}
              value={travelTo}
              onChange={(event) => setTravelTo(event.target.value)}
            />
          </label>
        </div>
      ) : (
        dateOptions.length === 0 ? (
          <label>
            {isNotifyRequest ? "Preferred date" : isCustomRequest ? "Preferred travel timing" : "Travel dates"}
            <input name={isNotifyRequest ? "preferred_tour_date" : "travel_dates"} placeholder="July 2026" />
          </label>
        ) : null
      )}
      <label>
        Group size
        <input name="group_size" type="number" min={1} defaultValue={2} />
      </label>
      <label className="full">
        Message
        <textarea
          name="message"
          rows={compact ? 3 : 5}
          placeholder={
            isCustomRequest
              ? "Tell us your ideal dates, pace, accommodation style, destinations, and any special requirements."
              : "Tell us where you want to go and what kind of safari you want."
          }
        />
      </label>
      <button className="button primary" type="submit">
        {isSending ? "Sending..." : submitLabel}
      </button>
      </fieldset>
      {isSending ? (
        <p className="form-status" role="status">
          Sending your request. Please keep this page open.
        </p>
      ) : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {state === "done" ? <p className="form-success">Received. We will get back to you shortly.</p> : null}
    </form>
  );
}
