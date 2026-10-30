import React from "react";
import "./BirthdayWhyChoose.css";

const CameraIcon = () => (
  <svg
    className="BirthdayWhyChooseIconSvg"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bwcCameraGold" x1="6" y1="12" x2="58" y2="54">
        <stop offset="0" stopColor="#E6C877" />
        <stop offset="1" stopColor="#A8703A" />
      </linearGradient>
    </defs>
    <path
      d="M10 20a4 4 0 0 1 4-4h6l3-5h18l3 5h6a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V20Z"
      fill="url(#bwcCameraGold)"
    />
    <circle cx="32" cy="34" r="13" fill="#1A1410" />
    <circle cx="32" cy="34" r="9" stroke="#E6C877" strokeWidth="2" />
    <circle cx="28.5" cy="30.5" r="2.5" fill="#FBF8F3" opacity="0.9" />
    <circle cx="49" cy="23" r="2" fill="#1A1410" />
  </svg>
);

const BadgeIcon = () => (
  <svg
    className="BirthdayWhyChooseIconSvg"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bwcBadgeGold" x1="8" y1="6" x2="56" y2="58">
        <stop offset="0" stopColor="#E6C877" />
        <stop offset="1" stopColor="#A8703A" />
      </linearGradient>
    </defs>
    <path
      d="M32 4l6.2 5.1 8-.9 3 7.4 7.4 3-.9 8L61 32l-5.1 6.2.9 8-7.4 3-3 7.4-8-.9L32 60l-6.2-5.1-8 .9-3-7.4-7.4-3 .9-8L3 32l5.1-6.2-.9-8 7.4-3 3-7.4 8 .9L32 4Z"
      fill="url(#bwcBadgeGold)"
    />
    <circle cx="32" cy="32" r="16" fill="#1A1410" />
    <path
      d="M24 32.5l6 6 11-12"
      stroke="#E6C877"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="BirthdayWhyChooseIconSvg"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bwcCalendarGold" x1="8" y1="8" x2="56" y2="58">
        <stop offset="0" stopColor="#E6C877" />
        <stop offset="1" stopColor="#A8703A" />
      </linearGradient>
    </defs>
    <rect x="8" y="12" width="48" height="44" rx="7" fill="url(#bwcCalendarGold)" />
    <rect x="8" y="12" width="48" height="13" rx="7" fill="#1A1410" />
    <rect x="8" y="19" width="48" height="6" fill="#1A1410" />
    <rect x="20" y="6" width="5" height="13" rx="2.5" fill="#E6C877" />
    <rect x="39" y="6" width="5" height="13" rx="2.5" fill="#E6C877" />
    <text
      x="32"
      y="48"
      textAnchor="middle"
      fontFamily="Playfair Display, Georgia, serif"
      fontWeight="700"
      fontSize="20"
      fill="#1A1410"
    >
      01
    </text>
  </svg>
);

const features = [
  {
    id: 1,
    icon: <CameraIcon />,
    title: "6200+ Shoots Experienced",
    text: "With experience from more than 6200 shoots, we understand your expectations and deliver more than you imagine, every single time.",
  },
  {
    id: 2,
    icon: <BadgeIcon />,
    title: "Best Price Every Time",
    text: "Instead of charging more, we prefer to serve more and more clients to keep our costs lower, making premium moments affordable for everyone.",
  },
  {
    id: 3,
    icon: <CalendarIcon />,
    title: "1 Year Free Storage",
    text: "We understand the importance of your memories. Your photos stay safe with us, with a minimum of 1 year of validity in our cloud gallery.",
  },
];

const BirthdayWhyChoose = () => {
  return (
    <section className="BirthdayWhyChoose" id="why-choose-us">
      <div className="BirthdayWhyChooseContainer">
        <div className="BirthdayWhyChooseHeader">
          <span className="BirthdayWhyChooseEyebrow">Rainbow Photography</span>
          <h2 className="BirthdayWhyChooseHeading">Why Choose Us?</h2>
          <span className="BirthdayWhyChooseDivider" />
          <p className="BirthdayWhyChooseSubheading">
            Premium birthday photography, honest pricing and memories that stay
            safe for years.
          </p>
        </div>

        <div className="BirthdayWhyChooseGrid">
          {features.map((item, index) => (
            <article
              className="BirthdayWhyChooseCard"
              key={item.id}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <span className="BirthdayWhyChooseNumber">
                {String(item.id).padStart(2, "0")}
              </span>
              <div className="BirthdayWhyChooseIcon">{item.icon}</div>
              <h3 className="BirthdayWhyChooseTitle">{item.title}</h3>
              <p className="BirthdayWhyChooseText">{item.text}</p>
              <span className="BirthdayWhyChooseLine" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BirthdayWhyChoose;