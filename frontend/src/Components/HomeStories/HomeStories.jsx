import React, { useState, useEffect, useRef } from "react";
import "./HomeStories.css";

import frame from "../../assets/story-frame.webp";
import ornament from "../../assets/TwinFlower-1.webp";
import decorLeft from "../../assets/flowers-17.webp";
import decorRight from "../../assets/flowers-16.webp";
import frameFlowerTop from "../../assets/Iconflower-1.webp";
import img1 from "../../assets/Page-14.webp";

/* ===== DATA ===== */
const data = [
  { name:"Jessica & Romin",subtitle:"Rustic Wedding - December 20, 2024",text:"I’m filled with joy and excitement to be marrying the love of my life I’m filled with joy and excitement to be marrying the love of my life.",image:img1},
  { name:"Olivia & Ethan",subtitle:"Garden Wedding - March 12, 2024",text:"Our wedding day was magical. Every moment felt like a dream.I’m filled with joy and excitement to be marrying the love of my life",image:img1},
  { name:"Sophia & Daniel",subtitle:"Beach Wedding - July 08, 2024",text:"Ocean sunset and love created unforgettable memories.I’m filled with joy and excitement to be marrying the love of my life",image:img1},
  { name:"Emma & Lucas",subtitle:"Classic Wedding - October 02, 2024",text:"A timeless celebration surrounded by family and love.I’m filled with joy and excitement to be marrying the love of my life",image:img1},
  { name:"Isabella & Noah",subtitle:"Luxury Wedding - January 18, 2025",text:"Elegant, warm and unforgettable story.I’m filled with joy and excitement to be marrying the love of my life",image:img1}
];

/* ===== CLONE (IMPORTANT) ===== */
const slides = [data[data.length-1], ...data, data[0]];

const HomeStories = () => {

  const [index,setIndex] = useState(1); // start at 1
  const [noAnim,setNoAnim] = useState(false);
  const trackRef = useRef();

  const next = ()=> setIndex(i=> i+1);
  const prev = ()=> setIndex(i=> i-1);

  /* auto */
  useEffect(()=>{
    const t=setInterval(next,5000);
    return ()=>clearInterval(t);
  },[]);

  /* infinite correction */
  useEffect(()=>{

    if(index===slides.length-1){
      setTimeout(()=>{
        setNoAnim(true);
        setIndex(1);
      },800);
    }

    if(index===0){
      setTimeout(()=>{
        setNoAnim(true);
        setIndex(slides.length-2);
      },800);
    }

  },[index]);

  /* re-enable animation */
  useEffect(()=>{
    if(noAnim){
      requestAnimationFrame(()=> setNoAnim(false));
    }
  },[noAnim]);

  return (
    <section className="HomeStories">

      <img src={decorLeft} className="HomeStories__bg HomeStories__bg--left HomeStories__float" alt="" />
      <img src={decorRight} className="HomeStories__bg HomeStories__bg--right HomeStories__float" alt="" />
      <img src={decorRight} className="HomeStories__bg HomeStories__bg--bottomLeft HomeStories__float" alt="" />

      {/* header */}
      <div className="HomeStories__header">
        <span className="HomeStories__label">GET INSPIRED</span>
        <h2 className="HomeStories__title">Wedding Stories</h2>
        <img src={ornament} className="HomeStories__ornament" alt="" />
      </div>

      {/* slider */}
      <div className="HomeStories__slider">
        <div
          ref={trackRef}
          className="HomeStories__track"
          style={{
            transform:`translateX(-${index*100}%)`,
            transition: noAnim ? "none" : "transform .8s cubic-bezier(.22,.61,.36,1)"
          }}
        >
          {slides.map((item,i)=>(
            <div className="HomeStories__slide" key={i}>
              <div className="HomeStories__content">

                <div className="HomeStories__left">
                  <h3 className="HomeStories__names">{item.name}</h3>
                  <p className="HomeStories__subtitle">{item.subtitle}</p>

                  <div className="HomeStories__video">
                    <div className="HomeStories__videoCircle">▶</div>
                    <span>Watch video</span>
                  </div>
                </div>

                <div className="HomeStories__center">
                  <img src={frame} className="HomeStories__frame" alt="" />
                  <img src={item.image} className="HomeStories__photo" alt="" />
                  <img src={frameFlowerTop} className="HomeStories__frameFlower HomeStories__frameFlower--top" alt="" />
                </div>

                <div className="HomeStories__right">
                  <p className="HomeStories__quote">“ {item.text} ”</p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* arrows */}
      <div className="HomeStories__nav">
        <button onClick={prev} className="HomeStories__arrow">←</button>
        <button onClick={next} className="HomeStories__arrow">→</button>
      </div>

    </section>
  );
};

export default HomeStories;