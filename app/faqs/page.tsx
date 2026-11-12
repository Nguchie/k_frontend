import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GeneralFAQExplorer } from "@/components/GeneralFAQExplorer";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllCountries, getAllGeneralFAQs, getFAQCategories } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

// Statically rendered + ISR. This page must never read searchParams: doing so
// makes it dynamic and every `/faqs?category=..&search=..` variant becomes a
// function invocation (which bots were brute-forcing). Filters are applied
// client-side in GeneralFAQExplorer from the full FAQ list instead.
export const revalidate = 3600; // must be a literal; matches CONTENT_REVALIDATE_SECONDS
export const dynamic = "force-static";

const FAQ_DESCRIPTION =
  "Answers to common safari planning questions about packing, honeymoons, payments, travel documents, safety, and East Africa destinations.";

export const metadata: Metadata = buildMetadata({
  title: "Safari FAQs",
  description: FAQ_DESCRIPTION,
  canonical: "/faqs",
});

export default async function FAQsPage() {
  const [categories, countries, faqs] = await Promise.all([
    getFAQCategories(),
    getAllCountries(),
    getAllGeneralFAQs(),
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

      <GeneralFAQExplorer categories={categories} countries={countries} faqs={faqs} />

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
