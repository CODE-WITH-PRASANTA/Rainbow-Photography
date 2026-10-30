import React, { useState } from "react";
import "./PricingFaq.css";

const pricingFaqItems = [
  {
    question: "What is the difference between Luxe, Signature & Intimate packages?",
    answer:
      "Our Luxe Collection is the ultimate royal experience featuring senior master leads, pre-wedding shoot, 4K multi-camera cinema, custom composed love anthem, and AI guest face recognition. The Signature Story is our most popular package, providing comprehensive 2-day dual-side photo & cinema coverage with drone shots, teasers, and luxury albums. The Intimate Affair is tailored for smaller, close-knit gatherings focusing on candid moments, ceremony highlights, and a signature photobook.",
  },
  {
    question: "Do you have any hourly limit or time restrictions for events?",
    answer:
      "No, we do not believe in watching the clock during your big day. We align our crew strictly around your planned rituals and wedding timeline—from the bride getting ready and Baraat arrival until the final Vidai ceremony concludes. Any extra extended rituals are communicated and coordinated smoothly without rushing your precious moments.",
  },
  {
    question: "How does the final photo selection and album design process work?",
    answer:
      "Within 10–14 days after your celebrations, we deliver all color-graded high-resolution photos through an exclusive, password-protected online client gallery. You and your family can shortlist your favorites directly from your phone or laptop. Once selected, our senior design artists craft the custom layouts and send you a digital preview for approval before sending them for fine-art handcrafted printing.",
  },
  {
    question: "What is the payment structure and booking schedule?",
    answer:
      "To ensure exclusive reservation of your date, we accept a 25% advance retainer upon signing the contract. 60% is scheduled before or on the primary wedding dates, and the remaining 15% balance is cleared upon delivery of your raw files and digital preview proofs. We provide formal receipts and milestone agreements for complete transparency.",
  },
  {
    question: "How early should we book Rainbow Photography?",
    answer:
      "Because auspicious wedding dates (lagna dates) sell out fast, couples typically book us 6 to 12 months in advance. Early booking secures your chosen dates, locks in package prices against seasonal revisions, and allows our creative team ample time to scout locations and plan your pre-wedding story.",
  },
  {
    question: "Do you travel for destination weddings across India & abroad?",
    answer:
      "Yes! While based in Odisha, our crew regularly travels across India and international destination venues. For outstation events, client provisions or reimbursement for travel (flights/trains) and venue stay for our crew members are simply added to the standard package.",
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
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <section className="PricingFaq" id="pricing-faq" aria-labelledby="pricing-faq-title">
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

      <div className="PricingFaq__container">
        {/* Left introduction */}
        <div className="PricingFaq__intro">
          <p className="PricingFaq__eyebrow">HAVE QUESTIONS?</p>

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

          <h2 id="pricing-faq-title" className="PricingFaq__title">
            Frequently
            <span>Asked Questions</span>
          </h2>

          <p className="PricingFaq__description">
            Celebrating over a decade of visual excellence, Rainbow Photography is 
            celebrated for turning intimate nuptials and grandeur weddings into timeless 
            cinematic heirlooms. Here are clarity-first answers to everything you need to 
            know about our approach, deliverables, and shooting process.
          </p>

          <a className="PricingFaq__contact-link" href="/contact">
            Have a custom requirement?
            <span> Let's connect </span>
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
        <div className="PricingFaq__list" role="region" aria-label="Wedding Pricing FAQs">
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
                    {String(index + 1).padStart(2, "0")}.
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
                  inert={!isOpen ? "" : undefined}
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