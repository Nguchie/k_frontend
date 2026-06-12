"use client";

import { useState } from "react";

import type { FAQ } from "@/lib/types";

type FAQSectionProps = {
  faqs: FAQ[];
};

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            </div>
          </div>
        );
      })}
    </div>
  );
}
