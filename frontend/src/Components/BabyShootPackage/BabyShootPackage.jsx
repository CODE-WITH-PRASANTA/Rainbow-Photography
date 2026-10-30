import React, { useEffect, useRef, useState } from 'react';
import './BabyShootPackage.css';

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

/* ---------- Icons ---------- */

const iconProps = {
  viewBox: '0 0 24 24',
  width: 26,
  height: 26,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

const HeartIcon = () => (
  <svg {...iconProps}>
    <path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9Z" />
  </svg>
);

const ShieldIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
    <path d="M9 12l2.2 2.2L15.5 10" />
  </svg>
);

const SparkleIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3l2.2 6.3L21 12l-6.8 2.7L12 21l-2.2-6.3L3 12l6.8-2.7L12 3Z" />
  </svg>
);

const FamilyIcon = () => (
  <svg {...iconProps}>
    <circle cx="8" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M2.5 20c0-3.2 2.4-5.5 5.5-5.5s5.5 2.3 5.5 5.5" />
    <path d="M14.5 15.2c3-.6 7 .8 7 4.8" />
  </svg>
);

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

/* ---------- Data ---------- */

const PACKAGE = {
  name: 'Baby Shoot',
  tagline:
    'The first days are fleeting. Keep every tiny finger, yawn and cuddle forever.',
  price: '\u20B910,000',
  priceNote: 'Newborn & baby coverage',
  moments: [
    'Newborn Portraits',
    'Parents with Baby',
    'Siblings & Family',
    'Tiny Details',
    'Candid Moments',
  ],
  outputs: [
    'Edited softcopy photos (limited)',
    'Baby reel for Instagram',
    'Soft, natural looking colour edits',
    'Private cloud gallery with 1 year free storage',
  ],
};

const CARE = [
  {
    id: 'c1',
    icon: <ShieldIcon />,
    title: 'Safe & Gentle',
    text: 'Your baby\u2019s comfort and safety always come before any photo.',
  },
  {
    id: 'c2',
    icon: <HeartIcon />,
    title: 'Patient Sessions',
    text: 'We pause for feeding, sleeping and cuddles. No rushing, ever.',
  },
  {
    id: 'c3',
    icon: <SparkleIcon />,
    title: 'Soft Themes & Props',
    text: 'Calm colours and dreamy setups that suit your little one.',
  },
  {
    id: 'c4',
    icon: <FamilyIcon />,
    title: 'Whole Family Included',
    text: 'Parents, grandparents and siblings can join the frames.',
  },
];

