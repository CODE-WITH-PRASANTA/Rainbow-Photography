import React from "react";
import "./GetInMail.css";

const PhoneIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 16.92V20a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 2 4.18 2 2 0 0 1 4 2h3.09a1 1 0 0 1 1 .75 12.41 12.41 0 0 0 .57 1.81 1 1 0 0 1-.23 1.09L7.21 7.79a16 16 0 0 0 9 9l2.14-1.24a1 1 0 0 1 1.09-.23 12.41 12.41 0 0 0 1.81.57 1 1 0 0 1 .75 1.03z"
      fill="white"
    />
  </svg>
);

const MailIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
      stroke="white"
      strokeWidth="2"
    />
    <path
      d="M22 6L12 13L2 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const LocationIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C8.14 2 5 5.14 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.14 15.86 2 12 2Z"
      stroke="white"
      strokeWidth="2"
    />
    <circle cx="12" cy="9" r="3" fill="white" />
  </svg>
);

const GetInMail = () => {
  return (
    <section className="contact-section">
      <div className="contact-container">
        
        {/* LEFT FORM SECTION */}
        <div className="contact-form-column">
          <span className="sub-title">SEND US EMAIL</span>
          <h2 className="main-title">FEEL FREE TO WRITE</h2>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <input type="text" placeholder="Enter Name" />
              <input type="email" placeholder="Enter Email" />
            </div>

            <div className="input-group">
              <input type="text" placeholder="Enter Subject" />
              <input type="text" placeholder="Enter Phone" />
            </div>

            <textarea placeholder="Enter Message" rows="6"></textarea>

            <div className="button-group">
              <button type="submit" className="btn-send">SEND MESSAGE</button>
              <button type="reset" className="btn-reset">RESET</button>
            </div>
          </form>
        </div>

        {/* RIGHT INFO SECTION */}
        <div className="contact-info-column">
          <span className="sub-title">NEED ANY HELP?</span>
          <h2 className="main-title">GET IN TOUCH WITH US</h2>
          <p className="description">
            Lorem ipsum is simply free text available dolor sit amet consectetur 
            notted adipisicing elit sed do eiusmod tempor incididunt dolore magna.
          </p>

          <div className="info-item">
            <div className="icon-box">
              <PhoneIcon />
            </div>
            <div className="info-text">
              <h4>HAVE ANY QUESTION?</h4>
              <p>Free +92 (020)-9850</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-box">
              <MailIcon />
            </div>
            <div className="info-text">
              <h4>WRITE EMAIL</h4>
              <p>needhelp@kodesolution.com</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-box">
              <LocationIcon />
            </div>
            <div className="info-text">
              <h4>VISIT ANYTIME</h4>
              <p>66 Broklyn Golden Street, New York</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default GetInMail;