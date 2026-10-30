import React, { useEffect, useRef, useState } from 'react';
import './BirthdayPackage.css';

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

const PACKAGE = {
  name: 'Birthday Shoot',
  tagline: 'Every smile, every candle and every surprise, framed beautifully.',
  price: '\u20B920,000',
  priceNote: 'Complete birthday coverage',
  events: [
    'Cake Cutting',
    'Decoration & Theme',
    'Family Portraits',
    'Friends & Guests',
    'Candid Moments',
  ],
  outputs: [
    'Cinematic birthday highlight video',
    'Birthday reels for Instagram',
    'Edited softcopy photos (limited)',
    'Private cloud gallery with 1 year free storage',
  ],
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
      className={`BirthdayPackage__reveal ${inView ? 'is-visible' : ''} ${className}`}
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

const CheckList = ({ items }) => (
  <ul className="BirthdayPackage__list">
    {items.map((item) => (
      <li key={item} className="BirthdayPackage__list-item">
        <span className="BirthdayPackage__check">
          <CheckIcon />
        </span>
        <span className="BirthdayPackage__list-text">{item}</span>
      </li>
    ))}
  </ul>
);

/* ---------- Main component ---------- */

const BirthdayPackage = () => {
  return (
    <section
      className="BirthdayPackage"
      style={{ '--package-bg': `url(${packageBg})` }}
      aria-labelledby="BirthdayPackage-title"
    >
      <div className="BirthdayPackage__background" aria-hidden="true" />

      <div className="BirthdayPackage__container">
        {/* Header */}
        <header className="BirthdayPackage__header">
          <span className="BirthdayPackage__eyebrow">{BRAND}</span>
          <h2 className="BirthdayPackage__title" id="BirthdayPackage-title">
            Birthday Photography{' '}
            <span className="BirthdayPackage__title-accent">Package</span>
          </h2>
          <span className="BirthdayPackage__divider" aria-hidden="true" />
          <p className="BirthdayPackage__subtitle">
            From little ones to grown-ups, we turn birthday celebrations into
            memories worth replaying for years.
          </p>
        </header>

        {/* Package card */}
        <Reveal className="BirthdayPackage__wrap">
          <article className="BirthdayPackage__card">
            <span className="BirthdayPackage__badge">Best Seller</span>

            <div className="BirthdayPackage__card-left">
              <h3 className="BirthdayPackage__card-title">{PACKAGE.name}</h3>
              <p className="BirthdayPackage__card-tagline">{PACKAGE.tagline}</p>

              <div className="BirthdayPackage__price">
                <span className="BirthdayPackage__price-amount">{PACKAGE.price}</span>
                <span className="BirthdayPackage__price-note">{PACKAGE.priceNote}</span>
              </div>

              <div className="BirthdayPackage__block">
                <h4 className="BirthdayPackage__block-title">Moments Covered</h4>
                <ul className="BirthdayPackage__chips">
                  {PACKAGE.events.map((event) => (
                    <li key={event} className="BirthdayPackage__chip">
                      {event}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="BirthdayPackage__card-right">
              <div className="BirthdayPackage__block BirthdayPackage__block--grow">
                <h4 className="BirthdayPackage__block-title">What You Get</h4>
                <CheckList items={PACKAGE.outputs} />
              </div>

              <a
                className="BirthdayPackage__button BirthdayPackage__button--solid"
                href={bookLink(PACKAGE.name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Now
              </a>
            </div>
          </article>
        </Reveal>

        {/* Highlights */}
        <ul className="BirthdayPackage__highlights">
          {HIGHLIGHTS.map((item, index) => (
            <Reveal
              as="li"
              key={item.id}
              className="BirthdayPackage__highlight"
              delay={index * 120}
            >
              <span className="BirthdayPackage__highlight-title">{item.title}</span>
              <span className="BirthdayPackage__highlight-text">{item.text}</span>
            </Reveal>
          ))}
        </ul>

        {/* Customize */}
        <Reveal className="BirthdayPackage__custom">
          <h3 className="BirthdayPackage__custom-title">Customize Your Package</h3>
          <p className="BirthdayPackage__custom-text">
            As we are in a creative field, we don&rsquo;t limit our creativity. Let us
            know if you have any specific requirement, and we will work accordingly
            to serve you.
          </p>
          <a
            className="BirthdayPackage__button BirthdayPackage__button--outline"
            href={CONTACT_LINK}
          >
            Contact Us
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default BirthdayPackage;