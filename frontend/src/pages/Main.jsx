import React from 'react'
import {Hero, NavBar, Step1, Step2, Step3, Footer} from '../components';


const Main = () => {
  return (
    <div className="div">
        <NavBar />
        <Hero/>
        <Step1 text={'Step 1'}/>
        <Step2 />
        <Step3 />
        <Footer/>
    </div>
  )
}

export default Main