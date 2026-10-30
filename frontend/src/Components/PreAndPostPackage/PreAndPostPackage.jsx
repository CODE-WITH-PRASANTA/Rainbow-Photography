import React, { useEffect, useRef, useState } from 'react';
import './PreAndPostPackage.css';

/* Background image: src/assets/packagebg.webp
   Adjust the path if your component lives in a different folder. */
import packageBg from '../../assets/packagebg.webp';

const BRAND = 'Rainbow Photography';
const WHATSAPP_NUMBER = '91XXXXXXXXXX'; // <-- put your WhatsApp number here (country code + number, no + or spaces)
const CONTACT_LINK = '/contact'; // <-- your contact page route

const bookLink = (packageName) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi ${BRAND}, I would like to book the ${packageName}.`
  )}`;

/* ---------- Data ---------- */

const PREWEDDING_PRICES = [
  {
    id: 'p1',
    days: '1 Day',
    place: 'Inside Odisha',
    price: '₹30,000',
    note: '₹30,000 per day',
  },
  {
    id: 'p2',
    days: '1 Day',
    place: 'Outside Odisha',
    price: '₹50,000',
    note: '₹50,000 per day',
  },
  {
    id: 'p3',
    days: '2 Days',
    place: 'Inside Odisha',
    price: '₹50,000',
    note: 'Save ₹10,000',
    badge: 'Best Value',
  },
  {
    id: 'p4',
    days: '2 Days',
    place: 'Outside Odisha',
    price: '₹80,000',
    note: 'Save ₹20,000',
    badge: 'Best Value',
  },
];

const PREWEDDING_OUTPUTS = [
  '1 prewedding video of 3 to 4 minutes',
  '3 prewedding reels',
  'Edited prewedding softcopy',
];

const PREWEDDING_CHIPS = ['Cinematic Video', 'Reels', 'Couple Portraits', 'Your Dream Location'];

const POST_WEDDING = {
  name: 'Post Wedding Shoot',
  text: 'The wedding rush is over, now enjoy a relaxed session as newlyweds. Tell us your idea and location and we will plan a package around it.',
  price: 'On Request',
};

const HIGHLIGHTS = [
  {
    id: 'h1',
    title: '6200+ Shoots',
    text: 'Experience that understands every expectation.',
  },
  {
    id: 'h2',
    title: 'Best Price',
    text: 'Premium moments, affordable for everyone.',
  },
  {
    id: 'h3',
    title: '1 Year Storage',
    text: 'Your memories stay safe in our cloud gallery.',
  },
];

/* ---------- Helpers ---------- */

const OBSERVER_OPTIONS = { threshold: 0.15, rootMargin: '0px 0px -6% 0px' };

const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, OBSERVER_OPTIONS);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

