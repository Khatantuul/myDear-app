import React from 'react'
import './hero-section.css';


const Hero = () => {
  return (
    <section class='hero-section'>
      {/* <NavBar/> */}
      <div className="section-content-wrapper">
        <div className="section-content">
          <div className="hero-title">
            <h1>Greatest gift to your child</h1>
          </div>
          <div className="hero-text">
            <p>Create a collection of cherished memories and 
                moments that have shaped their childhood. From the moment they were born, keep their journey with photos, notes, and 
                  memory box. Surprise them on their 18th birthday</p>
          </div>
          {/* <div class="link"> */}
            <div className="getstarted-link-wrapper">
              <a href='http://localhost:3000/signup' class="getstarted-link">Get Started</a>
            </div>
          {/* </div> */}
          <div className="hero-img-wrapper">
            <img src="/assets/hero.jpeg" alt="hero" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero