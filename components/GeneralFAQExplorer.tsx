"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getImageSource } from "@/lib/media";
import type { Country, FAQCategory, GeneralFAQ } from "@/lib/types";

type GeneralFAQExplorerProps = {
  categories: FAQCategory[];
  countries: Country[];
  faqs: GeneralFAQ[];
  activeCategory?: string;
  activeCountry?: string;
  activeSearch?: string;
};

export function GeneralFAQExplorer({
  categories,
  countries,
  faqs,
  activeCategory = "",
  activeCountry = "",
  activeSearch = "",
}: GeneralFAQExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(activeSearch);
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string; caption?: string } | null>(null);

  useEffect(() => {
    setSearchValue(activeSearch);
  }, [activeSearch]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      updateParam("search", searchValue.trim(), { resetPage: true });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchValue]);

  const categoryBySlug = useMemo(() => new Map(categories.map((category) => [category.slug, category])), [categories]);
  const selectedCategory = activeCategory ? categoryBySlug.get(activeCategory) : null;

  function buildHref(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete("page");

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function updateParam(key: string, value: string, options?: { resetPage?: boolean }) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (options?.resetPage) {
      params.delete("page");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
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
          <Link href={buildHref({ category: "" })} className={`general-faq-category ${!activeCategory ? "is-active" : ""}`}>
            <strong>All FAQs</strong>
            <span>Browse every general safari question.</span>
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={buildHref({ category: category.slug })}
              className={`general-faq-category ${activeCategory === category.slug ? "is-active" : ""}`}
            >
              <strong>{category.name}</strong>
              {category.description ? <span>{category.description}</span> : null}
            </Link>
          ))}
        </div>

        <div className="general-faq-country-row" aria-label="Country filter">
          <Link href={buildHref({ country: "" })} className={`filter-chip ${!activeCountry ? "is-active" : ""}`}>
            All countries
          </Link>
          {countries.map((country) => (
            <Link
              key={country.id}
              href={buildHref({ country: country.code })}
              className={`filter-chip ${activeCountry.toLowerCase() === country.code.toLowerCase() ? "is-active" : ""}`}
            >
              {country.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="general-faq-results" aria-label="FAQ results">
        <div className="general-faq-results-header">
          <div>
            <p className="eyebrow">Showing {faqs.length} answer{faqs.length === 1 ? "" : "s"}</p>
            <h2>{selectedCategory?.name || "Safari FAQs"}</h2>
          </div>
          {(activeCategory || activeCountry || activeSearch) ? (
            <Link href="/faqs" className="text-link">Clear filters</Link>
          ) : null}
        </div>

        {faqs.length ? (
          <div className="faq-section">
            {faqs.map((faq) => {
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
