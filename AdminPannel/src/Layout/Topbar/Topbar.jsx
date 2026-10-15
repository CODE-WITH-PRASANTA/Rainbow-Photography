
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  ChevronDown,
  Bell,
  Mail,
  Search,
  User,
  LogOut,
  Shield,
  Maximize,
  Minimize,
  X,
  Camera,
  Image,
} from "lucide-react";
import "./Topbar.css";

const BACKEND_BASE_URL = "http://localhost:5000";
const API_BASE_URL = `${BACKEND_BASE_URL}/api/profiles`;

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";

const getAvatarUrl = (path) => {
  if (!path) return DEFAULT_AVATAR;

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  return `${BACKEND_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const Topbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [currentProfile, setCurrentProfile] = useState({
    name: "Admin User",
    email: "admin@rainbowphotography.com",
    travelerType: "Studio Administrator",
    avatar: DEFAULT_AVATAR,
  });

  const dropdownRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  useEffect(() => {
    const fetchTopProfile = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error("Unable to fetch profile");
        }

        const result = await response.json();

        if (result.success && result.data?.length > 0) {
          setCurrentProfile((previous) => ({
            ...previous,
            ...result.data[0],
          }));
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    fetchTopProfile();

    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setCurrentProfile((previous) => ({
          ...previous,
          ...event.detail,
        }));
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate
      );
    };
  }, []);

  const closeAllMenus = () => {
    setDropdownOpen(false);
    setNotificationsOpen(false);
    setMailOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeAllMenus();
        setMobileSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Unable to toggle fullscreen:", error);
    }
  };

  const openMenu = (setter) => {
    closeAllMenus();
    setter(true);
  };

  return (
    <>
      <header className="Topbar">
        <div
          className={`Topbar-inner ${
            mobileSearchOpen ? "is-hidden" : ""
          }`}
        >
          <div className="Topbar-left">
            <button
              type="button"
              className="Topbar-toggle-btn"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>

            <div className="Topbar-page-label">
              <span className="Topbar-page-icon">
                <Camera size={17} />
              </span>

              <div>
                <span className="Topbar-page-title">
                  Rainbow Photography
                </span>
                <span className="Topbar-page-subtitle">
                  Studio management
                </span>
              </div>
            </div>

            <div className="Topbar-search-box">
              <Search
                size={17}
                className="Topbar-search-icon"
              />

              <input
                type="text"
                placeholder="Search your workspace..."
                className="Topbar-search-input"
                aria-label="Search workspace"
              />

              <kbd className="Topbar-search-shortcut">
                Ctrl /
              </kbd>
            </div>
          </div>

          <div className="Topbar-right" ref={dropdownRef}>
            <button
              type="button"
              className="Topbar-action-btn Topbar-mobile-search-btn"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open search"
            >
              <Search size={18} />
            </button>

            {/* Notifications */}
            <div className="Topbar-action-wrapper">
              <button
                type="button"
                className={`Topbar-action-btn ${
                  notificationsOpen ? "active" : ""
                }`}
                onClick={() =>
                  notificationsOpen
                    ? closeAllMenus()
                    : openMenu(setNotificationsOpen)
                }
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={18} />
                <span className="Topbar-badge">3</span>
              </button>

              {notificationsOpen && (
                <div className="Topbar-dropdown Topbar-notifications-dropdown">
                  <div className="Topbar-dropdown-header">
                    <span className="Topbar-dropdown-title">
                      Notifications
                    </span>
                    <span className="Topbar-dropdown-badge">
                      3 New
                    </span>
                  </div>

                  <div className="Topbar-notification-list">
                    <div className="Topbar-notification-item">
                      <span className="Topbar-notification-symbol">
                        <Image size={17} />
                      </span>
                      <div>
                        <p className="Topbar-notification-text">
                          Your photography workspace is ready to manage.
                        </p>
                        <span className="Topbar-notification-time">
                          Workspace update
                        </span>
                      </div>
                    </div>

                    <div className="Topbar-notification-item">
                      <span className="Topbar-notification-symbol">
                        <Mail size={17} />
                      </span>
                      <div>
                        <p className="Topbar-notification-text">
                          Remember to review your latest client enquiries.
                        </p>
                        <span className="Topbar-notification-time">
                          Enquiry reminder
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="Topbar-action-wrapper">
              <button
                type="button"
                className={`Topbar-action-btn ${
                  mailOpen ? "active" : ""
                }`}
                onClick={() =>
                  mailOpen
                    ? closeAllMenus()
                    : openMenu(setMailOpen)
                }
                aria-label="Messages"
                aria-expanded={mailOpen}
              >
                <Mail size={18} />
                <span className="Topbar-badge">2</span>
              </button>

              {mailOpen && (
                <div className="Topbar-dropdown Topbar-notifications-dropdown">
                  <div className="Topbar-dropdown-header">
                    <span className="Topbar-dropdown-title">
                      Client messages
                    </span>
                    <span className="Topbar-dropdown-badge">
                      2 New
                    </span>
                  </div>

                  <div className="Topbar-notification-list">
                    <div className="Topbar-notification-item">
                      <span className="Topbar-notification-symbol">
                        <User size={17} />
                      </span>
                      <div>
                        <p className="Topbar-notification-text">
                          Review your client messages and booking requests.
                        </p>
                        <span className="Topbar-notification-time">
                          Client inbox
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              type="button"
              className="Topbar-action-btn Topbar-fullscreen-btn"
              onClick={toggleFullscreen}
              aria-label={
                isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
              }
            >
              {isFullscreen ? (
                <Minimize size={18} />
              ) : (
                <Maximize size={18} />
              )}
            </button>

            {/* Profile */}
            <div
              className={`Topbar-user ${
                dropdownOpen ? "active" : ""
              }`}
              onClick={() =>
                dropdownOpen
                  ? closeAllMenus()
                  : openMenu(setDropdownOpen)
              }
              role="button"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();

                  dropdownOpen
                    ? closeAllMenus()
                    : openMenu(setDropdownOpen);
                }
              }}
            >
              <div className="Topbar-avatar-wrapper">
                <img
                  src={getAvatarUrl(currentProfile.avatar)}
                  alt={`${currentProfile.name || "Admin"} avatar`}
                  className="Topbar-avatar"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />

                <span className="Topbar-status-indicator" />
              </div>

              <div className="Topbar-user-info">
                <span className="Topbar-username">
                  {currentProfile.name || "Admin User"}
                </span>
                <span className="Topbar-role">
                  {currentProfile.travelerType ||
                    "Studio Administrator"}
                </span>
              </div>

              <ChevronDown
                size={15}
                className={`Topbar-chevron ${
                  dropdownOpen ? "open" : ""
                }`}
              />

              {dropdownOpen && (
                <div
                  className="Topbar-dropdown Topbar-user-dropdown"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="Topbar-user-card">
                    <p className="Topbar-card-name">
                      {currentProfile.name || "Admin User"}
                    </p>
                    <p className="Topbar-card-email">
                      {currentProfile.email ||
                        "admin@rainbowphotography.com"}
                    </p>
                  </div>

                  <div className="Topbar-dropdown-divider" />

                  <Link
                    to="/profile"
                    className="Topbar-dropdown-item"
                    onClick={closeAllMenus}
                  >
                    <User size={16} />
                    My Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="Topbar-dropdown-item"
                    onClick={closeAllMenus}
                  >
                    <Shield size={16} />
                    Settings &amp; Security
                  </Link>

                  <div className="Topbar-dropdown-divider" />

                  <Link
                    to="/logout"
                    className="Topbar-dropdown-item logout"
                    onClick={closeAllMenus}
                  >
                    <LogOut size={16} />
                    Log Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        {mobileSearchOpen && (
          <div className="Topbar-mobile-search-overlay">
            <Search
              size={17}
              className="Topbar-search-icon"
            />

            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Search your workspace..."
              className="Topbar-mobile-search-input"
              aria-label="Search workspace"
            />

            <button
              type="button"
              className="Topbar-mobile-search-close"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </header>

      <div className="Topbar-spacer" aria-hidden="true" />
    </>
  );
};

export default Topbar;
