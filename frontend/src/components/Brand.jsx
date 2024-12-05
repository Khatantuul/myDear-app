import React from 'react';
import './brand.css';
import {Link} from 'react-router-dom';

const Brand = () => {
  return (
    <div class='logo-wrapper'>
        <Link to='/' class='logo-link'>
            <div class='logo-text-wrapper'>
            <img src='/assets/logo.png' alt='logo'/>
            <span class='logo-text'>MyDear</span>
            </div>
        </Link>
    </div>
  )
}

export default Brand