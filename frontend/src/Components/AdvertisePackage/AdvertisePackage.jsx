import React, { useEffect, useRef, useState } from 'react';
import './AdvertisePackage.css';

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

const CameraIcon = () => (
  <svg {...iconProps}>
    <path d="M3 8a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
    <circle cx="12" cy="13" r="3.6" />
  </svg>
);

const TargetIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" />
  </svg>
);

const TrendIcon = () => (
  <svg {...iconProps}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
);

const PaletteIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3a9 9 0 1 0 0 18c1.3 0 2-.9 2-1.9 0-1.5-1.2-1.6-1.2-2.8 0-.9.7-1.5 1.6-1.5H17a4 4 0 0 0 4-4C21 6.7 17 3 12 3Z" />
    <circle cx="7.5" cy="11" r="1" />
    <circle cx="10" cy="7.5" r="1" />
    <circle cx="14.5" cy="7.5" r="1" />
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
  name: 'Advertise Shoot',
  tagline:
    'Scroll-stopping visuals that show your product or business at its very best.',
  price: '\u20B910,000',
  priceNote: 'Product & brand advertising',
  moments: [
    'Product Shoot',
    'Brand Promo',
    'Social Media Content',
    'Business Showcase',
    'Behind the Scenes',
  ],
  outputs: [
    'Edited softcopy photos (limited)',
    'Promo reel for Instagram and social media ads',
    'Clean, brand-matching colour edits',
    'Private cloud gallery with 1 year free storage',
  ],
};

const BENEFITS = [
  {
    id: 'b1',
    icon: <TargetIcon />,
    title: 'Made to Sell',
    text: 'Every frame is planned to highlight what makes your offer special.',
  },
  {
    id: 'b2',
    icon: <PaletteIcon />,
    title: 'On-Brand Look',
    text: 'Colours, mood and styling that match your brand identity.',
  },
  {
    id: 'b3',
    icon: <TrendIcon />,
    title: 'Ready for Social',
    text: 'Photos and reels sized for Instagram, Facebook and ad campaigns.',
  },
  {
    id: 'b4',
    icon: <CameraIcon />,
    title: 'Creative Direction',
    text: 'We suggest angles, setups and ideas so you never feel lost.',
  },
];

const STEPS = [
  {
    id: 'st1',
    title: 'Share Your Idea',
    text: 'Tell us about your product, business and the look you want.',
  },
  {
    id: 'st2',
    title: 'Creative Shoot',
    text: 'We plan and shoot at your location or a setup that suits your brand.',
  },
  {
    id: 'st3',
    title: 'Launch Your Content',
    text: 'Receive edited photos and reels in your private cloud gallery.',
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
      className={`AdvertisePackage__reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

const SectionHead = ({ kicker, title, text }) => (
  <Reveal className="AdvertisePackage__section-head">
    <span className="AdvertisePackage__kicker">{kicker}</span>
    <h3 className="AdvertisePackage__section-title">{title}</h3>
    {text && <p className="AdvertisePackage__section-text">{text}</p>}
  </Reveal>
);

const CheckList = ({ items }) => (
  <ul className="AdvertisePackage__list">
    {items.map((item) => (
      <li key={item} className="AdvertisePackage__list-item">
        <span className="AdvertisePackage__check">
          <CheckIcon />
        </span>
        <span className="AdvertisePackage__list-text">{item}</span>
      </li>
    ))}
  </ul>
);

/* ---------- Main component ---------- */

const AdvertisePackage = () => {
  return (
    <section
      className="AdvertisePackage"
      style={{ '--package-bg': `url(${packageBg})` }}
      aria-labelledby="AdvertisePackage-title"
    >
      <div className="AdvertisePackage__background" aria-hidden="true" />

      <div className="AdvertisePackage__container">
        {/* Header */}
        <header className="AdvertisePackage__header">
          <span className="AdvertisePackage__eyebrow">{BRAND}</span>
          <h2 className="AdvertisePackage__title" id="AdvertisePackage-title">
            Advertisement Photography{' '}
            <span className="AdvertisePackage__title-accent">Package</span>
          </h2>
          <span className="AdvertisePackage__divider" aria-hidden="true" />
          <p className="AdvertisePackage__subtitle">
            Great products deserve great visuals. {BRAND} creates polished,
            eye-catching photos and reels that help your brand stand out and
            win more customers.
          </p>
        </header>

        {/* Package card */}
        <Reveal className="AdvertisePackage__wrap">
          <article className="AdvertisePackage__card">
            <span className="AdvertisePackage__badge">Brand Booster</span>

            <div className="AdvertisePackage__card-left">
              <h3 className="AdvertisePackage__card-title">{PACKAGE.name}</h3>
              <p className="AdvertisePackage__card-tagline">{PACKAGE.tagline}</p>

              <div className="AdvertisePackage__price">
                <span className="AdvertisePackage__price-amount">{PACKAGE.price}</span>
                <span className="AdvertisePackage__price-note">{PACKAGE.priceNote}</span>
              </div>

              <div className="AdvertisePackage__block">
                <h4 className="AdvertisePackage__block-title">Shoot Covers</h4>
                <ul className="AdvertisePackage__chips">
                  {PACKAGE.moments.map((moment) => (
                    <li key={moment} className="AdvertisePackage__chip">
                      {moment}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="AdvertisePackage__card-right">
              <div className="AdvertisePackage__block AdvertisePackage__block--grow">
                <h4 className="AdvertisePackage__block-title">What You Get</h4>
                <CheckList items={PACKAGE.outputs} />
              </div>

              <a
                className="AdvertisePackage__button AdvertisePackage__button--solid"
                href={bookLink(PACKAGE.name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Now
              </a>
            </div>
          </article>
        </Reveal>

        {/* Benefits */}
        <SectionHead
          kicker="Why It Works"
          title="Visuals That Grow Your Brand"
          text={`What brands get when they shoot with ${BRAND}.`}
        />

        <ul className="AdvertisePackage__care">
          {BENEFITS.map((item, index) => (
            <Reveal
              as="li"
              key={item.id}
              className="AdvertisePackage__care-item"
              delay={index * 110}
            >
              <span className="AdvertisePackage__care-icon">{item.icon}</span>
              <span className="AdvertisePackage__care-title">{item.title}</span>
              <span className="AdvertisePackage__care-text">{item.text}</span>
            </Reveal>
          ))}
        </ul>

        {/* Steps */}
        <SectionHead
          kicker="How It Works"
          title="Simple & Hassle Free"
          text="Three easy steps from idea to ready-to-post content."
        />

        <ol className="AdvertisePackage__steps">
          {STEPS.map((step, index) => (
            <Reveal
              as="li"
              key={step.id}
              className="AdvertisePackage__step"
              delay={index * 120}
            >
              <span className="AdvertisePackage__step-number">{index + 1}</span>
              <span className="AdvertisePackage__step-title">{step.title}</span>
              <span className="AdvertisePackage__step-text">{step.text}</span>
            </Reveal>
          ))}
        </ol>

        {/* Customize */}
        <Reveal className="AdvertisePackage__custom">
          <h3 className="AdvertisePackage__custom-title">Customize Your Package</h3>
          <p className="AdvertisePackage__custom-text">
            As we are in a creative field, we don&rsquo;t limit our creativity. Let us
            know if you have any specific requirement, and we will work accordingly
            to serve you.
          </p>
          <a
            className="AdvertisePackage__button AdvertisePackage__button--outline"
            href={CONTACT_LINK}
          >
            Contact Us
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default AdvertisePackage;