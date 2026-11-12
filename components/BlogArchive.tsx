"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { BlogCard } from "@/components/BlogCard";
import { BlogSidebar } from "@/components/BlogSidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/SectionHeading";
import type { Guide, GuideCategory } from "@/lib/types";

type BlogArchiveProps = {
  guides: Guide[];
  categories: GuideCategory[];
};

function guideMatchesCountry(guide: Guide, country: string) {
  if (!country) return true;
  return (
    guide.country?.slug === country ||
    Boolean(guide.destinations?.some((destination) => destination.country.slug === country))
  );
}

function resolveCountryName(guides: Guide[], country: string) {
  if (!country) return "";
  const direct = guides.find((guide) => guide.country?.slug === country)?.country?.name;
  if (direct) return direct;
  return (
    guides
      .flatMap((guide) => guide.destinations || [])
      .find((destination) => destination.country.slug === country)?.country.name || ""
  );
}

export function BlogArchive({ guides, categories }: BlogArchiveProps) {
  // useSearchParams is confined to this client island (page wraps us in
  // Suspense). The server page itself must not await searchParams, or /blog
  // becomes dynamic again.
  const searchParams = useSearchParams();
  const country = searchParams.get("country")?.trim() ?? "";

  const filteredGuides = useMemo(
    () => guides.filter((guide) => guideMatchesCountry(guide, country)),
    [guides, country],
  );
  const countryName = useMemo(() => resolveCountryName(guides, country), [guides, country]);

  return (
    <>
      <div className="archive-hero">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            ...(country
              ? [{ label: "Countries", href: "/countries" }, { label: countryName || country }]
              : []),
            { label: "Blog" },
          ]}
        />
        <SectionHeading
          title={countryName ? `${countryName} Guides` : "Safari Guides"}
          body={
            countryName
              ? `Use these guides to plan routes, timing, and safari decisions in ${countryName}.`
              : "Use these guides to plan timing, packing, routes, and the right safari style before booking."
          }
          level="h1"
        />
        {country ? (
          <Link href="/blog" className="text-link blog-clear-country" prefetch={false}>
            Clear country filter
          </Link>
        ) : null}
      </div>
      <div className="blog-archive-layout">
        <div className="grid cards-3">
          {filteredGuides.length ? (
            filteredGuides.map((guide) => <BlogCard key={guide.id} guide={guide} />)
          ) : (
            <article className="card card-copy empty-state-card">
              <h3>No guides matched that country.</h3>
              <p>Clear the filter or browse all safari guides.</p>
              <Link href="/blog" className="primary-link" prefetch={false}>
                Show all guides
              </Link>
            </article>
          )}
        </div>
        <aside>
          <BlogSidebar categories={categories} guides={filteredGuides} />
        </aside>
      </div>
    </>
  );
}
