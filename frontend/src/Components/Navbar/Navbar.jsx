import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo-bg.png";

const navItems = [
  { name: "Home", path: "/", end: true },
  { name: "About", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Package", path: "/package" },
  { name: "FAQ", path: "/faq" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="rp-navbar">
        <nav className="rp-nav-container" aria-label="Main navigation">
          {/* Logo */}
          <NavLink
            to="/"
            className="rp-logo"
            aria-label="Rainbow Photography home"
            onClick={closeMobileMenu}
          >
            <img src={logo} alt="Rainbow Photography" />
          </NavLink>

          {/* Desktop Navigation */}
          <ul className="rp-nav-menu">
            {navItems.map((item) => (
              <li className="rp-nav-item" key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `rp-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className={`rp-menu-toggle ${mobileOpen ? "is-open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="rp-mobile-navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </header>

      {/* Mobile Overlay */}
      <button
        type="button"
        className={`rp-nav-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={closeMobileMenu}
        aria-label="Close navigation menu"
        tabIndex={mobileOpen ? 0 : -1}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile Sidebar */}
      <aside
        id="rp-mobile-navigation"
        className={`rp-mobile-menu ${mobileOpen ? "is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <div className="rp-mobile-header">
          <NavLink to="/" onClick={closeMobileMenu} className="rp-mobile-logo">
            <img src={logo} alt="Rainbow Photography" />
          </NavLink>

          <button
            type="button"
            className="rp-mobile-close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <p className="rp-mobile-caption">CAPTURE YOUR MOMENTS</p>

        <ul className="rp-mobile-links">
          {navItems.map((item, index) => (
            <li key={item.path} style={{ "--item-index": index }}>
              <NavLink
                to={item.path}
                end={item.end}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rp-mobile-link ${isActive ? "active" : ""}`
                }
              >
                <span className="rp-mobile-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{item.name}</span>

                <span className="rp-mobile-arrow" aria-hidden="true">
                  ↗
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="rp-mobile-footer">
          <span className="rp-footer-line" />
          <p>Every picture tells a story.</p>
          <span>RAINBOW PHOTOGRAPHY</span>
        </div>
      </aside>
    </>
  );
};

export default Navbar;