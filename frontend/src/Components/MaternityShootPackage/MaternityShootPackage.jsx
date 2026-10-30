import React, { useEffect, useRef, useState } from 'react';
import './MaternityShootPackage.css';

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

const STATS = [
  { id: 'since', value: 2016, prefix: 'Since ', label: 'Years of Passion', animate: false },
  { id: 'experience', value: 10, suffix: '+', label: 'Years Experience', animate: true },
  { id: 'customers', value: 200, suffix: '+', label: 'Happy Wedding Customers', animate: true },
];

const WEDDING_PACKAGES = [
  {
    id: 'bride',
    name: 'Cinematic Work: Bride Side',
    tagline: 'Every ritual of the bride\u2019s family, told as a film.',
    price: '\u20B91,00,000',
    priceNote: '1 Lakh',
    events: ['Engagement', 'Mehendi', 'Haldi', 'Marriage'],
    outputs: [
      'Wedding invitation video',
      'Save the date photo',
      'All rituals reels',
      'All rituals edited softcopy (limited)',
      'Cinematic full video',
      "14'*40' size, 40-45 pages mixed paper album",
    ],
  },
  {
    id: 'both',
    name: 'Both Side Cinematic Shoot',
    tagline: 'The complete wedding story, from both families.',
    price: '\u20B91,80,000',
    priceNote: '1.8 Lakh \u2022 Save \u20B920,000',
    badge: 'Most Popular',
    featured: true,
    events: ['Engagement', 'Mehendi', 'Haldi', 'Marriage', 'Reception'],
    outputs: [
      'Invitation video for both sides',
      'Save the date photo',
      'Cinematic full video',
      'All rituals reels',
      'All rituals edited softcopy (limited)',
      'Wedding countdown photo, 7 days before',
      '2 albums of 40-45 pages each, mixed paper',
      'All raw photos and videos after full payment',
    ],
  },
  {
    id: 'groom',
    name: 'Cinematic Work: Groom Side',
    tagline: 'Every moment of the groom\u2019s celebration, beautifully framed.',
    price: '\u20B91,00,000',
    priceNote: '1 Lakh',
    events: ['Engagement', 'Haldi', 'Marriage', 'Reception'],
    outputs: [
      'Wedding invitation video',
      'Save the date photo',
      'All rituals reels',
      'All rituals edited softcopy (limited)',
      'Cinematic full video',
      "14'*40' size, 40-45 pages mixed paper album",
    ],
  },
];

const PREWEDDING_PRICES = [
  { id: 'p1', days: '1 Day', place: 'Inside Odisha', price: '\u20B930,000' },
  { id: 'p2', days: '1 Day', place: 'Outside Odisha', price: '\u20B950,000' },
  { id: 'p3', days: '2 Days', place: 'Inside Odisha', price: '\u20B950,000' },
  { id: 'p4', days: '2 Days', place: 'Outside Odisha', price: '\u20B980,000' },
];

const PREWEDDING_OUTPUTS = [
  '1 prewedding video of 3 to 4 minutes',
  '3 prewedding reels',
  'Edited prewedding softcopy',
];

const SERVICES = [
  { id: 's1', name: 'Birthday Shoot', price: '\u20B920,000' },
  { id: 's2', name: 'Portfolio Shoot', price: '\u20B910,000' },
  { id: 's3', name: 'Advertise Shoot', price: '\u20B910,000' },
  { id: 's4', name: 'Rice Feeding Shoot', price: '\u20B920,000' },
  { id: 's5', name: 'Maternity Shoot', price: '\u20B910,000' },
  { id: 's6', name: 'Baby Shoot', price: '\u20B910,000' },
  { id: 's7', name: 'Party Shoot', note: 'Cocktail, mocktail & more', price: null },
  { id: 's8', name: 'Prewedding Shoot', price: null },
  { id: 's9', name: 'Engagement Shoot', price: null },
  { id: 's10', name: 'Mehendi Shoot', price: null },
  { id: 's11', name: 'Haldi Shoot', price: null },
  { id: 's12', name: 'Marriage Shoot', price: null },
  { id: 's13', name: 'Reception Shoot', price: null },
  { id: 's14', name: 'Post Wedding Shoot', price: null },
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
      className={`MaternityShootPackage__reveal ${
        inView ? 'is-visible' : ''
      } ${className}`}
      style={{ '--delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

const CountUp = ({ end, start, duration = 1600 }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(end);
      return undefined;
    }
    let frame;
    const t0 = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - t0) / duration, 1);
      setValue(Math.round(end * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, end, duration]);

  return <>{value}</>;
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
  <Reveal className="MaternityShootPackage__section-head">
    <span className="MaternityShootPackage__kicker">{kicker}</span>
    <h3 className="MaternityShootPackage__section-title">{title}</h3>
    {text && <p className="MaternityShootPackage__section-text">{text}</p>}
  </Reveal>
);

const CheckList = ({ items }) => (
  <ul className="MaternityShootPackage__list">
    {items.map((item) => (
      <li key={item} className="MaternityShootPackage__list-item">
        <span className="MaternityShootPackage__check">
          <CheckIcon />
        </span>
        <span className="MaternityShootPackage__list-text">{item}</span>
      </li>
    ))}
  </ul>
);

/* ---------- Main component ---------- */

