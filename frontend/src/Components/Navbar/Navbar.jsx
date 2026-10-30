import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo-bg.png";

const serviceItems = [
  { name: "Maternity Shoot", path: "/service/maternity" },
  { name: "Birthday Special", path: "/service/birthday" },
  { name: "Baby Shoot", path: "/service/baby-shoot" },
  { name: "Advertise Shoot", path: "/service/advertise" },
  { name: "Pre-wedding & Post wedding Shoot", path: "/service/wedding" },
];

const navItems = [
  { name: "Home", path: "/", end: true },
  { name: "About", path: "/about" },
  { name: "Show Case", path: "/gallery" },
  { name: "Pricing", path: "/package" },
  {
    name: "Service",
    path: "/service",
    isDropdown: true,
    children: serviceItems,
  },
  { name: "FAQ", path: "/faq" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isServiceActive = serviceItems.some(
    (item) => location.pathname === item.path
  ) || location.pathname === "/service";

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDesktopDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        setDesktopDropdownOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  // Close menus on route change
  useEffect(() => {
    closeMobileMenu();
    setDesktopDropdownOpen(false);
  }, [location.pathname]);

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
            {navItems.map((item) => {
              if (item.isDropdown) {
                return (
                  <li
                    className={`rp-nav-item rp-dropdown-container ${
                      desktopDropdownOpen ? "open" : ""
                    }`}
                    key={item.name}
                    ref={dropdownRef}
                    onMouseEnter={() => setDesktopDropdownOpen(true)}
                    onMouseLeave={() => setDesktopDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      className={`rp-nav-link rp-dropdown-trigger ${
                        isServiceActive ? "active" : ""
                      }`}
                      aria-haspopup="true"
                      aria-expanded={desktopDropdownOpen}
                      onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                    >
                      <span>{item.name}</span>
                      <svg
                        className="rp-dropdown-chevron"
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {/* Desktop Dropdown Menu */}
                    <div className="rp-dropdown-menu">
                      <div className="rp-dropdown-inner">
                        {item.children.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `rp-dropdown-link ${isActive ? "active" : ""}`
                            }
                            onClick={() => setDesktopDropdownOpen(false)}
                          >
                            <span className="rp-dropdown-bullet" />
                            <span className="rp-dropdown-text">{subItem.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }

              return (
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
              );
            })}
          </ul>

          {/* Mobile Menu Toggle Button */}
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

      {/* Mobile Backdrop Overlay */}
      <button
        type="button"
        className={`rp-nav-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={closeMobileMenu}
        aria-label="Close navigation menu"
        tabIndex={mobileOpen ? 0 : -1}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile Drawer */}
      <aside
        id="rp-mobile-navigation"
        className={`rp-mobile-menu ${mobileOpen ? "is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? "" : undefined}
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
          {navItems.map((item, index) => {
            const formattedIndex = String(index + 1).padStart(2, "0");

            if (item.isDropdown) {
              return (
                <li key={item.name} className="rp-mobile-accordion-item">
                  <button
                    type="button"
                    className={`rp-mobile-link rp-mobile-accordion-btn ${
                      isServiceActive ? "active" : ""
                    } ${mobileServicesOpen ? "expanded" : ""}`}
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    aria-expanded={mobileServicesOpen}
                  >
                    <span className="rp-mobile-number">{formattedIndex}</span>
                    <span>{item.name}</span>
                    <span
                      className={`rp-mobile-arrow rp-accordion-icon ${
                        mobileServicesOpen ? "rotate" : ""
                      }`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </button>

                  {/* Collapsible Mobile Sub-items */}
                  <div
                    className={`rp-mobile-sublist-wrapper ${
                      mobileServicesOpen ? "open" : ""
                    }`}
                  >
                    <ul className="rp-mobile-sublist">
                      {item.children.map((subItem) => (
                        <li key={subItem.path}>
                          <NavLink
                            to={subItem.path}
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                              `rp-mobile-sublink ${isActive ? "active" : ""}`
                            }
                          >
                            <span className="rp-sublink-bullet">✦</span>
                            <span>{subItem.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `rp-mobile-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="rp-mobile-number">{formattedIndex}</span>
                  <span>{item.name}</span>
                  <span className="rp-mobile-arrow" aria-hidden="true">
                    ↗
                  </span>
                </NavLink>
              </li>
            );
          })}
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