"use client";

import { useEffect, useMemo, useState } from "react";

import { getImageSource } from "@/lib/media";
import { ImageAsset } from "@/lib/types";

type TourGalleryProps = {
  title: string;
  gallery?: ImageAsset[];
};

export function TourGallery({ title, gallery = [] }: TourGalleryProps) {
  const images = useMemo(() => {
    return gallery;
  }, [gallery, title]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [failedIndexes, setFailedIndexes] = useState<number[]>([]);
  useEffect(() => {
    setActiveIndex(0);
    setFailedIndexes([]);
  }, [images]);

  const availableImages = images.filter((_, index) => !failedIndexes.includes(index));
  const active = availableImages[activeIndex] || availableImages[0];

  if (!active) {
    return null;
  }

  function handleImageError(index: number) {
    setFailedIndexes((current) => (current.includes(index) ? current : [...current, index]));
    setActiveIndex(0);
  }

  return (
    <section className="tour-gallery">
      <div className="tour-gallery-frame">
        <img
          src={getImageSource(active) ?? ""}
          alt={active.alt_text_en || title}
          onError={() => handleImageError(images.findIndex((image) => image.id === active.id))}
        />
      </div>
      {availableImages.length > 1 ? (
        <div className="tour-gallery-track">
          {availableImages.map((image, index) => (
            <button
              key={`${image.id}-${index}`}
              type="button"
              className={`tour-gallery-thumb ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={getImageSource(image) ?? ""}
                alt={image.alt_text_en || title}
                onError={() => handleImageError(images.findIndex((item) => item.id === image.id))}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
