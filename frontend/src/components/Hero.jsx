import React, { useEffect, useState } from "react";
import "./hero-section.css";
import {VolunteerActivismTwoTone} from '@mui/icons-material';


const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scale = Math.min(1 + scrollY / 250, 4); 

  return (
    <div className="scroll-container">
      <div className="section-content">
        <div className="left-area">
          <div className="hero-title">
            <h1>Greatest gift to your child</h1>
          </div>
          <div className="hero-text">
            <p>
              Create a collection of cherished memories and moments that have
              shaped their childhood. From the moment they were born, keep their
              journey with photos, notes, and memory box. Surprise them on their
              18th birthday
            </p>
          </div>

          <div className="getstarted-link-wrapper">
            <a href="http://localhost:3000/signup" class="getstarted-link">
              Get Started
            </a>
          </div>
        </div>
        <div className="hero-img-wrapper">
          <img src="/assets/hero.jpeg" alt="hero" />
        </div>
      </div>
      <div
        className="circle"
        style={{
          transform: `translate(-50%, -10%) scale(${scale})`,
        }}
      ></div>
      <div className="how-works-wrapper">
        <p>How it works</p>
      </div>
      <div className="content-wrapper">
        <div className="step1-num">
          <img src="../../assets/number1.svg" alt="step1 num"/>
          <span style={{ color: "white" }}>Set up & start capturing</span>
        </div>
        <div className="step1">
        <div className="step1-img">
            <img src="/assets/camera.svg" alt="step1"  />
          </div>
          <div className="step1-text">
           
            <p>
              Start by setting up your account so you can start creating a
              beautiful digital archive of your children's childhood moments,
              milestones, and stories
            </p>
          </div>
         
        </div>
        <div className="step2-num">
          <img src="../../assets/number2.svg" alt="step2 num" />
          <span>Document moments with notes</span>
        </div>
        <div className="step2-content-wrapper">
        <div className="step2-img">
            <img src="/assets/pen.svg" alt="step2"  />
          </div>
          <div className="step2-text-p">
            <p>
              Every photo has a story to tell. Write down those precious moments
              and organize them with tags. View your photos in album mode where
              you can flip the photos to see the notes on the back, just like a
              real photo album.
            </p>
          </div>

         
        </div>
        <div className="step3-num">
          <img src="../../assets/number3.svg" alt="step3 num"/>
          <span>Time for Surprise!</span>
        </div>
        <div className="step3-content-wrapper">
        <div className="step3-img">
            <img src="../../assets/gift.svg" alt="step3" />
          </div>
          <div className="step3-text-p">
            <p>
              When your child reaches 18, let us reveal the time capsule account
              together.
            </p>
          </div>
       
        </div>
      
      </div>
      <footer className="footer-section">
            <div className="footer-content">
                <div className="catchphrase-wrapper">
                    <VolunteerActivismTwoTone />
                    <span style={{color:"white"}}>Creating memories, Sharing love</span>
                </div>
                <div className="brand-wrapper">
                    <span>&#169;</span>
                    <p>MyDear</p>
                </div>
            </div>
        </footer>
    </div>
  );
};

export default Hero;
