import React from "react";
import "./PricingMain.css";

const pricingPlans = [
  {
    id: "luxe",
    name: "LUXE",
    price: "INR 5,00,000/-",
    icon: "diamond",
    features: [
      "Photography & Cinematic Video in 4K",
      "AI based face recognition (family & friends can upload a selfie & get their pictures instantly)",
      "Videos will be delivered in 4K Resolution",
      "Song written & composed to suit your video (in collaboration with Adarsh Rao & other prominent Musicians)",
      "Pre Wedding Shoot at Aesthetics Affair",
      "Everything from Signature Package",
    ],
  },
  {
    id: "signature",
    name: "SIGNATURE",
    price: "INR 3,80,000/-",
    icon: "crown",
    popular: true,
    features: [
      "Photography & Cinematic Video",
      "2 days coverage for bride",
      "2 days coverage for groom",
      "All raw pictures",
      "500 edited pictures",
      "2 Premium Canva Photobooks",
      "All raw videos",
      "Teaser 60–90 secs",
      "Trailer 3–4 mins",
      "2 Cinematic Film 40 mins",
      "Delivery timeline – 10–12 days for raw pictures",
      "6–8 weeks for album, 4–5 months for videos",
    ],
  },
  {
    id: "intimate",
    name: "INTIMATE",
    price: "INR 2,80,000/-",
    icon: "heart",
    features: [
      "Photography & Standard Video",
      "2 days coverage for bride",
      "2 days coverage for groom",
      "All raw pictures",
      "500 edited pictures",
      "2 Premium Canva Photobooks",
      "All raw videos",
      "Highlight video 3–4 mins",
      "2 Full videos 45–60 mins",
      "Delivery timeline – 10–12 days for raw pictures",
      "6–8 weeks for album, 2–3 months for videos",
    ],
  },
];

const PricingMainIcon = ({ type }) => {
  const paths = {
    diamond: (
      <>
        <path
          d="M9 13L14 7H26L31 13L20 31L9 13Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9 13H31M14 7L17 13L20 31L23 13L26 7"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </>
    ),
    crown: (
      <>
        <path
          d="M7 13L14 20L20 8L26 20L33 13L29 29H11L7 13Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M11 33H29M11 29H29"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    ),
    heart: (
      <path
        d="M20 32S5 23 5 13C5 5 15 4 20 12C25 4 35 5 35 13C35 23 20 32 20 32Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  };

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
};

const PricingMain = () => {
  return (
    <section className="PricingMain">
      <div className="PricingMain__background" aria-hidden="true" />

      <div className="PricingMain__ambient PricingMain__ambient--left" />
      <div className="PricingMain__ambient PricingMain__ambient--right" />

      <div className="PricingMain__botanical PricingMain__botanical--left" aria-hidden="true">
        <svg viewBox="0 0 180 300" fill="none">
          <path d="M20 290Q75 160 145 15" stroke="#A8793F" strokeWidth="1.5" />
          <path d="M42 237Q4 225 8 190Q39 195 42 237Z" fill="#B5A078" fillOpacity=".65" stroke="#A8793F" />
          <path d="M42 237L8 190" stroke="#A8793F" />
          <path d="M65 190Q110 183 123 144Q82 150 65 190Z" fill="#D6B982" fillOpacity=".8" stroke="#A8793F" />
          <path d="M65 190L123 144" stroke="#A8793F" />
          <path d="M84 143Q45 132 47 96Q77 103 84 143Z" fill="#A4A38A" fillOpacity=".7" stroke="#A8793F" />
          <path d="M84 143L47 96" stroke="#A8793F" />
          <path d="M108 99Q145 94 155 58Q120 65 108 99Z" fill="#D6B982" fillOpacity=".8" stroke="#A8793F" />
          <path d="M108 99L155 58" stroke="#A8793F" />
          <path d="M130 58Q99 47 103 20Q126 29 130 58Z" fill="#A4A38A" fillOpacity=".75" stroke="#A8793F" />
        </svg>
      </div>

      <div className="PricingMain__botanical PricingMain__botanical--right" aria-hidden="true">
        <svg viewBox="0 0 180 300" fill="none">
          <path d="M20 290Q75 160 145 15" stroke="#A8793F" strokeWidth="1.5" />
          <path d="M42 237Q4 225 8 190Q39 195 42 237Z" fill="#B5A078" fillOpacity=".65" stroke="#A8793F" />
          <path d="M65 190Q110 183 123 144Q82 150 65 190Z" fill="#D6B982" fillOpacity=".8" stroke="#A8793F" />
          <path d="M84 143Q45 132 47 96Q77 103 84 143Z" fill="#A4A38A" fillOpacity=".7" stroke="#A8793F" />
          <path d="M108 99Q145 94 155 58Q120 65 108 99Z" fill="#D6B982" fillOpacity=".8" stroke="#A8793F" />
          <path d="M130 58Q99 47 103 20Q126 29 130 58Z" fill="#A4A38A" fillOpacity=".75" stroke="#A8793F" />
        </svg>
      </div>

      <header className="PricingMain__header">
        <p className="PricingMain__eyebrow">OUR PACKAGES</p>

        <div className="PricingMain__heading-ornament">
          <span />
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 20S3 14 3 8C3 3 9 3 12 8C15 3 21 3 21 8C21 14 12 20 12 20Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <span />
        </div>

        <h2 className="PricingMain__title">
          Choose Your Perfect{" "}
          <span>Wedding Story</span>
        </h2>

        <p className="PricingMain__subtitle">
          Tailored packages to capture your special moments with
          creativity, care, and perfection.
        </p>
      </header>

      <div className="PricingMain__grid">
        {pricingPlans.map((plan, index) => (
          <article
            key={plan.id}
            className={`PricingMain__card PricingMain__card--${plan.id}`}
            style={{ "--PricingMain-card-index": index }}
          >
            {plan.popular && (
              <div className="PricingMain__ribbon">
                <span>POPULAR</span>
              </div>
            )}

            <div className="PricingMain__icon">
              <PricingMainIcon type={plan.icon} />
            </div>

            <p className="PricingMain__plan-name">{plan.name}</p>
            <h3 className="PricingMain__price">{plan.price}</h3>

            <ul className="PricingMain__features">
              {plan.features.map((feature, featureIndex) => (
                <li
                  key={`${plan.id}-${featureIndex}`}
                  className="PricingMain__feature"
                >
                  <span className="PricingMain__check" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 8L6.7 10.5L12 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href={`/contact?package=${plan.id}`}
              className={`PricingMain__button PricingMain__button--${plan.id}`}
              aria-label={`Book the ${plan.name} wedding photography package`}
            >
              <span>BOOK NOW</span>
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
          </article>
        ))}
      </div>

      <p className="PricingMain__footer-note">
        YOUR LOVE STORY, BEAUTIFULLY PRESERVED
      </p>
    </section>
  );
};

export default PricingMain;