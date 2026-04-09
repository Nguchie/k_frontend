import type { Metadata } from "next";
import Link from "next/link";

import { AboutCarousel } from "@/components/AboutCarousel";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About Kennice Tours Limited",
  description: "Learn about Kennice Tours Limited, our East Africa safari coverage, and how we plan custom travel experiences across Kenya, Uganda, Tanzania, Rwanda, and Zanzibar.",
  canonical: "/about",
});

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutCarousel />

      <section className="about-intro">
        <div className="about-intro-copy">
          <p className="eyebrow">Welcome To Kennice Venture Tours and Travel</p>
          <h2>Your premier partner for unforgettable adventures across East Africa.</h2>
          <p>
            Located in Nairobi, Kenya, Kennice Venture Tours and Travel is dedicated to creating travel experiences that connect you with the landscapes, wildlife, and cultures of East Africa. We design journeys for travelers who want more than a standard package by shaping each trip around personal interests, pace, budget, and travel goals.
          </p>
          <p>
            Whether you are planning a classic Kenya safari, gorilla trekking in Uganda or Rwanda, or a Tanzania and Zanzibar wildlife-and-beach combination, we help turn that idea into a practical and memorable journey.
          </p>
        </div>
        <div className="about-intro-side">
          <div className="about-fact-card">
            <strong>Nairobi based</strong>
            <span>Local planning support from the heart of Kenya.</span>
          </div>
          <div className="about-fact-card">
            <strong>{siteConfig.coverage.join(" - ")}</strong>
            <span>Safari routes across East Africa with wildlife, culture, and nature at the center.</span>
          </div>
          <div className="about-fact-card">
            <strong>Direct support</strong>
            <span>{siteConfig.phonePrimary} / {siteConfig.phoneSecondary}</span>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-section-heading">
          <p className="eyebrow">Our Mission</p>
          <h2>Turn travel dreams into real, well-planned adventures.</h2>
        </div>
        <div className="about-section-copy">
          <p>
            At Kennice Venture, our mission is to turn travel dreams into reality. We believe travel is not just about reaching a destination. It is about the experiences, memories, and stories gathered along the way.
          </p>
          <p>
            We focus on journeys that reflect what each traveler values most, whether that means wildlife encounters, scenic landscapes, cultural experiences, or time to slow down and enjoy nature properly.
          </p>
        </div>
      </section>

      <section className="about-section about-section-centered">
        <div className="about-section-heading">
          <p className="eyebrow">Our Expertise</p>
          <h2>Tailored experiences across East Africa, including Rwanda and Zanzibar.</h2>
        </div>
        <div className="about-country-grid">
          <article className="about-country-card">
            <p className="eyebrow">Kenya</p>
            <h3>Classic safari country with iconic wildlife routes</h3>
            <p>
              Explore the Maasai Mara, home to the Great Migration, discover Amboseli with elephants against the backdrop of Mount Kilimanjaro, and experience the rich culture and warm hospitality that make Kenya one of Africa&apos;s most iconic safari destinations.
            </p>
          </article>
          <article className="about-country-card">
            <p className="eyebrow">Uganda</p>
            <h3>Forest adventures and remarkable biodiversity</h3>
            <p>
              Travel through the Pearl of Africa for gorilla trekking in Bwindi Impenetrable National Park, wildlife viewing in Queen Elizabeth National Park, and rich natural scenery built around forests, lakes, and biodiversity.
            </p>
          </article>
          <article className="about-country-card">
            <p className="eyebrow">Tanzania</p>
            <h3>Big landscapes, famous parks, and coastal escapes</h3>
            <p>
              Experience the Serengeti, Ngorongoro Crater, Mount Kilimanjaro, and the beaches of Zanzibar. Tanzania offers a powerful mix of wildlife, dramatic scenery, adventure, and coastal relaxation.
            </p>
          </article>
          <article className="about-country-card">
            <p className="eyebrow">Rwanda</p>
            <h3>High-end primate journeys and scenic mountain landscapes</h3>
            <p>
              Discover Rwanda through gorilla trekking in Volcanoes National Park, refined lodge stays, and clean, well-connected travel routes suited to travelers looking for a polished primate and nature experience.
            </p>
          </article>
          <article className="about-country-card">
            <p className="eyebrow">Zanzibar</p>
            <h3>Indian Ocean beach stays that pair naturally with safari</h3>
            <p>
              Add Zanzibar for white-sand beaches, island relaxation, Stone Town history, and a softer finish after safari. It works especially well for honeymoon trips and bush-to-beach combinations.
            </p>
          </article>
        </div>
      </section>

      <section className="about-section about-section-centered">
        <div className="about-section-heading">
          <p className="eyebrow">Our Commitment To You</p>
          <h2>Clear planning, personal support, and practical advice.</h2>
        </div>
        <div className="about-commitment-list-wrap about-commitment-centered">
          <p>
            We pride ourselves on providing exceptional customer service, ensuring every part of your journey feels smooth and well considered. Our team assists from the planning stage through the itinerary-building process with destination advice, travel timing, and practical guidance.
          </p>
          <ul className="about-commitment-list">
            <li>Customized itineraries built around your travel style and budget</li>
            <li>Clear guidance on safari routes, destination combinations, and timing</li>
            <li>Responsive support before booking and during the planning process</li>
          </ul>
        </div>
      </section>

      <section className="about-closing">
        <div className="about-closing-card">
          <p className="eyebrow">Adventure Begins Here</p>
          <h2>Join us for the adventure of a lifetime.</h2>
          <p>
            Whether you are a solo traveler, a couple on a romantic getaway, or a family seeking quality time together, Kennice Venture Tours and Travel is your trusted partner for exploring the beauty of East Africa.
          </p>
          <p>
            Join us as we explore, discover, and experience the wonders of East Africa, where your adventure begins.
          </p>
          <div className="button-row">
            <Link href="/tours" className="button primary">
              Explore Tours
            </Link>
            <Link href="/contact" className="button secondary">
              Have a Question?
            </Link>
          </div>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              name: "About Kennice Tours Limited",
              url: absoluteUrl("/about"),
            },
            {
              "@type": "TravelAgency",
              name: "Kennice Tours Limited",
              url: absoluteUrl("/"),
              areaServed: siteConfig.coverage,
              email: siteConfig.contactEmail,
              telephone: [siteConfig.phonePrimary, siteConfig.phoneSecondary],
            },
          ],
        }}
      />
    </div>
  );
}
