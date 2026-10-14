import React, { useEffect } from "react";
import "./ServiceHome.css";
import flowerBg from "../../assets/page-1.webp";

const ServiceHome = () => {
  // ✅ component base class name
  const base = "service-home";

  // ✅ Remove navbar icons only on this page
  useEffect(() => {
    document.body.classList.add("service-page-active");
    return () => document.body.classList.remove("service-page-active");
  }, []);

  return (
    <section
      className={`${base}__hero`}
      style={{ backgroundImage: `url(${flowerBg})` }}
    >
      <div className={`${base}__overlay`} />

      <div className={`${base}__content`}>
        <h1 className={`${base}__title`}>SERVICE</h1>

        <div className={`${base}__breadcrumb`}>
          <span className={`${base}__crumb`}>Home</span>
          <span className={`${base}__arrow`}>{">"}</span>
          <span className={`${base}__active`}>Service</span>
        </div>
      </div>
    </section>
  );
};

export default ServiceHome;