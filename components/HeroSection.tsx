"use client";

import Link from "next/link";
import { preload } from "react-dom";
import { useEffect, useState } from "react";

import { SearchPanel } from "@/components/SearchPanel";
import { getImageSource } from "@/lib/media";
import { HomepageHeroSlide } from "@/lib/types";

const fallbackSlides = [
  {
    eyebrow_en: "Migration windows",
    title_en: "East Africa safaris shaped around the right season.",
    subtitle_en: "Explore wildlife-rich journeys across the Mara, Serengeti, Amboseli, and more with clear dates and pricing.",
    image: "/hero/default-hero-1.jpg",
    position: 1,
  },
  {
    eyebrow_en: "Big five moments",
    title_en: "See the savannah, mountains, and signature game-viewing routes.",
    subtitle_en: "From migration plains to gorilla forests, every tour is built around a clear travel experience.",
    image: "/hero/default-hero-2.jpg",
    position: 2,
  },
  {
    eyebrow_en: "Explore Kenya with Kennice Tours",
    title_en: "Enjoy every destination",
    subtitle_en: "Affordable safaris, group trips & customised travel experiences across Kenya.",
    image: "/hero/default-hero-3.jpg",
    position: 3,
  },
];

function getSlideImage(slide: HomepageHeroSlide | (typeof fallbackSlides)[number], index: number) {
  return getImageSource(slide.image) ?? fallbackSlides[index % fallbackSlides.length].image;
}

export function HeroSection({ slides = [] }: { slides?: HomepageHeroSlide[] }) {
  const heroSlides = fallbackSlides.map((fallbackSlide, index) => {
    const slide = slides[index];

    if (!slide) {
      return fallbackSlide;
    }

    const mergedSlide = {
      ...fallbackSlide,
      ...slide,
      image: slide.image ?? fallbackSlide.image,
    };

    if (index === 2) {
      return {
        ...mergedSlide,
        eyebrow_en: fallbackSlide.eyebrow_en,
        title_en: fallbackSlide.title_en,
        subtitle_en: fallbackSlide.subtitle_en,
      };
    }

    return mergedSlide;
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);

  heroSlides.slice(0, 3).forEach((slide) => {
    preload(getSlideImage(slide, slide.position - 1), { as: "image" });
  });

  useEffect(() => {
    if (isPaused || heroSlides.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [heroSlides.length, isPaused]);

  useEffect(() => {
    heroSlides.slice(0, 3).forEach((slide, index) => {
      const image = new window.Image();
      image.src = getSlideImage(slide, index);
      void image.decode?.().catch(() => undefined);
    });
  }, [heroSlides]);

  function showPreviousSlide() {
    setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  }

  function showNextSlide() {
    setActiveIndex((current) => (current + 1) % heroSlides.length);
  }

  const activeSlide = heroSlides[activeIndex];

  return (
    <section
      className="hero hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div key={`${activeSlide.title_en}-${activeIndex}`} className="hero-slide active">
        <img
          src={getSlideImage(activeSlide, activeIndex)}
          alt={typeof activeSlide.image === "object" ? activeSlide.image?.alt_text_en || activeSlide.title_en : activeSlide.title_en}
          className="hero-slide-image"
          loading={activeIndex < 3 ? "eager" : "lazy"}
          fetchPriority={activeIndex === 0 ? "high" : activeIndex < 3 ? "auto" : "low"}
        />
        <div className="hero-slide-overlay" aria-hidden="true" />
      </div>
      {heroSlides.length > 1 ? (
        <>
          <div
            className={`hero-nav-zone hero-nav-zone-left ${hoveredSide === "left" ? "is-visible" : ""}`}
            onMouseEnter={() => setHoveredSide("left")}
            onFocus={() => setHoveredSide("left")}
            onClick={showPreviousSlide}
          >
            <button
              type="button"
              className="hero-nav-button"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousSlide();
              }}
              aria-label="Show previous slide"
            >
              <span aria-hidden="true">&lt;</span>
            </button>
          </div>
          <div
            className={`hero-nav-zone hero-nav-zone-right ${hoveredSide === "right" ? "is-visible" : ""}`}
            onMouseEnter={() => setHoveredSide("right")}
            onFocus={() => setHoveredSide("right")}
            onClick={showNextSlide}
          >
            <button
              type="button"
              className="hero-nav-button"
              onClick={(event) => {
                event.stopPropagation();
                showNextSlide();
              }}
              aria-label="Show next slide"
            >
              <span aria-hidden="true">&gt;</span>
            </button>
          </div>
        </>
      ) : null}
      <div className="hero-content">
        <p className="eyebrow">{activeSlide.eyebrow_en}</p>
        <h1>{activeSlide.title_en}</h1>
        <p>{activeSlide.subtitle_en}</p>
        <div className="hero-actions">
          <Link href="/tours" className="button primary">
            View Safari Packages
          </Link>
          <Link href="/destinations" className="button secondary">
            Browse Destinations
          </Link>
          <Link href="/tours?q=offer" className="button ghost">
            Hot Deals
          </Link>
        </div>
        <div className="hero-dots" aria-hidden="true">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.title_en}
              type="button"
              className={`hero-dot ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
        <SearchPanel />
      </div>
    </section>
  );
}
