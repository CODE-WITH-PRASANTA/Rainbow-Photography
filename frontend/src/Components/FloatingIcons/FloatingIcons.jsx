import React, { useEffect, useRef, useState } from "react";
import "./FloatingIcons.css";

/* ---------------------------------
   Contact numbers
--------------------------------- */
const CONTACTS = [
  {
    id: "primary",
    label: "Primary",
    display: "+91 95563 55446",
    tel: "+919556355446",
    wa: "919556355446",
  },
  {
    id: "secondary",
    label: "Secondary",
    display: "+91 73759 71966",
    tel: "+917375971966",
    wa: "917375971966",
  },
];

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello! I would like to get more information."
);

/* Scroll progress ring: circle r=24 -> circumference */
const RING_RADIUS = 24;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/* ---------------------------------
   Icons
--------------------------------- */
const PhoneIcon = () => (
  <svg className="FloatingIcons__svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="FloatingIcons__svg FloatingIcons__svg--wa" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15c-1.49 0-2.94-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.83c.01 4.54-3.69 8.23-8.22 8.23zm4.51-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.73 2.65 4.2 3.71.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.12-.22-.19-.47-.31z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg
    className="FloatingIcons__svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

/* ---------------------------------
   Component
--------------------------------- */
const FloatingIcons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [openMenu, setOpenMenu] = useState(null); // "call" | "whatsapp" | null

  const rootRef = useRef(null);

  /* Scroll visibility + progress */
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setShowScrollTop(window.scrollY > 300);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  /* Close menus on outside click / Escape */
  useEffect(() => {
    if (!openMenu) return;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMenu = (name) => {
    setOpenMenu((current) => (current === name ? null : name));
  };

  const renderMenu = (name, type) => (
    <div
      className={`FloatingIcons__menu ${
        openMenu === name ? "FloatingIcons__menu--open" : ""
      }`}
      role="menu"
      aria-hidden={openMenu !== name}
    >
      {CONTACTS.map((contact, index) => {
        const isWhatsApp = type === "whatsapp";

        return (
          <a
            key={contact.id}
            role="menuitem"
            tabIndex={openMenu === name ? 0 : -1}
            className={`FloatingIcons__pill FloatingIcons__pill--${type}`}
            style={{ "--i": index }}
            href={
              isWhatsApp
                ? `https://wa.me/${contact.wa}?text=${WHATSAPP_MESSAGE}`
                : `tel:${contact.tel}`
            }
            target={isWhatsApp ? "_blank" : undefined}
            rel={isWhatsApp ? "noopener noreferrer" : undefined}
            onClick={() => setOpenMenu(null)}
            aria-label={`${isWhatsApp ? "Chat on WhatsApp" : "Call"} ${contact.display}`}
          >
            <span className="FloatingIcons__pill-icon">
              {isWhatsApp ? <WhatsAppIcon /> : <PhoneIcon />}
            </span>

            <span className="FloatingIcons__pill-text">
              <small>{contact.label}</small>
              <strong>{contact.display}</strong>
            </span>
          </a>
        );
      })}
    </div>
  );

  return (
    <aside
      ref={rootRef}
      className="FloatingIcons"
      aria-label="Floating quick actions"
    >
      {/* Scroll to top */}
      <div
        className={`FloatingIcons__item FloatingIcons__item--scroll ${
          showScrollTop ? "FloatingIcons__item--visible" : ""
        }`}
      >
        <button
          type="button"
          className="FloatingIcons__btn FloatingIcons__btn--scroll"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          tabIndex={showScrollTop ? 0 : -1}
        >
          <svg className="FloatingIcons__ring" viewBox="0 0 52 52" aria-hidden="true">
            <circle className="FloatingIcons__ring-track" cx="26" cy="26" r={RING_RADIUS} />
            <circle
              className="FloatingIcons__ring-bar"
              cx="26"
              cy="26"
              r={RING_RADIUS}
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - progress)}
            />
          </svg>
          <ArrowUpIcon />
        </button>
      </div>

      {/* Call */}
      <div className="FloatingIcons__item FloatingIcons__item--call" style={{ "--enter": 1 }}>
        {renderMenu("call", "call")}

        <button
          type="button"
          className="FloatingIcons__btn FloatingIcons__btn--call"
          onClick={() => toggleMenu("call")}
          aria-label="Call us"
          aria-haspopup="menu"
          aria-expanded={openMenu === "call"}
        >
          <PhoneIcon />
        </button>
      </div>

      {/* WhatsApp */}
      <div className="FloatingIcons__item FloatingIcons__item--whatsapp" style={{ "--enter": 2 }}>
        {renderMenu("whatsapp", "whatsapp")}

        <button
          type="button"
          className="FloatingIcons__btn FloatingIcons__btn--whatsapp"
          onClick={() => toggleMenu("whatsapp")}
          aria-label="Chat on WhatsApp"
          aria-haspopup="menu"
          aria-expanded={openMenu === "whatsapp"}
        >
          <WhatsAppIcon />
        </button>
      </div>
    </aside>
  );
};

export default FloatingIcons;