const STEPS = [
  {
    id: 'st1',
    title: 'Message Us',
    text: 'Tell us the baby\u2019s due or birth date and we will plan a comfortable time.',
  },
  {
    id: 'st2',
    title: 'Relaxed Shoot',
    text: 'We shoot at your pace, at home or at your chosen location.',
  },
  {
    id: 'st3',
    title: 'Receive Memories',
    text: 'Get your edited photos and reel in your private cloud gallery.',
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
      className={`BabyShootPackage__reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

const SectionHead = ({ kicker, title, text }) => (
  <Reveal className="BabyShootPackage__section-head">
    <span className="BabyShootPackage__kicker">{kicker}</span>
    <h3 className="BabyShootPackage__section-title">{title}</h3>
    {text && <p className="BabyShootPackage__section-text">{text}</p>}
  </Reveal>
);

const CheckList = ({ items }) => (
  <ul className="BabyShootPackage__list">
    {items.map((item) => (
      <li key={item} className="BabyShootPackage__list-item">
        <span className="BabyShootPackage__check">
          <CheckIcon />
        </span>
        <span className="BabyShootPackage__list-text">{item}</span>
      </li>
    ))}
  </ul>
);

/* ---------- Main component ---------- */

const BabyShootPackage = () => {
  return (
    <section
      className="BabyShootPackage"
      style={{ '--package-bg': `url(${packageBg})` }}
      aria-labelledby="BabyShootPackage-title"
    >
      <div className="BabyShootPackage__background" aria-hidden="true" />

      <div className="BabyShootPackage__container">
        {/* Header */}
        <header className="BabyShootPackage__header">
          <span className="BabyShootPackage__eyebrow">{BRAND}</span>
          <h2 className="BabyShootPackage__title" id="BabyShootPackage-title">
            Newborn Baby Photography{' '}
            <span className="BabyShootPackage__title-accent">Package</span>
          </h2>
          <span className="BabyShootPackage__divider" aria-hidden="true" />
          <p className="BabyShootPackage__subtitle">
            A new baby changes everything, and it all happens so fast.{' '}
            {BRAND} captures those first precious days with warmth, patience and
            a gentle touch, so you can relive them for a lifetime.
          </p>
        </header>

        {/* Package card */}
        <Reveal className="BabyShootPackage__wrap">
          <article className="BabyShootPackage__card">
            <span className="BabyShootPackage__badge">Newborn Special</span>

            <div className="BabyShootPackage__card-left">
              <h3 className="BabyShootPackage__card-title">{PACKAGE.name}</h3>
              <p className="BabyShootPackage__card-tagline">{PACKAGE.tagline}</p>

              <div className="BabyShootPackage__price">
                <span className="BabyShootPackage__price-amount">{PACKAGE.price}</span>
                <span className="BabyShootPackage__price-note">{PACKAGE.priceNote}</span>
              </div>

              <div className="BabyShootPackage__block">
                <h4 className="BabyShootPackage__block-title">Moments Covered</h4>
                <ul className="BabyShootPackage__chips">
                  {PACKAGE.moments.map((moment) => (
                    <li key={moment} className="BabyShootPackage__chip">
                      {moment}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="BabyShootPackage__card-right">
              <div className="BabyShootPackage__block BabyShootPackage__block--grow">
                <h4 className="BabyShootPackage__block-title">What You Get</h4>
                <CheckList items={PACKAGE.outputs} />
              </div>

              <a
                className="BabyShootPackage__button BabyShootPackage__button--solid"
                href={bookLink(PACKAGE.name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Now
              </a>
            </div>
          </article>
        </Reveal>

        {/* Care promise */}
        <SectionHead
          kicker="Our Promise"
          title="Made for Newborns & Parents"
          text={`Why families trust ${BRAND} with their little one\u2019s first memories.`}
        />

        <ul className="BabyShootPackage__care">
          {CARE.map((item, index) => (
            <Reveal
              as="li"
              key={item.id}
              className="BabyShootPackage__care-item"
              delay={index * 110}
            >
              <span className="BabyShootPackage__care-icon">{item.icon}</span>
              <span className="BabyShootPackage__care-title">{item.title}</span>
              <span className="BabyShootPackage__care-text">{item.text}</span>
            </Reveal>
          ))}
        </ul>

        {/* Steps */}
        <SectionHead
          kicker="How It Works"
          title="Simple & Stress Free"
          text="Three easy steps while you focus on your new baby."
        />

        <ol className="BabyShootPackage__steps">
          {STEPS.map((step, index) => (
            <Reveal
              as="li"
              key={step.id}
              className="BabyShootPackage__step"
              delay={index * 120}
            >
              <span className="BabyShootPackage__step-number">{index + 1}</span>
              <span className="BabyShootPackage__step-title">{step.title}</span>
              <span className="BabyShootPackage__step-text">{step.text}</span>
            </Reveal>
          ))}
        </ol>

        {/* Customize */}
        <Reveal className="BabyShootPackage__custom">
          <h3 className="BabyShootPackage__custom-title">Customize Your Package</h3>
          <p className="BabyShootPackage__custom-text">
            As we are in a creative field, we don&rsquo;t limit our creativity. Let us
            know if you have any specific requirement, and we will work accordingly
            to serve you.
          </p>
          <a
            className="BabyShootPackage__button BabyShootPackage__button--outline"
            href={CONTACT_LINK}
          >
            Contact Us
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default BabyShootPackage;