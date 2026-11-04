import type { Metadata } from "next";

const FALLBACK_SITE_URL = "http://localhost:3000";

function sameSiteHost(left: string, right: string) {
  return left.replace(/^www\./i, "").toLowerCase() === right.replace(/^www\./i, "").toLowerCase();
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const site = getSiteUrl();
  if (!path) {
    return site;
  }

  // Django may store apex/http canonical_urls while Vercel prefers www/https.
  // Always rewrite same-site absolute URLs onto NEXT_PUBLIC_SITE_URL.
  if (/^https?:\/\//i.test(path)) {
    try {
      const incoming = new URL(path);
      const preferred = new URL(site);
      if (sameSiteHost(incoming.hostname, preferred.hostname)) {
        return `${preferred.origin}${incoming.pathname}${incoming.search}${incoming.hash}`;
      }
      return path;
    } catch {
      return path;
    }
  }

  return `${site}${path.startsWith("/") ? path : `/${path}`}`;
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
