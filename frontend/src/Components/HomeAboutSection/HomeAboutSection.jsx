import React from "react";
import "./HomeAboutSection.css";
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"></link>

/* images */
import mainImg from "../../assets/Event-1.webp";        // big wedding stage image
import peopleImg from "../../assets/Event-2.webp";    // two girls image
import leaf1 from "../../assets/Leave-1.webp";
import leaf2 from "../../assets/Leave-2.webp";

const HomeAboutSection = () => {
  return (
    <section className="aboutWedding">

      <div className="aboutWedding__container">

        {/* LEFT CONTENT */}
        <div className="aboutWedding__content">

          <span className="aboutWedding__label">
            WELCOME TO WENDOLA
          </span>

          <h2 className="aboutWedding__title">
            Plan The Beautiful <br /> Wedding Event
          </h2>

          <p className="aboutWedding__desc">
            From the vibrant flowers and trees to the gently flowing streams,
            this park provides the perfect backdrop for this joyous occasion.
            As we stand here today, surrounded by the beauty of this park,
            we are reminded of the enduring power of love.
          </p>

          <div className="aboutWedding__block">
            <h4>Experience:</h4>
            <p>17 Years experience of wedding shopping and planning.</p>
          </div>

          <div className="aboutWedding__block">
            <h4>Event Plans:</h4>
            <p>
              Event planning involves the coordination of every detail of events
              such as meetings, conventions, trade shows, ceremony, retreats,
              or parties.
            </p>
          </div>

         <button className="aboutWedding__btn">
  <span>Book an Appointment</span>
</button>
        </div>

        {/* RIGHT IMAGES */}
        <div className="aboutWedding__media">

          <img src={leaf1} className="aboutWedding__leaf aboutWedding__leaf--top" alt="" />

          <div className="aboutWedding__imgWrap aboutWedding__imgWrap--main">
            <img src={mainImg} alt="" />
          </div>

          <div className="aboutWedding__imgWrap aboutWedding__imgWrap--people">
            <img src={peopleImg} alt="" />
          </div>

          <img src={leaf2} className="aboutWedding__leaf aboutWedding__leaf--side" alt="" />
        </div>

      </div>
    </section>
  );
};

export default HomeAboutSection;