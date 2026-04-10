import { cache } from "react";

import { Country, Destination, Guide, GuideCategory, HomepageFAQ, HomepageHeroSlide, InquiryPayload, Review, Tour } from "@/lib/types";
import { getApiBaseUrl } from "@/lib/backend";

async function fetchJson<T>(path: string): Promise<T> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API base URL missing");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed request: ${response.status}`);
  }

  return response.json();
}

async function fetchJsonNoStore<T>(path: string): Promise<T> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API base URL missing");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed request: ${response.status}`);
  }

  return response.json();
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

export async function getDestination(country: string, slug: string) {
  try {
    return await fetchJsonNoStore<Destination>(`/destinations/${country}/${slug}/detail/`);
  } catch {
    return null;
  }
}

export async function getTour(country: string, slug: string) {
  try {
    return await fetchJsonNoStore<Tour>(`/tours/${country}/${slug}/detail/`);
  } catch {
    return null;
  }
}

export async function getGuide(slug: string) {
  try {
    return await fetchJsonNoStore<Guide>(`/guides/${slug}/detail/`);
  } catch {
    return null;
  }
}

export async function getReviews() {
  try {
    const response = await fetchJson<Review[] | { results: Review[] }>("/reviews/");
    return Array.isArray(response) ? response : response.results;
  } catch {
    return [];
  }
}

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

export async function getAllDestinations() {
  try {
    const response = await fetchJson<{ results: Destination[] }>("/destinations/");
    return response.results;
  } catch {
    return [] as Destination[];
  }
}

export async function getAllCountries() {
  try {
    const response = await fetchJson<{ results: Country[] }>("/countries/");
    return response.results;
  } catch {
    return [] as Country[];
  }
}

export async function getAllTours() {
  try {
    const response = await fetchJson<{ results: Tour[] }>("/tours/");
    return response.results;
  } catch {
    return [] as Tour[];
  }
}

export async function getAllGuides() {
  try {
    const response = await fetchJson<{ results: Guide[] }>("/guides/");
    return response.results;
  } catch {
    return [] as Guide[];
  }
}

export async function getGuideCategories() {
  try {
    return await fetchJson<GuideCategory[]>("/guide-categories/");
  } catch {
    return [] as GuideCategory[];
  }
}

export async function getGuideCategory(slug: string) {
  try {
    return await fetchJson<{ category: GuideCategory; guides: Guide[] }>(`/guide-categories/${slug}/`);
  } catch {
    return null;
  }
}

export async function submitInquiry(payload: InquiryPayload) {
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/inquiries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed inquiry submission: ${response.status}`);
  }

  return response.json();
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
  const apiBaseUrl = getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/reviews/submit/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed review submission: ${response.status}`);
  }

  return response.json();
}
