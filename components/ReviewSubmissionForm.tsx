"use client";

import { FormEvent, useState } from "react";

import { submitReview } from "@/lib/api";

type ReviewSubmissionFormProps = {
  tourId?: number;
  destinationId?: number;
  tourOptions?: Array<{ id: number; title: string; destinationId: number }>;
};

export function ReviewSubmissionForm({ tourId, destinationId, tourOptions = [] }: ReviewSubmissionFormProps) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [selectedTourId, setSelectedTourId] = useState<number>(tourOptions[0]?.id || tourId || 0);
  const selectedTour = tourOptions.find((option) => option.id === selectedTourId);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      await submitReview({
        reviewer_name: String(payload.reviewer_name || ""),
        reviewer_email: String(payload.reviewer_email || ""),
        reviewer_country: String(payload.reviewer_country || ""),
        rating: Number(payload.rating || 5),
        title: String(payload.title || ""),
        content: String(payload.content || ""),
        trip_type: String(payload.trip_type || ""),
        tour: Number(payload.tour || selectedTourId || tourId || 0) || undefined,
        destination: Number(payload.destination || selectedTour?.destinationId || destinationId || 0) || undefined,
      });
      event.currentTarget.reset();
      setState("done");
    } catch {
      setState("idle");
    }
  }

  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <label>
        Name
        <input name="reviewer_name" required placeholder="Your name" />
      </label>
      <label>
        Email
        <input name="reviewer_email" type="email" placeholder="you@example.com" />
      </label>
      <label>
        Country
        <input name="reviewer_country" placeholder="Country" />
      </label>
      <label>
        Rating
        <select name="rating" defaultValue="5">
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
      </label>
      {tourOptions.length > 0 ? (
        <>
          <label>
            Tour
            <select
              name="tour"
              value={String(selectedTourId || "")}
              onChange={(event) => setSelectedTourId(Number(event.target.value))}
              required
            >
              {tourOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.title}
                </option>
              ))}
            </select>
          </label>
          <input type="hidden" name="destination" value={String(selectedTour?.destinationId || "")} />
        </>
      ) : null}
      <label>
        Title
        <input name="title" placeholder="Short review title" />
      </label>
      <label className="full">
        Review
        <textarea name="content" rows={4} required placeholder="Tell future travelers what stood out." />
      </label>
      <button className="button primary" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Sending..." : "Submit Review"}
      </button>
      {state === "done" ? <p className="form-success">Review received. It will appear after admin approval.</p> : null}
    </form>
  );
}
