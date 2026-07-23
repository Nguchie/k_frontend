"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    title: "Enjoy Every Destination",
    body: "Exceptional travel experiences across East Africa with personalized service, innovative solutions and a commitment to quality, safety and customer satisfaction.",
    image: "/hero/about1.jpg",
  },
  {
    title: "Your trusted travel partner in East Africa",
    body: "Expertly planned safaris, beach holidays, corporate travel, family vacations, and customized tour packages across Kenya, Uganda, Tanzania, Rwanda, and Zanzibar.",
    image: "/hero/about2.jpg",
  },
  {
    title: "Memorable journeys that inspire exploration",
    body: "We create unforgettable travel experiences that connect people with the beauty, culture and heritage of every destination while promoting responsible tourism.",
    image: "/hero/about3.jpg",
  },
];

export function AboutCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="about-carousel">
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={`about-carousel-slide ${index === activeIndex ? "active" : ""}`}
          style={{ backgroundImage: `linear-gradient(90deg, rgba(27, 18, 11, 0.76), rgba(27, 18, 11, 0.16)), url(${slide.image})` }}
        />
      ))}
      <div className="about-carousel-copy">
        <p className="eyebrow">About Us</p>
        <h1>{slides[activeIndex].title}</h1>
        <p>{slides[activeIndex].body}</p>
        <div className="hero-dots" aria-hidden="true">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              className={`hero-dot ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
