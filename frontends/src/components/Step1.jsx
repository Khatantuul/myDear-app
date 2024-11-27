import React from 'react'
import './step1.css'
 


const Step1 = ({props}) => {


  return (
    <section class='step1-section'>
      <div className="content-wrapper">
        <div className="step1-text">
          <span>Step 1</span>
          <p>Start by setting up your account so you can start creating a beautiful digital archive of your children's childhood moments, milestones, and stories</p>
        </div>
        <div className="step1-img">
          <img src='/assets/step1.jpeg' alt='step1'/>
        </div>
      </div>
    </section>
  )
}

export default Step1