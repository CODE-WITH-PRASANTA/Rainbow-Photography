import React from 'react';
import './AboutUsHome.css';

const AboutUsHome = () => {
  return (
    <section className="about-hero-section">
      {/* Overlay to ensure text readability */}
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <h1 className="hero-title">About Us</h1>
        
        <nav className="breadcrumb">
          <a href="/" className="breadcrumb-item">Home</a>
          <span className="breadcrumb-separator">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
          <span className="breadcrumb-item active">About Us</span>
        </nav>
      </div>
    </section>
  );
};

export default AboutUsHome;