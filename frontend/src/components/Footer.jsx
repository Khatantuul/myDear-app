import React from 'react';
import './footer.css';
import {VolunteerActivismTwoTone} from '@mui/icons-material';

const Footer = () => {
  return (
    <section class='footer-section-wrapper'>
        <footer className="footer-section">
            <div className="footer-content">
                <div className="catchphrase-wrapper">
                    <VolunteerActivismTwoTone />
                    <span>Creating memories, Sharing love</span>
                </div>
                <div className="brand-wrapper">
                    <span>&#169;</span>
                    <p>MyDear</p>
                </div>
            </div>
        </footer>
    </section>
  )
}

export default Footer