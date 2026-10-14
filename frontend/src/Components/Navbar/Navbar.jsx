import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LuMenu, LuX, LuArrowUpRight } from "react-icons/lu";

import navbarLogo from "../../assets/navbarlogo.jpeg";
import "./Navbar.css";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Gallery", path: "/gallery" },
  { name: "Faq", path: "/faq" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className={`luxury-navbar-wrapper ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="luxury-navbar" aria-label="Main Navigation">
        <div className="luxury-navbar-container">
          
          {/* Logo */}
          <Link to="/" className="luxury-brand">
            <div className="logo-badge">
              <img
                src={navbarLogo}
                alt="Rainbow Photography Logo"
                className="luxury-logo-img"
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="luxury-nav-menu">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `luxury-nav-link ${isActive ? "active" : ""}`
                }
              >
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Action CTA & Mobile Toggle */}
          <div className="luxury-actions">
            <Link to="/booking" className="luxury-btn">
              <span>Book Session</span>
              <LuArrowUpRight className="luxury-btn-icon" />
            </Link>

            <button
              type="button"
              className="luxury-toggle"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <LuX /> : <LuMenu />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`luxury-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Navigation Drawer */}
      <aside className={`luxury-drawer ${menuOpen ? "open" : ""}`}>
        <div className="luxury-drawer-inner">
          <div className="drawer-header">
            <span className="drawer-sub">MENU</span>
            <button 
              className="drawer-close-btn"
              onClick={() => setMenuOpen(false)}
            >
              <LuX />
            </button>
          </div>

          <div className="drawer-links">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `drawer-link ${isActive ? "active" : ""}`
                }
              >
                <span className="drawer-index">0{index + 1}</span>
                <span className="drawer-name">{link.name}</span>
                <LuArrowUpRight className="drawer-arrow" />
              </NavLink>
            ))}
          </div>

          <div className="drawer-footer">
            <Link to="/booking" className="drawer-cta-btn">
              <span>BOOK A SESSION</span>
              <LuArrowUpRight />
            </Link>
          </div>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;