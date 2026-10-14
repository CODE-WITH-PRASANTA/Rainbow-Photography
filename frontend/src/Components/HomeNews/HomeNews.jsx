import React from "react";
import "./HomeNews.css";

/* images */
import bgFlower from "../../assets/LeftFlower-2.webp";
import headingFlower from "../../assets/TwinFlower-1.webp";
import cardFlower from "../../assets/Flower-33.webp";
import person from "../../assets/News-1.webp";

const data = [1,2,3];

const HomeNews = () => {
  return (
    <section className="HomeNews">

      
      {/* background flowers */}
<img src={bgFlower} className="HomeNews__bg HomeNews__bg--bottom" alt="" />
<img src={bgFlower} className="HomeNews__bg HomeNews__bg--top" alt="" />

      {/* ===== HEADER ===== */}
      <div className="HomeNews__header">
        <span className="HomeNews__label">RECENT ARTICLES</span>
        <h2 className="HomeNews__title">News & Updates</h2>
        <img src={headingFlower} className="HomeNews__headingFlower" alt="" />
      </div>

      {/* ===== CARDS ===== */}
      <div className="HomeNews__grid">

        {data.map((_,i)=>(
          <div className="HomeNews__card" key={i}>

            {/* small flower */}
            <img src={cardFlower} className="HomeNews__cardFlower" alt="" />

            <span className="HomeNews__date">December 14, 2024</span>

            <h3 className="HomeNews__cardTitle">
              Couple’s wedding turns emotional as groom stands for first time
            </h3>

            <p className="HomeNews__desc">
              I’m filled with joy and excitement to be marrying the love of my life.
            </p>

            <div className="HomeNews__author">
              <img src={person} alt="" />
              <span>By <a href="#">Thomas Willimes</a></span>
            </div>

          </div>
        ))}

      </div>

      {/* ===== BOTTOM CTA ===== */}
      <div className="HomeNews__cta">
        <p>
          Take a look at Real Life Weddings and hints, tips and advice for finding the perfect wedding venue
        </p>

        <button className="HomeNews__btn">
          View All Venue
        </button>
      </div>

    </section>
  );
};

export default HomeNews;