import type { Metadata } from "next";
import Link from "next/link";

import { AboutCarousel } from "@/components/AboutCarousel";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About Kennice Tours Limited",
  description: "Learn about Kennice Tours Limited, our mission, vision, and commitment to exceptional travel experiences across Kenya, Uganda, Tanzania, Rwanda, and Zanzibar.",
  canonical: "/about",
});

const coreValues = [
  {
    name: "Customer Excellence",
    description: "We place our clients at the heart of everything we do.",
  },
  {
    name: "Integrity",
    description: "We conduct our business with honesty, transparency, and professionalism.",
  },
  {
    name: "Quality Service",
    description: "We are committed to delivering reliable, seamless, and exceptional travel experiences.",
  },
  {
    name: "Safety",
    description: "We prioritize the well-being and security of our clients throughout every journey.",
  },
  {
    name: "Innovation",
    description: "We embrace creativity and technology to enhance our travel solutions.",
  },
  {
    name: "Sustainability",
    description: "We support responsible tourism that conserves the environment and benefits local communities.",
  },
  {
    name: "Teamwork",
    description: "We foster collaboration, respect and shared success among our team and partners.",
  },
];

const services = [
  "Wildlife Safaris",
  "Beach Holidays",
  "Corporate Travel & Team Building",
  "Family & Group Tours",
  "Honeymoon Packages",
  "Weekend Getaways",
  "Educational & School Trips",
  "Team Building Programs",
  "Hotel Reservations",
  "Airport Transfers",
  "Flight Booking Assistance",
  "Conference & Event Travel",
  "Accessible Tours",
  "Car Hire Services",
  "Customized Tour Packages",
  "Mission Tours",
  "Mascot Hiring for Events",
];

const whyChooseUs = [
  "Expertly planned safaris, beach holidays, corporate travel, family vacations, and group tours",
  "Customized travel packages tailored to your needs",
  "Experienced team with deep destination knowledge",
  "Competitive pricing without compromising quality",
  "Reliable transport and quality accommodation partners",
  "Commitment to exceptional customer service",
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutCarousel />

      <section className="about-intro">
        <div className="about-intro-copy">
          <p className="eyebrow">Welcome To Kennice Tours Limited</p>
          <h2>Your premier partner for unforgettable adventures across East Africa.</h2>
          <p className="about-tagline">&ldquo;Enjoy Every Destination&rdquo;</p>
          <p>
            Located in Nairobi, Kenya, Kennice Tours Limited is dedicated to creating travel experiences that connect you with the landscapes, wildlife, and cultures of East Africa. We design journeys for travelers who want more than a standard package by shaping each trip around personal interests, pace, budget, and travel goals.
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

      <section className="about-section about-section-centered">
        <div className="about-mission-vision-grid">
          <div className="about-section-heading">
            <p className="eyebrow">Our Mission</p>
            <h2>To deliver exceptional travel experiences through personalized service, innovative travel solutions and a commitment to quality, safety and customer satisfaction.</h2>
            <p>
              We strive to create memorable journeys that inspire exploration while promoting responsible and sustainable tourism.
            </p>
          </div>
          <div className="about-section-heading">
            <p className="eyebrow">Our Vision</p>
            <h2>To be the leading and most trusted tour and travel company in East Africa.</h2>
            <p>
              Recognized for excellence, innovation and creating unforgettable travel experiences that connect people with the beauty, culture and heritage of every destination.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section about-section-centered">
        <div className="about-section-heading">
          <p className="eyebrow">Our Core Values</p>
          <h2>The principles that guide every journey we create.</h2>
        </div>
        <div className="about-values-grid">
          {coreValues.map((value) => (
            <article key={value.name} className="about-value-card">
              <h3>{value.name}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-section-centered">
        <div className="about-section-heading">
          <p className="eyebrow">Why Choose Kennice Tours Limited</p>
          <h2>We are dedicated to turning every journey into a memorable experience.</h2>
        </div>
        <div className="about-why-choose-wrap">
          <p>
            At Kennice Tours Limited, we offer expertly planned safaris, beach holidays, corporate travel, family vacations, group tours and customized travel packages tailored to our clients&apos; needs. Our experienced team, competitive pricing, reliable transport, quality accommodation partners, and commitment to exceptional customer service ensure that every trip is enjoyable, safe and stress-free. Whether you are exploring Kenya or travelling across East Africa, we are your trusted travel partner.
          </p>
          <ul className="about-why-choose-list">
            {whyChooseUs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-section about-section-centered">
        <div className="about-section-heading">
          <p className="eyebrow">Our Services</p>
          <h2>Everything you need for a seamless travel experience.</h2>
        </div>
        <div className="about-services-grid">
          {services.map((service) => (
            <div key={service} className="about-service-card">
              <span>{service}</span>
            </div>
          ))}
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

      <section className="about-closing">
        <div className="about-closing-card">
          <p className="eyebrow">Adventure Begins Here</p>
          <h2>Join us for the adventure of a lifetime.</h2>
          <p>
            Whether you are a solo traveler, a couple on a romantic getaway, or a family seeking quality time together, Kennice Tours Limited is your trusted partner for exploring the beauty of East Africa.
          </p>
          <p>
            Enjoy every destination with us as we explore, discover, and experience the wonders of East Africa, where your adventure begins.
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
