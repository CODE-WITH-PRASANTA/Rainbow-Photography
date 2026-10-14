import React from "react";
import "./RSVPInvitation.css";

/* IMAGES */
import weddingImage from "../../assets/contact-1.webp";
import leafLeft from "../../assets/leaf-23.webp";
import leafRight from "../../assets/leaf-22.webp";
import formFlower from "../../assets/MainF-1.webp";

const RSVPInvitation = () => {
  return (
    <section className="RSVPInvitation">
      <div className="RSVPInvitation-container">
        
        {/* LEFT SIDE */}
        <div className="RSVPInvitation-left">
          <p className="RSVPInvitation-subtitle">The Wedding Day</p>
          <h1 className="RSVPInvitation-title">
            We’re Getting <br /> Married!
          </h1>
          <p className="RSVPInvitation-description">
            From the vibrant flowers and trees to the gently flowing streams,
            this park provides the perfect backdrop.
          </p>

          <div className="RSVPInvitation-imageWrapper">
            <img
              src={weddingImage}
              alt="Wedding"
              className="RSVPInvitation-image"
            />
            <div className="RSVPInvitation-playButton">
              ▶
            </div>
          </div>

          <img
            src={leafLeft}
            alt="leaf"
            className="RSVPInvitation-leaf RSVPInvitation-leafLeft"
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="RSVPInvitation-right">
          <img
            src={formFlower}
            alt="flower"
            className="RSVPInvitation-formFlower"
          />

          <h3 className="RSVPInvitation-formTitle">
            Will you attend?
          </h3>

          <div className="RSVPInvitation-radioGroup">
            <label>
              <input type="radio" name="attend" />
              Accept with pleasure
            </label>
            <label>
              <input type="radio" name="attend" />
              Decline with regret
            </label>
          </div>

          <input
            type="text"
            placeholder="Complete Name"
            className="RSVPInvitation-input"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="RSVPInvitation-input"
          />

          <input
            type="number"
            placeholder="Number of Guests"
            className="RSVPInvitation-input"
          />

          <textarea
            placeholder="Notes"
            className="RSVPInvitation-textarea"
          ></textarea>

          <button className="RSVPInvitation-button">
            Submit Now
          </button>

          <img
            src={leafRight}
            alt="leaf"
            className="RSVPInvitation-leaf RSVPInvitation-leafRight"
          />
        </div>
      </div>
    </section>
  );
};

export default RSVPInvitation;