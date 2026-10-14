import React, { useEffect } from "react";
import "./NewsHome.css";
import flowerBg from "../../assets/page-1.webp";

const NewsHome = () => {

  /* Remove navbar icons only on this page */
  useEffect(() => {
    document.body.classList.add("news-page-active");
    return () => document.body.classList.remove("news-page-active");
  }, []);

  return (
    <section
      className="newsHero"
      data-bg={flowerBg}
      style={{ backgroundImage: `url(${flowerBg})` }} // fallback
    >
      <div className="newsHeroOverlay"></div>

      <div className="newsHeroContent">
        <h1 className="newsHeroTitle">News Details</h1>

        <div className="newsBreadcrumb">
          <span>Home</span>
          <span className="newsBreadcrumbArrow">›</span>
          <span className="active">News</span>
        </div>
      </div>
    </section>
  );
};

export default NewsHome;