import type { MetadataRoute } from "next";

import { getAllCountries, getAllDestinations, getAllGuides, getAllTours, getGuideCategories } from "@/lib/api";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [countries, destinations, tours, guides, guideCategories] = await Promise.all([
    getAllCountries(),
    getAllDestinations(),
    getAllTours(),
    getAllGuides(),
    getGuideCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/countries",
    "/tours",
    "/destinations",
    "/blog",
    "/faqs",
    "/about",
    "/contact",
    "/reviews",
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  // Prefer path-based URLs so sitemap always uses NEXT_PUBLIC_SITE_URL (www),
  // not older apex/http values stored in Django canonical_url fields.
  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((destination) => ({
    url: absoluteUrl(`/destinations/${destination.country.slug}/${destination.slug}`),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const countryRoutes: MetadataRoute.Sitemap = countries.map((country) => ({
    url: absoluteUrl(`/countries/${country.slug}`),
    changeFrequency: "weekly",
    priority: 0.82,
  }));

  const tourRoutes: MetadataRoute.Sitemap = tours.map((tour) => ({
    url: absoluteUrl(`/tours/${tour.destination.country.slug}/${tour.slug}`),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: absoluteUrl(`/blog/${guide.slug}`),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const guideCategoryRoutes: MetadataRoute.Sitemap = guideCategories
    .filter((category) => category.guide_count > 0)
    .map((category) => ({
    url: absoluteUrl(`/blog/guide-category/${category.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...countryRoutes, ...destinationRoutes, ...tourRoutes, ...guideRoutes, ...guideCategoryRoutes];
}