const MaternityShootPackage = () => {
  const [statsRef, statsInView] = useInView();

  return (
    <section
      className="MaternityShootPackage"
      style={{ '--package-bg': `url(${packageBg})` }}
      aria-labelledby="MaternityShootPackage-title"
    >
      <div className="MaternityShootPackage__background" aria-hidden="true" />

      <div className="MaternityShootPackage__container">
        {/* Header */}
        <header className="MaternityShootPackage__header">
          <span className="MaternityShootPackage__eyebrow">{BRAND}</span>
          <h2 className="MaternityShootPackage__title" id="MaternityShootPackage-title">
            Wedding Photography &amp; Cinematic Film{' '}
            <span className="MaternityShootPackage__title-accent">Packages</span>
          </h2>
          <span className="MaternityShootPackage__divider" aria-hidden="true" />
          <p className="MaternityShootPackage__subtitle">
            Choose from our thoughtfully curated wedding, pre-wedding and
            celebration packages. {BRAND} turns your most precious days into
            timeless films and photographs.
          </p>
        </header>

        {/* Stats */}
        <div className="MaternityShootPackage__stats" ref={statsRef}>
          {STATS.map((stat, index) => (
            <Reveal
              key={stat.id}
              className="MaternityShootPackage__stat"
              delay={index * 120}
            >
              <span className="MaternityShootPackage__stat-value">
                {stat.prefix}
                {stat.animate ? (
                  <CountUp end={stat.value} start={statsInView} />
                ) : (
                  stat.value
                )}
                {stat.suffix}
              </span>
              <span className="MaternityShootPackage__stat-label">{stat.label}</span>
            </Reveal>
          ))}
        </div>

        {/* Wedding packages */}
        <SectionHead
          kicker="Wedding Cinematics"
          title="Wedding Packages"
          text="Complete coverage of every ritual, delivered as films, reels and handcrafted albums."
        />

        <ul className="MaternityShootPackage__grid">
          {WEDDING_PACKAGES.map((pkg, index) => (
            <Reveal
              as="li"
              key={pkg.id}
              className="MaternityShootPackage__cell"
              delay={index * 130}
            >
              <article
                className={`MaternityShootPackage__card ${
                  pkg.featured ? 'is-featured' : ''
                }`}
              >
                {pkg.badge && (
                  <span className="MaternityShootPackage__badge">{pkg.badge}</span>
                )}

                <h4 className="MaternityShootPackage__card-title">{pkg.name}</h4>
                <p className="MaternityShootPackage__card-tagline">{pkg.tagline}</p>

                <div className="MaternityShootPackage__price">
                  <span className="MaternityShootPackage__price-amount">
                    {pkg.price}
                  </span>
                  <span className="MaternityShootPackage__price-note">
                    {pkg.priceNote}
                  </span>
                </div>

                <div className="MaternityShootPackage__block">
                  <h5 className="MaternityShootPackage__block-title">Events Covered</h5>
                  <ul className="MaternityShootPackage__chips">
                    {pkg.events.map((event) => (
                      <li key={event} className="MaternityShootPackage__chip">
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="MaternityShootPackage__block MaternityShootPackage__block--grow">
                  <h5 className="MaternityShootPackage__block-title">What You Get</h5>
                  <CheckList items={pkg.outputs} />
                </div>

                <a
                  className={`MaternityShootPackage__button ${
                    pkg.featured ? 'MaternityShootPackage__button--solid' : ''
                  }`}
                  href={bookLink(pkg.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Now
                </a>
              </article>
            </Reveal>
          ))}
        </ul>

        {/* Pre-wedding */}
        <SectionHead
          kicker="Pre-Wedding"
          title="Pre-Wedding Shoot"
          text="Cinematic pre-wedding stories shot at the locations you love."
        />

        <Reveal className="MaternityShootPackage__pre">
          <div className="MaternityShootPackage__pre-prices">
            {PREWEDDING_PRICES.map((item) => (
              <div key={item.id} className="MaternityShootPackage__tile">
                <span className="MaternityShootPackage__tile-days">{item.days}</span>
                <span className="MaternityShootPackage__tile-place">{item.place}</span>
                <span className="MaternityShootPackage__tile-price">{item.price}</span>
              </div>
            ))}
          </div>

          <div className="MaternityShootPackage__pre-info">
            <h4 className="MaternityShootPackage__block-title">What You Get</h4>
            <CheckList items={PREWEDDING_OUTPUTS} />
            <a
              className="MaternityShootPackage__button"
              href={bookLink('Pre-Wedding Shoot')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Now
            </a>
          </div>
        </Reveal>

        {/* Other services */}
        <SectionHead
          kicker="All Services"
          title="Service Categories with Price"
          text="From newborn smiles to grand receptions, we capture every celebration."
        />

        <ul className="MaternityShootPackage__services">
          {SERVICES.map((service, index) => (
            <Reveal
              as="li"
              key={service.id}
              className="MaternityShootPackage__service"
              delay={(index % 4) * 80}
            >
              <span className="MaternityShootPackage__service-info">
                <span className="MaternityShootPackage__service-name">
                  {service.name}
                </span>
                {service.note && (
                  <span className="MaternityShootPackage__service-note">
                    {service.note}
                  </span>
                )}
              </span>
              <span
                className={`MaternityShootPackage__service-price ${
                  service.price ? '' : 'is-request'
                }`}
              >
                {service.price || 'On Request'}
              </span>
            </Reveal>
          ))}
        </ul>

        {/* Customize */}
        <Reveal className="MaternityShootPackage__custom">
          <h3 className="MaternityShootPackage__custom-title">Customize Your Package</h3>
          <p className="MaternityShootPackage__custom-text">
            As we are in a creative field, we don&rsquo;t limit our creativity. Let us
            know if you have any specific requirement, and we will work accordingly
            to serve you.
          </p>
          <a className="MaternityShootPackage__button MaternityShootPackage__button--solid" href={CONTACT_LINK}>
            Contact Us
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default MaternityShootPackage;