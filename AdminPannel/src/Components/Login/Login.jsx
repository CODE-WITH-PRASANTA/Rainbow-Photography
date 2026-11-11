import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowRight,
  FiCamera,
  FiAperture,
} from "react-icons/fi";
import { FaUser } from "react-icons/fa";

import "./Login.css";
import cultureImage from "../../assets/login.webp";

const AUTH_KEY = "isAdminAuthenticated";

/*
  TEMPORARY LOGIN CHECK
  ---------------------
  Anything in front-end code can be read by anyone who opens the browser
  tools, so this is only fine for a demo. For production, replace the body of
  authenticate() with a call to your backend, for example:

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    return res.ok;
*/
const DEMO_USER = "rainbow";
const DEMO_PASS = "12345";

const authenticate = async (identifier, password) => {
  await new Promise((resolve) => setTimeout(resolve, 600)); // simulate network
  return identifier.trim().toLowerCase() === DEMO_USER && password === DEMO_PASS;
};

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const navigate = useNavigate();
  const redirectTimer = useRef(null);

  // If the person is already signed in, skip the login screen.
  // "Remember me" stores the flag in localStorage; copy it into
  // sessionStorage so your existing route guard keeps working.
  useEffect(() => {
    const remembered = localStorage.getItem(AUTH_KEY) === "true";
    if (remembered) sessionStorage.setItem(AUTH_KEY, "true");

    if (sessionStorage.getItem(AUTH_KEY) === "true") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Clear the redirect timer if the component unmounts
  useEffect(() => {
    return () => clearTimeout(redirectTimer.current);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errorMessage) setErrorMessage("");
    if (infoMessage) setInfoMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;

    setIsLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const ok = await authenticate(formData.identifier, formData.password);

      if (!ok) {
        setErrorMessage("Incorrect username or password. Please try again.");
        return;
      }

      sessionStorage.setItem(AUTH_KEY, "true");
      if (formData.rememberMe) {
        localStorage.setItem(AUTH_KEY, "true");
      } else {
        localStorage.removeItem(AUTH_KEY);
      }

      setIsSuccess(true);
      redirectTimer.current = setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } catch (err) {
      setErrorMessage("Something went wrong. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("Please contact the studio administrator to reset your password.");
  };

  return (
    <div className="Login-container">
      {isSuccess && (
        <div className="Login-success-overlay" role="status" aria-live="polite">
          <div className="Login-success-card-3d">
            <div className="Login-success-icon-wrapper">
              <FiCheckCircle size={74} className="Login-success-icon" />
            </div>
            <h2 className="Login-success-title">Welcome back</h2>
            <p className="Login-success-subtitle">
              Signing you in to Rainbow Photography Studio
            </p>
            <div className="Login-success-loader"></div>
          </div>
        </div>
      )}

      <div className={`Login-card-wrapper ${isSuccess ? "Login-blur" : ""}`}>
        {/* LEFT BRANDING SECTION */}
        <div
          className="Login-brand-section"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(34, 22, 14, 0.7) 0%, rgba(42, 27, 17, 0.88) 100%), url(${cultureImage})`,
          }}
        >
          <div className="Login-brand-header">
            <div className="Login-logo-container">
              <div className="Login-logo-badge">
                <FiCamera className="Login-logo-icon" />
              </div>
              <div className="Login-logo-text-group">
                <h2 className="Login-brand-title">Rainbow Photography</h2>
                <span className="Login-brand-subtitle">STUDIO &amp; CINEMA</span>
              </div>
            </div>
          </div>

          <div className="Login-hero-content">
            <span className="Login-hero-tagline">
              <FiAperture className="Login-tagline-icon" /> Every Moment Tells A Story
            </span>
            <h1 className="Login-hero-heading">
              Capturing Love, <br />
              <span className="Login-hero-highlight">Frame by Frame.</span>
            </h1>
            <p className="Login-hero-description">
              Preserving life's most heartfelt celebrations, wedding memories, and candid
              emotions with timeless visual artistry.
            </p>
          </div>

          <div className="Login-hero-footer">
            <p className="Login-handwritten">
              Feel the emotion, <br />
              treasure forever ✨
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN FORM SECTION */}
        <div className="Login-form-section">
          <div className="Login-avatar-container">
            <div className="Login-avatar-3d">
              <FaUser size={22} />
            </div>
          </div>

          <div className="Login-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to manage galleries, clients, and bookings</p>
          </div>

          {errorMessage && (
            <div className="Login-error-badge" role="alert">
              {errorMessage}
            </div>
          )}

          {infoMessage && (
            <div className="Login-info-badge" role="status">
              {infoMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="Login-form" noValidate={false}>
            <div className="Login-input-group">
              <FiMail className="Login-input-icon" size={18} />
              <input
                type="text"
                name="identifier"
                placeholder="Username or email address"
                aria-label="Username or email address"
                value={formData.identifier}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
                disabled={isLoading}
                required
              />
            </div>

            <div className="Login-input-group">
              <FiLock className="Login-input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                aria-label="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="Login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <div className="Login-form-options">
              <label className="Login-checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="Login-forgot-link" onClick={handleForgot}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="Login-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="Login-spinner" aria-hidden="true"></span>
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign in to studio</span>
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;