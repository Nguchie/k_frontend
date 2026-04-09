"use client";

import Link from "next/link";
import { useState } from "react";

type SearchPanelProps = {
  compact?: boolean;
};

export function SearchPanel({ compact = false }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [budget, setBudget] = useState("");
  const [people, setPeople] = useState("");
  const [duration, setDuration] = useState("");
  const [month, setMonth] = useState("");

  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (budget) params.set("budget", budget);
  if (people) params.set("people", people);
  if (duration) params.set("duration", duration);
  if (month) params.set("month", month);

  return (
    <div className={`search-panel ${compact ? "compact" : ""}`}>
      <div className="search-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search destinations, parks, or tours"
          aria-label="Search destinations, parks, or tours"
        />
        <Link href={`/tours?${params.toString()}`} className="button primary">
          Search
        </Link>
      </div>
      <button type="button" className="filter-toggle" onClick={() => setShowFilters((current) => !current)}>
        {showFilters ? "Hide optional filters" : "Refine your safari"}
      </button>
      {showFilters ? (
        <div className="filter-grid">
          <label>
            Budget
            <select value={budget} onChange={(event) => setBudget(event.target.value)}>
              <option value="">Any</option>
              <option value="budget">Budget</option>
              <option value="mid-range">Mid-range</option>
              <option value="luxury">Luxury</option>
            </select>
          </label>
          <label>
            People
            <input value={people} onChange={(event) => setPeople(event.target.value)} type="number" min={1} placeholder="2" />
          </label>
          <label>
            Duration
            <input value={duration} onChange={(event) => setDuration(event.target.value)} type="number" min={1} placeholder="3" />
          </label>
          <label>
            Travel month
            <input value={month} onChange={(event) => setMonth(event.target.value)} placeholder="July" />
          </label>
        </div>
      ) : null}
    </div>
  );
}
