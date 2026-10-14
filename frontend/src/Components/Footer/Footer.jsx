
import React from "react";
import { Link } from "react-router-dom";
import {
  LuInstagram,
  LuFacebook,
  LuPhone,
  LuMail,
  LuMapPin,
  LuArrowUpRight,
} from "react-icons/lu";
import "./Footer.css";
import navbarLogo from "../../assets/navbarlogo.jpeg";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    { name: "Wedding Photography", href: "/services/wedding-photography" },
    { name: "Pre Wedding", href: "/services/pre-wedding" },
    { name: "Portraits", href: "/services/portraits" },
    { name: "Event Photography", href: "/services/event-photography" },
    { name: "Fashion Photography", href: "/services/fashion-photography" },
    { name: "Product Photography", href: "/services/product-photography" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/",
      className: "Footer__socialLink--instagram",
      icon: <LuInstagram />,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/",
      className: "Footer__socialLink--facebook",
      icon: <LuFacebook />,
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/",
      className: "Footer__socialLink--youtube",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M23.2 6.2a3 3 0 0 0-2.1-2.1C19.3 3.6 12 3.6 12 3.6s-7.3 0-9.1.5A3 3 0 0 0 .8 6.2 31 31 0 0 0 .3 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.1.5 9.1.5s7.3 0 9.1-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-5.8 31 31 0 0 0-.5-5.8Z"
            fill="currentColor"
          />
          <path d="m9.6 15.5 6.2-3.5-6.2-3.5v7Z" fill="#090908" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/911234567890",
      className: "Footer__socialLink--whatsapp",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20.5 3.5A11.8 11.8 0 0 0 2 17.7L.5 23.5l6-1.6A11.8 11.8 0 0 0 12 23.2h.1A11.7 11.7 0 0 0 20.5 3.5ZM12 21.2a9.7 9.7 0 0 1-4.9-1.3l-.4-.2-3.5.9.9-3.4-.2-.4A9.7 9.7 0 1 1 12 21.2Z"
            fill="currentColor"
          />
          <path
            d="M17.3 14.3c-.3-.2-1.7-.9-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.4-.4-.7-.4h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.1-1.4-.1-.2-.3-.3-.6-.5Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
  ];

  return (
    <footer className="Footer">
      <div className="Footer__main">
        <div className="Footer__container">
          {/* Brand section */}
          <div className="Footer__brand">
            <Link
              to="/"
              className="Footer__logoLink"
              aria-label="Rainbow Photography home"
            >
              <img
                src={navbarLogo}
                alt="Rainbow Photography"
                className="Footer__logo"
              />
            </Link>

            <span className="Footer__brandDivider" />

            <p className="Footer__tagline">
              Capturing moments
              <br />
              that last forever.
            </p>

            <div className="Footer__socials" aria-label="Social media links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`Footer__socialLink ${social.className}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${social.name}`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links matching the navbar */}
          <nav className="Footer__column" aria-label="Quick links">
            <h2 className="Footer__heading">Quick Links</h2>
            <span className="Footer__headingLine" />

            <ul className="Footer__list">
              {quickLinks.map((item) => (
                <li key={item.name} className="Footer__listItem">
                  <Link className="Footer__link" to={item.href}>
                    <span className="Footer__arrow" aria-hidden="true">›</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav className="Footer__column" aria-label="Our services">
            <h2 className="Footer__heading">Our Services</h2>
            <span className="Footer__headingLine" />

            <ul className="Footer__list">
              {services.map((item) => (
                <li key={item.name} className="Footer__listItem">
                  <Link className="Footer__link" to={item.href}>
                    <span className="Footer__arrow" aria-hidden="true">›</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="Footer__contact">
            <h2 className="Footer__heading">Get In Touch</h2>
            <span className="Footer__headingLine" />

            <div className="Footer__contactList">
              <a href="tel:+911234567890" className="Footer__contactItem">
                <span className="Footer__contactIcon" aria-hidden="true">
                  <LuPhone />
                </span>
                <span>+91 123 456 7890</span>
              </a>

              <a
                href="mailto:info@rainbowphotography.com"
                className="Footer__contactItem"
              >
                <span className="Footer__contactIcon" aria-hidden="true">
                  <LuMail />
                </span>
                <span>info@rainbowphotography.com</span>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Bhubaneswar%2C%20Odisha"
                className="Footer__contactItem"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="Footer__contactIcon" aria-hidden="true">
                  <LuMapPin />
                </span>
                <span>Bhubaneswar, Odisha</span>
              </a>
            </div>

            <Link to="/contact" className="Footer__bookButton">
              <span>Book Now</span>
              <LuArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Compact bottom bar */}
      <div className="Footer__bottom">
        <div className="Footer__bottomContainer">
          <p className="Footer__credit">
            Designed &amp; Developed by{" "}
            <a
              href="https://prwebstock.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PR WEBSTOCK
            </a>
          </p>

          <p className="Footer__copyright">
            © 2026 Rainbow Photography. All rights reserved.
          </p>

          <div className="Footer__legalLinks">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="Footer__legalDivider" />
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
