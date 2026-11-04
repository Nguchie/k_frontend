import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GeneralFAQExplorer } from "@/components/GeneralFAQExplorer";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllCountries, getFAQCategories, getGeneralFAQs } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Safari FAQs",
  description: "Answers to common safari planning questions about packing, honeymoons, payments, travel documents, safety, and East Africa destinations.",
  canonical: "/faqs",
});

export default async function FAQsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParams;
  const category = typeof filters.category === "string" ? filters.category : "";
  const country = typeof filters.country === "string" ? filters.country : "";
  const search = typeof filters.search === "string" ? filters.search : "";
  const apiParams = new URLSearchParams();

  if (category) apiParams.set("category", category);
  if (country) apiParams.set("country", country);
  if (search) apiParams.set("search", search);

  const [categories, countries, faqs] = await Promise.all([
    getFAQCategories(),
    getAllCountries(),
    getGeneralFAQs(apiParams),
  ]);

  return (
    <div className="archive-shell general-faq-page">
      <div className="archive-hero">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Safari FAQs" }]} />
        <SectionHeading
          title="Safari FAQs"
          body="Practical answers for planning, packing, booking, honeymoon safaris, family travel, payments, documents, and country-specific safari questions."
          level="h1"
        />
      </div>

      <GeneralFAQExplorer
        categories={categories}
        countries={countries}
        faqs={faqs}
        activeCategory={category}
        activeCountry={country}
        activeSearch={search}
      />

      <section className="general-faq-cta">
        <div>
          <p className="eyebrow">Need a specific answer?</p>
          <h2>Ask us directly</h2>
          <p>Share your travel dates, group size, destination ideas, or safari style and we will help you narrow down the right next step.</p>
        </div>
        <Link href="/contact" className="primary-link">Contact Kennice Tours</Link>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.slice(0, 12).map((faq) => ({
            "@type": "Question",
            name: faq.question_en,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer_en,
            },
          })),
        }}
      />
    </div>
  );
}
