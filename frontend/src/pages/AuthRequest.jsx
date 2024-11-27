import React from 'react';
import './authrequest.css';
import {Brand} from '../components';

const AuthRequest = () => {

  const handleClick = () => {
    window.location.href = 'http://localhost:3000/login'
  }

  return (
    <div className="main-auth-request-wrapper">
        <div className={"callback verify"}>
            <Brand />
            <p>
            Hello dear,
            <br /> Thank you for completing your registration!
            <br /> Click here and <span className="loginSpan">login</span> to
            start your journey with us. &#10084;
            </p>
            <button className="loginBtn" onClick={handleClick}>
            Login
            </button>
    </div>
    </div>
    
  )
}

export default AuthRequest