import React, { useEffect, useState } from "react";
import "./HomeScoring.css";

/* images */
import divider from "../../assets/Devider-2.webp";
import flower from "../../assets/Flower-33.webp";

const stats = [
  { number: 148, text: "Best wedding suppliers with quality products" },
  { number: 365, text: "We cover every day of the year for weddings" },
  { number: 271, text: "Types of ready-made and packaged dress" },
  { number: 184, text: "External collaborators will have a cool wedding" }
];

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / target), 10);

    const timer = setInterval(() => {
      start += Math.ceil(target / 40);
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
};

const HomeScoring = () => {
  return (
    <section className="HomeScoring">
      <div className="HomeScoring__container">

        {stats.map((item, i) => (
          <div className="HomeScoring__item" key={i}>

            {/* flower background */}
            <img src={flower} alt="" className="HomeScoring__flower" />

            <h3 className="HomeScoring__number">
              <Counter target={item.number} />
            </h3>

            <p className="HomeScoring__text">{item.text}</p>

            {/* divider except last */}
            {i !== stats.length - 1 && (
              <img src={divider} alt="" className="HomeScoring__divider" />
            )}

          </div>
        ))}

      </div>
    </section>
  );
};

export default HomeScoring;