const Reveal = ({ as: Tag = 'div', className = '', delay = 0, children }) => {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`PreAndPostPackage__reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SectionHead = ({ kicker, title, text }) => (
  <Reveal className="PreAndPostPackage__section-head">
    <span className="PreAndPostPackage__kicker">{kicker}</span>
    <h3 className="PreAndPostPackage__section-title">{title}</h3>
    {text && <p className="PreAndPostPackage__section-text">{text}</p>}
  </Reveal>
);

const CheckList = ({ items }) => (
  <ul className="PreAndPostPackage__list">
    {items.map((item) => (
      <li key={item} className="PreAndPostPackage__list-item">
        <span className="PreAndPostPackage__check">
          <CheckIcon />
        </span>
        <span className="PreAndPostPackage__list-text">{item}</span>
      </li>
    ))}
  </ul>
);

/* ---------- Main component ---------- */

const PreAndPostPackage = () => {
  return (
    <section
      className="PreAndPostPackage"
      style={{ '--package-bg': `url(${packageBg})` }}
      aria-labelledby="PreAndPostPackage-title"
    >
      <div className="PreAndPostPackage__background" aria-hidden="true" />

      <div className="PreAndPostPackage__container">
        {/* Header */}
        <header className="PreAndPostPackage__header">
          <span className="PreAndPostPackage__eyebrow">{BRAND}</span>
          <h2 className="PreAndPostPackage__title" id="PreAndPostPackage-title">
            Pre &amp; Post Wedding Shoot{' '}
            <span className="PreAndPostPackage__title-accent">Packages</span>
          </h2>
          <span className="PreAndPostPackage__divider" aria-hidden="true" />
          <p className="PreAndPostPackage__subtitle">
            Your love story does not start or end on the wedding day.{' '}
            {BRAND} creates cinematic pre-wedding films and relaxed post-wedding
            sessions that you will want to watch again and again.
          </p>
        </header>

        {/* Pre-wedding */}
        <SectionHead
          kicker="Pre-Wedding"
          title="Pre-Wedding Shoot"
          text="Pick the number of days and the location. Everything else is taken care of."
        />

        <Reveal className="PreAndPostPackage__pre">
          <div className="PreAndPostPackage__pre-prices">
            {PREWEDDING_PRICES.map((item) => (
              <div
                key={item.id}
                className={`PreAndPostPackage__tile ${item.badge ? 'is-best' : ''}`}
              >
                {item.badge && (
                  <span className="PreAndPostPackage__tile-badge">{item.badge}</span>
                )}
                <span className="PreAndPostPackage__tile-days">{item.days}</span>
                <span className="PreAndPostPackage__tile-place">{item.place}</span>
                <span className="PreAndPostPackage__tile-price">{item.price}</span>
                <span className="PreAndPostPackage__tile-note">{item.note}</span>
              </div>
            ))}
          </div>

          <div className="PreAndPostPackage__pre-info">
            <h4 className="PreAndPostPackage__block-title">What You Get</h4>
            <CheckList items={PREWEDDING_OUTPUTS} />

            <ul className="PreAndPostPackage__chips">
              {PREWEDDING_CHIPS.map((chip) => (
                <li key={chip} className="PreAndPostPackage__chip">
                  {chip}
                </li>
              ))}
            </ul>

            <a
              className="PreAndPostPackage__button PreAndPostPackage__button--solid"
              href={bookLink('Pre-Wedding Shoot')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Now
            </a>
          </div>
        </Reveal>

        {/* Post-wedding */}
        <SectionHead
          kicker="Post-Wedding"
          title="Post Wedding Shoot"
          text="A calm, beautiful session after the celebrations are over."
        />

        <Reveal className="PreAndPostPackage__post">
          <div className="PreAndPostPackage__post-body">
            <h4 className="PreAndPostPackage__post-title">{POST_WEDDING.name}</h4>
            <p className="PreAndPostPackage__post-text">{POST_WEDDING.text}</p>
          </div>
          <div className="PreAndPostPackage__post-side">
            <span className="PreAndPostPackage__post-price">{POST_WEDDING.price}</span>
            <a
              className="PreAndPostPackage__button PreAndPostPackage__button--outline"
              href={bookLink(POST_WEDDING.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire Now
            </a>
          </div>
        </Reveal>

        {/* About */}
        <SectionHead
          kicker="About Us"
          title={`Why Couples Choose ${BRAND}`}
          text={`${BRAND} is a professional photography and cinematic film studio. With more than 6200 shoots behind us, we know how to turn real emotions into frames you will treasure. We keep our prices fair so premium memories are affordable for everyone, and your photos stay safe in our cloud gallery for at least a year.`}
        />

        <ul className="PreAndPostPackage__highlights">
          {HIGHLIGHTS.map((item, index) => (
            <Reveal
              as="li"
              key={item.id}
              className="PreAndPostPackage__highlight"
              delay={index * 120}
            >
              <span className="PreAndPostPackage__highlight-title">{item.title}</span>
              <span className="PreAndPostPackage__highlight-text">{item.text}</span>
            </Reveal>
          ))}
        </ul>

        {/* Customize */}
        <Reveal className="PreAndPostPackage__custom">
          <h3 className="PreAndPostPackage__custom-title">Customize Your Package</h3>
          <p className="PreAndPostPackage__custom-text">
            As we are in a creative field, we don&rsquo;t limit our creativity. Let us
            know if you have any specific requirement, and we will work accordingly
            to serve you.
          </p>
          <a
            className="PreAndPostPackage__button PreAndPostPackage__button--outline"
            href={CONTACT_LINK}
          >
            Contact Us
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default PreAndPostPackage;