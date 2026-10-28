import React from "react";
import "./WhyyouChose.css";

const features = [
  {
    id: 1,
    icon: "camera",
    title: "6200+ Shoot Experienced",
    description:
      "With experience of more than 6200 shoots, we understand your expectations. Every time, we deliver more than you expect.",
  },
  {
    id: 2,
    icon: "quality",
    title: "Best Price Every Time",
    description:
      "Instead of charging more, we prefer to serve more and more clients to keep our costs lower — making premium moments affordable for everyone.",
  },
  {
    id: 3,
    icon: "calendar",
    title: "1 Year Free Storage",
    description:
      "We understand the importance of your memories. Your photos are safe with us, with a minimum of one year of validity in our cloud gallery.",
  },
];

const CameraIcon = () => (
  <svg
    viewBox="0 0 150 120"
    className="why-icon why-camera"
    aria-hidden="true"
  >
    <path
      d="M20 35 H43 L49 18 H100 L106 35 H130
         Q140 35 140 45 V100 Q140 110 130 110 H20
         Q10 110 10 100 V45 Q10 35 20 35Z"
      fill="#20B993"
    />

    <path d="M24 26 H45 V35 H22Z" fill="#20B993" />

    <circle cx="75" cy="67" r="33" fill="#D8E3E9" />
    <circle cx="75" cy="67" r="25" fill="#5968C7" />
    <circle cx="66" cy="56" r="7" fill="#FFFFFF" />
  </svg>
);

const QualityIcon = () => (
  <svg
    viewBox="0 0 130 130"
    className="why-icon why-quality"
    aria-hidden="true"
  >
    <path
      d="M65 5 L80 14 L99 13 L108 30 L120 43
         L115 62 L120 80 L107 94 L99 111
         L80 110 L65 122 L49 110 L30 111
         L22 94 L9 80 L14 62 L9 43
         L22 30 L30 13 L49 14 Z"
      fill="#637AFF"
    />

    <circle
      cx="65"
      cy="63"
      r="43"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="4"
    />

    <path
      d="M43 62 L59 76 L84 48"
      fill="none"
      stroke="#FFD36A"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    viewBox="0 0 150 150"
    className="why-icon why-calendar"
    aria-hidden="true"
  >
    <rect
      x="13"
      y="24"
      width="124"
      height="113"
      rx="29"
      fill="#29C5E9"
      stroke="#426B78"
      strokeWidth="5"
    />

    <path
      d="M17 55 H133 V75 H17Z"
      fill="#FFD84A"
    />

    <path
      d="M17 55 V49 Q17 25 42 25 H108 Q133 25 133 49 V55Z"
      fill="#FFD84A"
      stroke="#426B78"
      strokeWidth="5"
    />

    <rect
      x="44"
      y="5"
      width="14"
      height="34"
      rx="7"
      fill="#29C5E9"
      stroke="#426B78"
      strokeWidth="5"
    />

    <rect
      x="102"
      y="5"
      width="14"
      height="34"
      rx="7"
      fill="#29C5E9"
      stroke="#426B78"
      strokeWidth="5"
    />

    <text
      x="75"
      y="111"
      textAnchor="middle"
      fill="#FFFFFF"
      fontFamily="Georgia, serif"
      fontSize="54"
      fontWeight="bold"
    >
      01
    </text>
  </svg>
);

const icons = {
  camera: CameraIcon,
  quality: QualityIcon,
  calendar: CalendarIcon,
};

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us">
      <div className="why-container">
        <h2 className="why-heading">Why Choose Us ?</h2>

        <div className="why-features">
          {features.map((feature) => {
            const Icon = icons[feature.icon];

            return (
              <article className="why-feature" key={feature.id}>
                <div className="why-icon-wrapper">
                  <Icon />
                </div>

                <h3 className="why-feature-title">
                  {feature.title}
                </h3>

                <p className="why-feature-description">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;