
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiImage,
  FiPackage,
  FiUsers,
  FiClipboard,
  FiX,
  FiCamera,
  FiArrowUpRight,
} from "react-icons/fi";

import "./Sidebar.css";

const menuItems = [
  {
    text: "Dashboard",
    path: "/",
    icon: FiGrid,
    description: "Overview",
  },
  {
    text: "Gallery",
    path: "/gallary",
    icon: FiImage,
    description: "Photo collection",
  },
  {
    text: "Package",
    path: "/package",
    icon: FiPackage,
    description: "Photography plans",
  },
  {
    text: "Cold Lead",
    path: "/cold-lead",
    icon: FiUsers,
    description: "Potential clients",
  },
  {
    text: "Enquiry",
    path: "/enquiries",
    icon: FiClipboard,
    description: "Client requests",
  },
];

const Sidebar = ({
  isCollapsed = false,
  isMobileOpen = false,
  onClose,
}) => {
  const handleNavClick = () => {
    if (isMobileOpen && onClose) onClose();
  };

  return (
    <aside
      className={`rp-sidebar ${
        isCollapsed ? "rp-sidebar--collapsed" : ""
      } ${isMobileOpen ? "rp-sidebar--mobile-open" : ""}`}
      aria-label="Rainbow Photography navigation"
    >
      {/* Brand */}
      <div className="rp-brand">
        <div className="rp-brand__logo">
          <FiCamera size={25} strokeWidth={1.7} />
          <span className="rp-brand__sparkle">✦</span>
        </div>

        {(!isCollapsed || isMobileOpen) && (
          <div className="rp-brand__content">
            <h2>Rainbow</h2>
            <span className="rp-brand__subtitle">
              PHOTOGRAPHY
            </span>
          </div>
        )}

        {isMobileOpen && (
          <button
            className="rp-close"
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FiX size={21} />
          </button>
        )}
      </div>

      {/* Profile / business identity */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="rp-business-card">
          <div className="rp-business-card__image">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=180&q=85"
              alt="Professional photography camera"
            />
          </div>

          <div className="rp-business-card__text">
            <span className="rp-eyebrow">YOUR STUDIO</span>
            <h3>Creative Workspace</h3>
            <p>Capture something beautiful.</p>
          </div>

          <span className="rp-business-card__status" />
        </div>
      )}

      {/* Navigation */}
      <div className="rp-section-heading">
        {(!isCollapsed || isMobileOpen) && (
          <>
            <span>WORKSPACE</span>
            <span className="rp-section-line" />
          </>
        )}
      </div>

      <nav className="rp-nav">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.text}
              to={item.path}
              end={item.path === "/"}
              onClick={handleNavClick}
              title={
                isCollapsed && !isMobileOpen
                  ? item.text
                  : undefined
              }
              className={({ isActive }) =>
                `rp-nav__link ${
                  isActive ? "rp-nav__link--active" : ""
                }`
              }
            >
              <span className="rp-nav__icon">
                <Icon size={20} strokeWidth={1.8} />
              </span>

              {(!isCollapsed || isMobileOpen) && (
                <>
                  <span className="rp-nav__details">
                    <span className="rp-nav__title">
                      {item.text}
                    </span>
                    <span className="rp-nav__description">
                      {item.description}
                    </span>
                  </span>

                  <span className="rp-nav__arrow">
                    {index === 0 ? (
                      <FiArrowUpRight size={16} />
                    ) : (
                      <span className="rp-nav__dot" />
                    )}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Photography inspiration card */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="rp-inspiration">
          <img
            className="rp-inspiration__image"
            src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=85"
            alt="Beautiful landscape photography"
            loading="lazy"
          />

          <div className="rp-inspiration__overlay" />

          <div className="rp-inspiration__content">
            <span className="rp-inspiration__label">
              THE ART OF
            </span>
            <h3>Capturing Moments.</h3>
            <p>Every frame tells a story.</p>
          </div>

          <div className="rp-inspiration__icon">
            <FiCamera size={19} />
          </div>
        </div>
      )}

      {/* Footer */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="rp-footer">
          <span className="rp-footer__symbol">✦</span>
          <span>Made for beautiful memories</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
