import "./globals.css";

import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";

import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { TawkWidget } from "@/components/TawkWidget";
import { getHomepageData } from "@/lib/api";
import { dictionaries } from "@/lib/copy";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "Kennice Tours Limited",
    template: "%s | Kennice Tours Limited",
  },
  description: "Safari tours across Kenya, Uganda, Tanzania, Rwanda, and Zanzibar with clear itineraries, practical travel planning, and direct support.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const copy = dictionaries.en;
  const homepageData = await getHomepageData();

  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <SiteHeader brand={copy.brand} />
          <main>{children}</main>
          <footer className="site-footer">
            <div className="page-section">
              <div className="footer-grid">
                <div className="footer-column">
                  <div className="footer-brand-lockup">
                    <img src="/kennice_logo.jpeg" alt="Kennice Tours Limited logo" className="footer-logo" />
                    <p className="footer-brand">{copy.brand}</p>
                  </div>
                  <h3>Who we are</h3>
                  <p>
                    We plan safari journeys across {siteConfig.coverage.join(", ")} with a focus on clear itineraries, thoughtful routing, and direct support from inquiry to departure.
                  </p>
                  <p><a href={`tel:${siteConfig.phonePrimary}`}>{siteConfig.phonePrimary}</a></p>
                  <p><a href={`tel:${siteConfig.phoneSecondary}`}>{siteConfig.phoneSecondary}</a></p>
                  <p><a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></p>
                </div>
                <div className="footer-column">
                  <h3>Quick Links</h3>
                  <ul>
                    <li><Link href="/destinations">Destinations</Link></li>
                    <li><Link href="/tours">Tours</Link></li>
                    <li><Link href="/blog">Safari Guides</Link></li>
                    <li><Link href="/reviews">Reviews</Link></li>
                    <li><Link href="/about">About Us</Link></li>
                    <li><Link href="/contact">Have a Question?</Link></li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h3>Tour FAQs</h3>
                  <ul>
                    {homepageData.featured_faqs.map((faq) => (
                      <li key={`${faq.tour_slug}-${faq.question_en}`}>
                        <Link href={`/tours/${faq.country_slug}/${faq.tour_slug}`}>
                          {faq.question_en}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="footer-column">
                  <h3>Connect</h3>
                  <ul>
                    <li><Link href="/contact">Have a Question?</Link></li>
                    <li><a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a></li>
                    <li><a href={siteConfig.facebookUrl} target="_blank" rel="noreferrer">Facebook</a></li>
                    <li><a href={siteConfig.youtubeUrl} target="_blank" rel="noreferrer">YouTube</a></li>
                  </ul>
                </div>
              </div>
              <p className="footer-meta">Safari planning for Kenya, Uganda, Tanzania, Rwanda, and Zanzibar with clear tour details, destination guidance, and direct support.</p>
            </div>
          </footer>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "TravelAgency",
                  "@id": absoluteUrl("/#organization"),
                  name: "Kennice Tours Limited",
                  url: absoluteUrl("/"),
                  email: siteConfig.contactEmail,
                  telephone: [siteConfig.phonePrimary, siteConfig.phoneSecondary],
                  areaServed: siteConfig.coverage,
                },
                {
                  "@type": "WebSite",
                  "@id": absoluteUrl("/#website"),
                  url: absoluteUrl("/"),
                  name: "Kennice Tours Limited",
                  publisher: { "@id": absoluteUrl("/#organization") },
                },
              ],
            }}
          />
          <TawkWidget />
          <StickyWhatsApp />
        </div>
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                { pageLanguage: "en" },
                "google_translate_element"
              );
            }
            window.googleTranslateElementInit = googleTranslateElementInit;
          `}
        </Script>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
