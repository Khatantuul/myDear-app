import React from 'react';
import './brand.css';

const Brand = () => {
  return (
    <div class='logo-wrapper'>
        <a href='http://localhost:3000' class='logo-link'>
            <div class='logo-text-wrapper'>
            <img src='/assets/logo.png' alt='logo'/>
            <span class='logo-text'>MyDear</span>
            </div>
        </a>
    </div>
  )
}

export default Brand