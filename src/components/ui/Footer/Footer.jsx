
import React from 'react';
import Aurora from '../Aurora/Aurora';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-background">
                <Aurora
                    colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>

            <div className="footer-content">
                <p>
                    Designed by <a href="https://naveen-kr1.netlify.app" target="_blank" rel="noopener noreferrer" className="footer-link">Naveen Kumar</a>
                </p>
                <p className="footer-powered">
                    Powered by <a href="https://lancealot.in" target="_blank" rel="noopener noreferrer" className="footer-link">Lancealot</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
