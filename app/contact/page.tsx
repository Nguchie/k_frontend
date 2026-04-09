import type { Metadata } from "next";

import { BookingForm } from "@/components/BookingForm";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact Kennice Tours Limited",
  description: "Contact Kennice Tours Limited for safari planning, pricing, route advice, and custom trip support across East Africa.",
  canonical: "/contact",
});

export default function ContactPage() {
  return (
    <div className="archive-shell">
      <div className="detail-content">
        <section className="detail-block">
          <SectionHeading
            eyebrow="Contact / Booking"
            title="Have a question?"
            body="Send your travel window, destination interests, and contact details. The team will reply with the next step."
            level="h1"
          />
          <p><strong>Call:</strong> <a href={`tel:${siteConfig.phonePrimary}`}>{siteConfig.phonePrimary}</a> / <a href={`tel:${siteConfig.phoneSecondary}`}>{siteConfig.phoneSecondary}</a></p>
          <p><strong>Email:</strong> <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></p>
          <p><strong>Coverage:</strong> {siteConfig.coverage.join(", ")}</p>
          <p>
            <a href={siteConfig.facebookUrl} target="_blank" rel="noreferrer">Facebook</a>{" "}
            |{" "}
            <a href={siteConfig.youtubeUrl} target="_blank" rel="noreferrer">YouTube</a>
          </p>
          <BookingForm sourcePage="/contact" useDateRange useIntlPhone />
        </section>
        <section className="detail-block">
          <SectionHeading title="Office and map" />
          <div className="detail-map-frame">
            <iframe
              title="Kennice Tours Limited office map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.6329478463954!2d36.7530625!3d-1.3966874999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f05e96c9c51c3%3A0x1cecd9c534996a6b!2sCleanshelf!5e0!3m2!1sen!2ske!4v1774377567813!5m2!1sen!2ske"
              width="100%"
              height="360"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ContactPage",
                name: "Contact Kennice Tours Limited",
                url: absoluteUrl("/contact"),
              },
              {
                "@type": "TravelAgency",
                name: "Kennice Tours Limited",
                url: absoluteUrl("/"),
                email: siteConfig.contactEmail,
                telephone: [siteConfig.phonePrimary, siteConfig.phoneSecondary],
                areaServed: siteConfig.coverage,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
