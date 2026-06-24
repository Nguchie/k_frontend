"use client";

import { useState } from "react";

import { getImageSource } from "@/lib/media";
import type { FAQ } from "@/lib/types";

type FAQSectionProps = {
  faqs: FAQ[];
};

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string; caption?: string } | null>(null);

  if (!faqs.length) return null;

  return (
    <div className="faq-section">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`faq-item ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className="faq-question"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span>{faq.question_en}</span>
              <span className="faq-icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            <div className="faq-answer" hidden={!isOpen}>
              <p>{faq.answer_en}</p>
              {faq.images?.length ? (
                <div className="faq-answer-images" aria-label="FAQ answer images">
                  {faq.images.map((image) => {
                    const imageSource = getImageSource(image);
                    if (!imageSource) return null;
                    return (
                      <figure key={image.id} className="faq-answer-image">
                        <button
                          type="button"
                          className="faq-answer-image-button"
                          onClick={() => setActiveImage({ src: imageSource, alt: image.alt_text_en || image.title, caption: image.caption_en })}
                        >
                          <img src={imageSource} alt={image.alt_text_en || image.title} />
                        </button>
                        {image.caption_en ? <figcaption>{image.caption_en}</figcaption> : null}
                      </figure>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
      {activeImage ? (
        <div className="faq-image-lightbox" role="dialog" aria-modal="true" aria-label="Expanded FAQ image" onClick={() => setActiveImage(null)}>
          <div className="faq-image-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="faq-image-lightbox-close" onClick={() => setActiveImage(null)} aria-label="Close image">
              Close
            </button>
            <img src={activeImage.src} alt={activeImage.alt} />
            {activeImage.caption ? <p>{activeImage.caption}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
