import React, { useState } from "react";
import "./Faq.css";

import heroBg from "../../assets/Bg-1.webp";
import flowerLeftBig from "../../assets/MainF-2.webp";
import flowerRightFade from "../../assets/MainF-1.webp";
import twinFlower from "../../assets/TwinFlower-1.webp";
import yellowFlower from "../../assets/yellow-1.webp";
import dividerImg from "../../assets/Devider.webp";

import { FiPlus, FiMinus } from "react-icons/fi";

const faqData = [
  {
    question: "What types of photography services do you offer?",
    answer:
      "Rainbow Photography offers wedding photography, pre-wedding shoots, engagement sessions, candid photography, portraits, and special event coverage. Contact us to discuss your photography needs.",
  },
  {
    question: "How do I book a photography session?",
    answer:
      "You can book a session by contacting us through our Contact page. Share your event date, location, and photography requirements, and we will help you plan the next steps.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "We cover locations based on your event requirements and our availability. Please share your event location with us so we can confirm travel arrangements.",
  },
  {
    question: "How long will it take to receive our photos?",
    answer:
      "Delivery time depends on the type of event, number of photographs, and editing requirements. We will provide an estimated delivery timeline when your booking is confirmed.",
  },
  {
    question: "What packages are available for weddings?",
    answer:
      "Our wedding packages can be planned around your event schedule, photography coverage, and preferred services. Visit the Package page or contact us for details.",
  },
  {
    question: "Can we customize a photography package?",
    answer:
      "Yes! You can discuss your preferred coverage, event duration, and additional services with us. We will help you choose a package that suits your celebration.",
  },
  {
    question: "Do you provide albums or prints?",
    answer:
      "Album and print options can be discussed during booking. Let us know whether you prefer a printed album, individual prints, or digital photographs.",
  },
  {
    question: "What happens if it rains on our event day?",
    answer:
      "We will discuss suitable backup locations and alternative arrangements with you in advance. Weather-dependent plans will be coordinated according to your venue and event requirements.",
  },
];

const Faq = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq((current) => (current === index ? null : index));
  };

  return (
    <main className="faqPage">
      <section className="faqHero">
        <div
          className="faqHero__bg"
          style={{ backgroundImage: `url(${heroBg})` }}
          aria-hidden="true"
        />

        <img
          src={flowerLeftBig}
          className="faqHero__flower faqHero__flower--left"
          alt=""
          aria-hidden="true"
        />

        <img
          src={flowerRightFade}
          className="faqHero__flower faqHero__flower--right"
          alt=""
          aria-hidden="true"
        />

        <img
          src={yellowFlower}
          className="faqHero__flower faqHero__flower--yellowLeft"
          alt=""
          aria-hidden="true"
        />

        <img
          src={yellowFlower}
          className="faqHero__flower faqHero__flower--yellowRight"
          alt=""
          aria-hidden="true"
        />

        <div className="faqHero__content">
          <span className="faqHero__eyebrow">
            Frequently Asked Questions
          </span>

          <img
            src={dividerImg}
            className="faqHero__divider"
            alt=""
            aria-hidden="true"
          />

          <h1 className="faqHero__title">Have Any Questions?</h1>

          <p className="faqHero__subtitle">
            Find answers to common questions about our photography services,
            packages, and booking process.
          </p>

          <img
            src={twinFlower}
            className="faqHero__twinFlower"
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>

      <section className="faqQuestions" aria-label="Frequently asked questions">
        <div className="faqQuestions__header">
          <span className="faqQuestions__label">WE ARE HERE TO HELP</span>
          <h2 className="faqQuestions__title">
            Everything You Need to Know
          </h2>
          <p className="faqQuestions__description">
            Have a question about your special day? Explore our answers below.
          </p>
        </div>

        <div className="faqQuestions__grid">
          {faqData.map((faq, index) => {
            const isOpen = activeFaq === index;
            const answerId = `faq-answer-${index}`;

            return (
              <article
                className={`faqItem ${isOpen ? "faqItem--open" : ""}`}
                key={faq.question}
              >
                <button
                  type="button"
                  className="faqItem__question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span className="faqItem__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="faqItem__questionText">
                    {faq.question}
                  </span>

                  <span className="faqItem__icon" aria-hidden="true">
                    {isOpen ? <FiMinus /> : <FiPlus />}
                  </span>
                </button>

                {isOpen && (
                  <div className="faqItem__answer" id={answerId}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="faqQuestions__contact">
          <img src={dividerImg} alt="" aria-hidden="true" />
          <h3>Still Have Questions?</h3>
          <p>
            Every love story is unique. We would love to hear about yours.
          </p>
          <a href="/contact" className="faqQuestions__contactLink">
            Contact Us <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  );
};

export default Faq;