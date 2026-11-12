"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getImageSource } from "@/lib/media";
import type { Country, FAQCategory, GeneralFAQ } from "@/lib/types";

type GeneralFAQExplorerProps = {
  categories: FAQCategory[];
  countries: Country[];
  faqs: GeneralFAQ[];
};

type Filters = {
  category: string;
  country: string;
  search: string;
};

const EMPTY_FILTERS: Filters = { category: "", country: "", search: "" };

function readFiltersFromLocation(): Filters {
  if (typeof window === "undefined") return EMPTY_FILTERS;
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get("category")?.trim() ?? "",
    country: params.get("country")?.trim() ?? "",
    search: params.get("search")?.trim() ?? "",
  };
}

/**
 * Mirror filter state into the URL so links can be shared, but do it with the
 * History API only. Using the Next router here would trigger an RSC request
 * (a server function invocation) on every filter change / keystroke.
 */
function writeFiltersToLocation(filters: Filters) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.country) params.set("country", filters.country);
  if (filters.search) params.set("search", filters.search);
  const query = params.toString();
  const next = `${window.location.pathname}${query ? `?${query}` : ""}`;
  const current = `${window.location.pathname}${window.location.search}`;
  if (next !== current) {
    window.history.replaceState(window.history.state, "", next);
  }
}

function matchesCountry(faq: GeneralFAQ, country: string) {
  if (!country) return true;
  // Mirrors the API: FAQs with no countries apply everywhere.
  if (!faq.countries?.length) return true;
  const needle = country.toLowerCase();
  return faq.countries.some(
    (item) => item.slug.toLowerCase() === needle || item.code.toLowerCase() === needle,
  );
}

function matchesSearch(faq: GeneralFAQ, search: string) {
  if (!search) return true;
  const needle = search.toLowerCase();
  return faq.question_en.toLowerCase().includes(needle) || faq.answer_en.toLowerCase().includes(needle);
}

export function GeneralFAQExplorer({ categories, countries, faqs }: GeneralFAQExplorerProps) {
  // Render unfiltered on the server (static HTML) and hydrate filters from the
  // URL on the client.
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [searchValue, setSearchValue] = useState("");
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string; caption?: string } | null>(null);

  useEffect(() => {
    const initial = readFiltersFromLocation();
    setFilters(initial);
    setSearchValue(initial.search);
  }, []);

  // Debounce typing into the search filter; purely local state.
  useEffect(() => {
    const trimmed = searchValue.trim();
    if (trimmed === filters.search) return;
    const timeout = window.setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: trimmed }));
    }, 200);
    return () => window.clearTimeout(timeout);
  }, [searchValue, filters.search]);

  useEffect(() => {
    writeFiltersToLocation(filters);
  }, [filters]);

  const categoryBySlug = useMemo(() => new Map(categories.map((category) => [category.slug, category])), [categories]);
  const selectedCategory = filters.category ? categoryBySlug.get(filters.category) : null;

  const visibleFaqs = useMemo(
    () =>
      faqs.filter(
        (faq) =>
          (!filters.category || faq.category?.slug === filters.category) &&
          matchesCountry(faq, filters.country) &&
          matchesSearch(faq, filters.search),
      ),
    [faqs, filters],
  );

  useEffect(() => {
    if (openId !== null && !visibleFaqs.some((faq) => faq.id === openId)) {
      setOpenId(visibleFaqs[0]?.id ?? null);
    }
  }, [visibleFaqs, openId]);

  const hasFilters = Boolean(filters.category || filters.country || filters.search);

  function setCategory(category: string) {
    setFilters((prev) => ({ ...prev, category }));
  }

  function setCountry(country: string) {
    setFilters((prev) => ({ ...prev, country }));
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
    setSearchValue("");
  }

  return (
    <div className="general-faq-layout">
      <section className="general-faq-controls" aria-label="FAQ filters">
        <label className="general-faq-search">
          <span>Search FAQs</span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search packing, honeymoon, visa, payments..."
          />
        </label>

        <div className="general-faq-category-grid" aria-label="FAQ categories">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`general-faq-category ${!filters.category ? "is-active" : ""}`}
            aria-pressed={!filters.category}
          >
            <strong>All FAQs</strong>
            <span>Browse every general safari question.</span>
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => setCategory(category.slug)}
              className={`general-faq-category ${filters.category === category.slug ? "is-active" : ""}`}
              aria-pressed={filters.category === category.slug}
            >
              <strong>{category.name}</strong>
              {category.description ? <span>{category.description}</span> : null}
            </button>
          ))}
        </div>

        <div className="general-faq-country-row" aria-label="Country filter">
          <button
            type="button"
            onClick={() => setCountry("")}
            className={`filter-chip ${!filters.country ? "is-active" : ""}`}
            aria-pressed={!filters.country}
          >
            All countries
          </button>
          {countries.map((country) => {
            const isActive = filters.country.toLowerCase() === country.slug.toLowerCase();
            return (
              <button
                type="button"
                key={country.id}
                onClick={() => setCountry(country.slug)}
                className={`filter-chip ${isActive ? "is-active" : ""}`}
                aria-pressed={isActive}
              >
                {country.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="general-faq-results" aria-label="FAQ results">
        <div className="general-faq-results-header">
          <div>
            <p className="eyebrow">Showing {visibleFaqs.length} answer{visibleFaqs.length === 1 ? "" : "s"}</p>
            <h2>{selectedCategory?.name || "Safari FAQs"}</h2>
          </div>
          {hasFilters ? (
            <button type="button" onClick={clearFilters} className="text-link">Clear filters</button>
          ) : null}
        </div>

        {visibleFaqs.length ? (
          <div className="faq-section">
            {visibleFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              const resolvedLink = faq.resolved_link;
              return (
                <article key={faq.id} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question_en}</span>
                    <span className="faq-icon" aria-hidden="true">{isOpen ? "-" : "+"}</span>
                  </button>
                  <div className="faq-answer" hidden={!isOpen}>
                    <p>{faq.answer_en}</p>
                    {faq.images?.length ? (
                      <div className="faq-answer-images" aria-label="FAQ answer images">
                        {faq.images.map((image) => {
                          const imageSource = getImageSource(image);
                          if (!imageSource) return null;
                          return (
                            <figure key={image.id} className="faq-answer-image">
                              <button
                                type="button"
                                className="faq-answer-image-button"
                                onClick={() => setActiveImage({ src: imageSource, alt: image.alt_text_en || image.title, caption: image.caption_en })}
                              >
                                <img src={imageSource} alt={image.alt_text_en || image.title} />
                              </button>
                              {image.caption_en ? <figcaption>{image.caption_en}</figcaption> : null}
                            </figure>
                          );
                        })}
                      </div>
                    ) : null}
                    {resolvedLink.type !== "none" && resolvedLink.url && resolvedLink.label ? (
                      <Link href={resolvedLink.url} className="faq-related-link">
                        {resolvedLink.label}
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No FAQs matched those filters.</h3>
            <p>Try a broader category, remove the country filter, or contact us with your question.</p>
            <Link href="/contact" className="primary-link">Ask a question</Link>
          </div>
        )}
      </section>
      {activeImage ? (
        <div className="faq-image-lightbox" role="dialog" aria-modal="true" aria-label="Expanded FAQ image" onClick={() => setActiveImage(null)}>
          <div className="faq-image-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="faq-image-lightbox-close" onClick={() => setActiveImage(null)} aria-label="Close image">
              Close
            </button>
            <img src={activeImage.src} alt={activeImage.alt} />
            {activeImage.caption ? <p>{activeImage.caption}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
