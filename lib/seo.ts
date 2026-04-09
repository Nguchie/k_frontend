import type { Metadata } from "next";

const FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  if (!path) {
    return getSiteUrl();
  }
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

type MetadataInput = {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
};

export function buildMetadata({ title, description, canonical, noindex = false }: MetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: canonical ? absoluteUrl(canonical) : undefined,
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
