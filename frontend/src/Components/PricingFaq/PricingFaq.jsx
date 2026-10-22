import React, { useState } from "react";
import "./PricingFaq.css";

const pricingFaqItems = [
  {
    question: "What's the difference between Signature & Intimate?",
    answer:
      "The Signature package includes cinematic wedding films, a teaser, a trailer, and extended coverage for both the bride and groom. The Intimate package includes photography, standard video coverage, a highlight film, and full wedding videos. Choose the package that best matches your celebration and memories.",
  },
  {
    question: "Do You Have Any Time Limit For Shooting Our Events?",
    answer:
      "We plan our photography and cinematography schedule according to your wedding itinerary. Our coverage depends on your selected package, event schedule, and agreed booking details. We discuss everything with you in advance to capture the important moments beautifully.",
  },
  {
    question: "Who has to select the final pictures?",
    answer:
      "Our team carefully selects and edits the photographs according to your package. If your package includes photo selection, you can choose your favourite images from the gallery before the final album is designed.",
  },
  {
    question: "What's your payment structure?",
    answer:
      "We generally arrange payments in stages: an advance to confirm your booking, an agreed instalment before the event, and the remaining balance according to the booking terms. The exact payment schedule will be discussed and confirmed when you book.",
  },
  {
    question: "How early should we book you?",
    answer:
      "We recommend booking 6–12 months in advance, especially for popular wedding dates and peak seasons. Earlier bookings give us more time to plan your photography, cinematography, and special creative requirements.",
  },
];

/* Decorative golden botanical branch */
const PricingFaqLeaf = ({ className = "" }) => (
  <svg
    className={`PricingFaq__leaf-svg ${className}`}
    viewBox="0 0 200 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="PricingFaqLeafGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F3D9A7" />
        <stop offset="48%" stopColor="#C99A52" />
        <stop offset="100%" stopColor="#98703B" />
      </linearGradient>
    </defs>

    <path
      d="M16 244C64 186 104 112 173 17"
      stroke="url(#PricingFaqLeafGold)"
      strokeWidth="1.7"
      strokeLinecap="round"
    />

    <g
      stroke="url(#PricingFaqLeafGold)"
      strokeWidth="1.2"
      strokeLinejoin="round"
    >
      <path
        d="M35 216C7 204 2 181 8 161C32 170 42 190 35 216Z"
        fill="#DCC49A"
        fillOpacity=".43"
      />
      <path d="M35 216L8 161" />

      <path
        d="M53 188C82 185 100 165 102 143C75 148 57 165 53 188Z"
        fill="#E8D2A9"
        fillOpacity=".55"
      />
      <path d="M53 188L102 143" />

      <path
        d="M77 150C48 138 40 116 48 95C72 109 83 128 77 150Z"
        fill="#D6BD8F"
        fillOpacity=".5"
      />
      <path d="M77 150L48 95" />

      <path
        d="M98 119C125 113 141 91 139 70C113 79 99 96 98 119Z"
        fill="#E8D2A9"
        fillOpacity=".6"
      />
      <path d="M98 119L139 70" />

      <path
        d="M121 85C96 72 91 51 103 32C123 46 130 66 121 85Z"
        fill="#D6BD8F"
        fillOpacity=".5"
      />
      <path d="M121 85L103 32" />

      <path
        d="M143 54C162 49 176 32 175 15C157 21 145 36 143 54Z"
        fill="#E8D2A9"
        fillOpacity=".6"
      />
    </g>

    <circle cx="173" cy="17" r="2.4" fill="#C99A52" />
  </svg>
);

const PricingFaq = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <section className="PricingFaq" id="pricing-faq">
      {/* Decorative background */}
      <div className="PricingFaq__background" aria-hidden="true" />
      <div className="PricingFaq__glow PricingFaq__glow--left" aria-hidden="true" />
      <div className="PricingFaq__glow PricingFaq__glow--right" aria-hidden="true" />

      {/* Floating botanical decorations */}
      <div
        className="PricingFaq__botanical PricingFaq__botanical--left"
        aria-hidden="true"
      >
        <PricingFaqLeaf />
      </div>

      <div
        className="PricingFaq__botanical PricingFaq__botanical--right"
        aria-hidden="true"
      >
        <PricingFaqLeaf />
      </div>

      {/* Left introduction */}
      <div className="PricingFaq__container">
        <div className="PricingFaq__intro">
          <p className="PricingFaq__eyebrow">HAVE A QUESTION?</p>

          <div className="PricingFaq__ornament" aria-hidden="true">
            <span />
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 20S3 14 3 8C3 3 9 3 12 8C15 3 21 3 21 8C21 14 12 20 12 20Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
            <span />
          </div>

          <h2 className="PricingFaq__title">
            Frequently
            <span>Questions</span>
          </h2>

          <p className="PricingFaq__description">
            Leading the wedding photography &amp; film industry in Odisha
            for the past 11 years, we at RS Wedding Bells know that your
            special day deserves to be captured beautifully and cherished
            for a lifetime. Recognized for delivering the best wedding
            photography in Bhubaneswar, our team believes that your special
            day deserves to be captured with creativity, emotion, and
            perfection.
          </p>

          <a className="PricingFaq__contact-link" href="/contact">
            Still have questions?
            <span> Let's talk </span>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M3 10H16M11 5L16 10L11 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Right FAQ accordion */}
        <div className="PricingFaq__list">
          {pricingFaqItems.map((item, index) => {
            const isOpen = openFaq === index;
            const answerId = `PricingFaq-answer-${index}`;

            return (
              <article
                className={`PricingFaq__item ${
                  isOpen ? "PricingFaq__item--open" : ""
                }`}
                key={item.question}
                style={{ "--PricingFaq-item-index": index }}
              >
                <button
                  type="button"
                  className="PricingFaq__question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span className="PricingFaq__plus" aria-hidden="true">
                    <span />
                    <span />
                  </span>

                  <span className="PricingFaq__number">
                    {index + 1}.
                  </span>

                  <span className="PricingFaq__question-text">
                    {item.question}
                  </span>

                  <span className="PricingFaq__chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className="PricingFaq__answer-wrapper"
                  id={answerId}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                >
                  <div className="PricingFaq__answer-inner">
                    <p className="PricingFaq__answer">{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="PricingFaq__bottom-ornament" aria-hidden="true">
        <span />
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 20S3 14 3 8C3 3 9 3 12 8C15 3 21 3 21 8C21 14 12 20 12 20Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span />
      </div>
    </section>
  );
};

export default PricingFaq;