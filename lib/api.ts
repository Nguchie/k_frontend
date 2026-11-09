import { cache } from "react";

import { Country, Destination, FAQCategory, GeneralFAQ, Guide, GuideCategory, HomepageFAQ, HomepageHeroSlide, InquiryPayload, Review, Tour } from "@/lib/types";
import { getApiBaseUrl } from "@/lib/backend";

export const CONTENT_REVALIDATE_SECONDS = 3600;

async function fetchJson<T>(path: string): Promise<T> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API base URL missing");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    next: { revalidate: CONTENT_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Failed request: ${response.status}`);
  }

  return response.json();
}

type Paginated<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
};

function withPage(path: string, page: number) {
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}page=${page}`;
}

/** Follow DRF page links so list helpers are not capped at PAGE_SIZE (12). */
async function fetchAllPages<T>(path: string, maxPages = 50): Promise<T[]> {
  const first = await fetchJson<Paginated<T> | T[]>(path);
  if (Array.isArray(first)) {
    return first;
  }

  const items = [...(first.results || [])];
  let nextUrl = first.next || null;
  let page = 2;

  while (nextUrl && page <= maxPages) {
    // Prefer explicit page numbers. Absolute DRF "next" URLs point at the
    // public Railway host, which the Vercel server may not use.
    const batch = await fetchJson<Paginated<T> | T[]>(withPage(path, page));
    if (Array.isArray(batch)) {
      items.push(...batch);
      break;
    }

    const batchResults = batch.results || [];
    if (!batchResults.length) {
      break;
    }

    items.push(...batchResults);
    nextUrl = batch.next || null;
    page += 1;
  }

  return items;
}

export const getHomepageData = cache(async function getHomepageData() {
  try {
    return await fetchJson<{
      hero_slides: HomepageHeroSlide[];
      featured_tours: Tour[];
      featured_destinations: Destination[];
      featured_guides: Guide[];
      featured_reviews: Review[];
      featured_faqs: HomepageFAQ[];
      review_stats: { avg_rating: number; review_count: number };
    }>("/homepage/");
  } catch {
    return {
      hero_slides: [],
      featured_tours: [],
      featured_destinations: [],
      featured_guides: [],
      featured_reviews: [],
      featured_faqs: [],
      review_stats: { avg_rating: 0, review_count: 0 },
    };
  }
});

export const getDestination = cache(async function getDestination(country: string, slug: string) {
  try {
    return await fetchJson<Destination>(`/destinations/${country}/${slug}/detail/`);
  } catch {
    return null;
  }
});

export const getTour = cache(async function getTour(country: string, slug: string) {
  try {
    return await fetchJson<Tour>(`/tours/${country}/${slug}/detail/`);
  } catch {
    return null;
  }
});

export const getGuide = cache(async function getGuide(slug: string) {
  try {
    return await fetchJson<Guide>(`/guides/${slug}/detail/`);
  } catch {
    return null;
  }
});

export const getReviews = cache(async function getReviews() {
  try {
    const response = await fetchJson<Review[] | { results: Review[] }>("/reviews/");
    return Array.isArray(response) ? response : response.results;
  } catch {
    return [];
  }
});

export async function searchContent(params: URLSearchParams) {
  try {
    return await fetchJson<{
      destinations: Destination[];
      tours: Tour[];
      guides: Guide[];
    }>(`/search/?${params.toString()}`);
  } catch {
    return {
      destinations: [],
      tours: [],
      guides: [],
    };
  }
}

export const getAllDestinations = cache(async function getAllDestinations() {
  try {
    return await fetchAllPages<Destination>("/destinations/");
  } catch {
    return [] as Destination[];
  }
});

export const getAllCountries = cache(async function getAllCountries() {
  try {
    return await fetchAllPages<Country>("/countries/");
  } catch {
    return [] as Country[];
  }
});

export const getAllTours = cache(async function getAllTours() {
  try {
    return await fetchAllPages<Tour>("/tours/");
  } catch {
    return [] as Tour[];
  }
});

export const getAllGuides = cache(async function getAllGuides() {
  try {
    return await fetchAllPages<Guide>("/guides/");
  } catch {
    return [] as Guide[];
  }
});

export const getGuideCategories = cache(async function getGuideCategories() {
  try {
    return await fetchJson<GuideCategory[]>("/guide-categories/");
  } catch {
    return [] as GuideCategory[];
  }
});

export const getFAQCategories = cache(async function getFAQCategories() {
  try {
    return await fetchJson<FAQCategory[]>("/faq-categories/");
  } catch {
    return [] as FAQCategory[];
  }
});

export async function getGeneralFAQs(params?: URLSearchParams) {
  try {
    const query = params?.toString();
    const response = await fetchJson<GeneralFAQ[] | { results: GeneralFAQ[] }>(`/general-faqs/${query ? `?${query}` : ""}`);
    return Array.isArray(response) ? response : response.results;
  } catch {
    return [] as GeneralFAQ[];
  }
}

export const getGuideCategory = cache(async function getGuideCategory(slug: string) {
  try {
    return await fetchJson<{ category: GuideCategory; guides: Guide[] }>(`/guide-categories/${slug}/`);
  } catch {
    return null;
  }
});

const SUBMIT_TIMEOUT_MS = 20000;

function formatApiError(data: unknown, status: number) {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.detail === "string" && record.detail.trim()) {
      return record.detail;
    }

    const fieldErrors = Object.entries(record)
      .filter(([, value]) => typeof value === "string" || Array.isArray(value))
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(" ") : value}`)
      .join(" ");

    if (fieldErrors) {
      return fieldErrors;
    }
  }

  return `Request failed (${status}). Please try again.`;
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

  try {
    const response = await fetch(`/api/proxy${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const text = await response.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { detail: text || `Request failed (${response.status}).` };
    }

    if (!response.ok) {
      throw new Error(formatApiError(data, response.status));
    }

    return data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The request timed out. Please try again.");
    }
    if (error instanceof TypeError) {
      throw new Error("We could not reach the server. Please try again shortly.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function submitInquiry(payload: InquiryPayload) {
  return postJson("/inquiries/", payload);
}

export async function submitReview(payload: {
  reviewer_name: string;
  reviewer_email?: string;
  reviewer_country?: string;
  rating: number;
  title?: string;
  content: string;
  travel_date?: string;
  trip_type?: string;
  destination?: number;
  tour?: number;
}) {
  return postJson("/reviews/submit/", payload);
}
