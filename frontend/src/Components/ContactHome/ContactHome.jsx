import React from "react";
import "./ContactHome.css";

const ContactHome = () => {
  return (
    <section className="hero" aria-label="Contact Us Hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1>CONTACT US</h1>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <span className="breadcrumb__item">Home</span>
            <span className="breadcrumb__separator" aria-hidden="true">{">"}</span>
            <span className="breadcrumb__item breadcrumb__item--active">Contact</span>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default ContactHome;