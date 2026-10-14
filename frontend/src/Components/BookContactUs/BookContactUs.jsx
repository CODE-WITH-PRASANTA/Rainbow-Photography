import React, { useEffect } from "react";
import "./BookContactUs.css";
import flowerBg from "../../assets/page-1.webp";

const BookContactUs = () => {
  // ✅ component base class name
  const base = "book-contact-us";

  // ✅ Remove navbar icons only on this page
  useEffect(() => {
    document.body.classList.add("contact-page-active");
    return () => document.body.classList.remove("contact-page-active");
  }, []);

  return (
    <section
      className={`${base}__hero`}
      data-bg={flowerBg}
      style={{ backgroundImage: `url(${flowerBg})` }} // fallback
    >
      <div className={`${base}__overlay`} />

      <div className={`${base}__content`}>
        <h1 className={`${base}__title`}>CONTACT US</h1>

        <div className={`${base}__breadcrumb`}>
          <span className={`${base}__crumb`}>Home</span>
          <span className={`${base}__arrow`}>{">"}</span>
          <span className={`${base}__active`}>Contact</span>
        </div>
      </div>
    </section>
  );
};

export default BookContactUs;