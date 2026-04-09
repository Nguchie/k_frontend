"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    title: "Safari planning across East Africa",
    body: "Thoughtful journeys through Kenya, Uganda, Tanzania, Rwanda, and Zanzibar with wildlife, landscapes, culture, and coastlines at the center.",
    image: "/hero/about1.jpg",
  },
  {
    title: "From savannah plains to mountain horizons",
    body: "A visual introduction to the kind of journeys Kennice Venture helps travelers plan across the region.",
    image: "/hero/about2.jpg",
  },
  {
    title: "Travel shaped around experience, not guesswork",
    body: "Routes, timing, and support built around real East Africa travel knowledge.",
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
