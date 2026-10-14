import React from "react";
import "./CommentesTags.css";

import user1 from "../../assets/team4-1.webp";
import user2 from "../../assets/SarahAlbert.webp";

const CommentesTags = () => {
  return (
    <section className="ct">

      {/* TAGS + SHARE */}
      <div className="ct__top">
        <div className="ct__tags">
          <span className="ct__label">Tags</span>
          <span className="ct__tag">Business</span>
          <span className="ct__tag">Agency</span>
        </div>

        <div className="ct__share">
          <div className="ct__icon">✕</div>
          <div className="ct__icon">F</div>
          <div className="ct__icon">P</div>
          <div className="ct__icon">◎</div>
        </div>
      </div>

      {/* NEXT / PREV */}
      <div className="ct__nav">
        <div className="ct__card">
          Bring to the table win-win <br /> survival strategies
        </div>

        <div className="ct__card">
          How to lead a healthy & <br /> well-balanced life
        </div>
      </div>

      {/* COMMENTS */}
      <h2 className="ct__title">2 Comments</h2>

      <div className="ct__comment">
        <img src={user1} alt="" className="ct__avatar" />
        <div className="ct__content">
          <div className="ct__row">
            <h4>Kevin Martin</h4>
            <button className="ct__reply">Reply</button>
          </div>

          <p>
            Mauris non dignissim purus, ac commodo diam. Donec sit amet
            lacinia nulla. Aliquam quis purus in justo pulvinar tempor.
          </p>
        </div>
      </div>

      <div className="ct__comment">
        <img src={user2} alt="" className="ct__avatar" />
        <div className="ct__content">
          <div className="ct__row">
            <h4>Sarah Albert</h4>
            <button className="ct__reply">Reply</button>
          </div>

          <p>
            Mauris non dignissim purus, ac commodo diam. Donec sit amet
            lacinia nulla. Aliquam quis purus in justo pulvinar tempor.
          </p>
        </div>
      </div>

    </section>
  );
};

export default CommentesTags;