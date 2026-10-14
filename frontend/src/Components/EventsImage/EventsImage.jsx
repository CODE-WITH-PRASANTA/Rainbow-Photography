import React, { useState } from "react";
import "./Eventsimage.css";

import { GiArchBridge, GiMusicalNotes } from "react-icons/gi";
import { FaRing } from "react-icons/fa";

/* images */
import img1 from "../../assets/image-24.webp";
import img2 from "../../assets/Image-25.webp";
import img3 from "../../assets/image-26.webp";

/* DECOR IMAGE (your red floral design) */
import decor from "../../assets/Service-1.webp";

const events = [
  {
    title: "THE RECEPTION",
    img: img1,
    icon: <GiArchBridge />,
  },
  {
    title: "THE CEREMONY",
    img: img2,
    icon: <FaRing />,
  },
  {
    title: "MUSIC PARTY",
    img: img3,
    icon: <GiMusicalNotes />,
  },
];

const Eventsimage = () => {
  const [active, setActive] = useState(null);

  return (
    <section className="eventsimage-section">
      <div className="eventsimage-wrapper">

        {events.map((item, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className={`eventsimage-card
              ${i === 1 ? "eventsimage-middle" : ""}
              ${active === i ? "eventsimage-active" : ""}
            `}
          >

            {/* TOP DECOR */}
            <img
              src={decor}
              alt=""
              className="eventsimage-cardDecor eventsimage-decorTop"
            />

            <div className="eventsimage-inner">

              {/* IMAGE */}
              <div className="eventsimage-imageWrap">
                <img src={item.img} alt={item.title} />

                {/* ICON */}
                <div className="eventsimage-icon">
                  {item.icon}
                </div>
              </div>

              {/* CONTENT */}
              <h3>{item.title}</h3>

              <p>December 23, 2024 - Sunday</p>
              <p>2:00 PM – 3:30 PM</p>

              <div className="eventsimage-divider"></div>

              <p className="eventsimage-location">
                Ironic Town gnette,19 West<br />
                21th Str. NY
              </p>

              <span className="eventsimage-phone">
                +1 843-853-1810
              </span>

            </div>

            {/* BOTTOM DECOR */}
            <img
              src={decor}
              alt=""
              className="eventsimage-cardDecor eventsimage-decorBottom"
            />

          </div>
        ))}

      </div>
    </section>
  );
};

export default Eventsimage;