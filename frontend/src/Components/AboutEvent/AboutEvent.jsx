import React from "react";
import "./AboutEvent.css";
import { FaCheckCircle } from "react-icons/fa";

const AboutEvent = () => {
  return (
    <section className="aboutEvent-section">
      <div className="aboutEvent-container">

        {/* Heading */}
        <h2 className="aboutEvent-title">
          Here to Know About This Event
        </h2>

        {/* Paragraphs */}
        <p className="aboutEvent-text">
          Lorem ipsum, dolor sit amet consectetur, adipisicing elit.
          Asperiores, repellat aliquid. Est corrupti officiis dignissimos
          deserunt sunt minima iusto quia saepe tempora consectetur dolor
          deleniti voluptatem et, eos vitae pariatur molestiae odit quos
          enim voluptas nobis ullam voluptatem cum. 
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti corrupti quisquam nemo, optio adipisci necessitatibus id, quo velit nulla ad possimus qui, enim similique illo commodi dolorum eius? Suscipit, ea.
        </p>

        <p className="aboutEvent-text">
          Beyond more stoic this along goodness hey this this wow manatee
          mongoose one as since a far flustered impressive manifest Lorem
          ipsum dolor sit amet, consectetur adipisicing elit. Nostrum illo
          ea ad, nam quisquam optio vel tempora, minus placeat, ut nisi
          quam quos laboriosam eos quibusdam cum atque suscipit quod
          dignissimos magni doloribus facere eius soluta possimus.
        </p>

        {/* Checklist */}
        <div className="aboutEvent-list">
          <div className="aboutEvent-item">
            <FaCheckCircle className="aboutEvent-icon" />
            <span>Lorem ipsum dolor amet consectetur adipisicing elit</span>
          </div>

          <div className="aboutEvent-item">
            <FaCheckCircle className="aboutEvent-icon" />
            <span>Vitae pariatur molestiae odit quos enim</span>
          </div>

          <div className="aboutEvent-item">
            <FaCheckCircle className="aboutEvent-icon" />
            <span>Beyond more stoic this along goodness hey this</span>
          </div>

          <div className="aboutEvent-item">
            <FaCheckCircle className="aboutEvent-icon" />
            <span>Officiis autem similique sequi labore</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutEvent;