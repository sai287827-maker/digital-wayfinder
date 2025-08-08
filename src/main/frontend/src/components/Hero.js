import React from 'react';
import './Hero.css';
// import HomePage from '../pages/HomePage.js';

function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Digital Wayfinder</h1>
        <p>
          Welcome to Digital Wayfinder, your comprehensive solution to navigate the complex world of Platform
          solutions. Our platform helps you identify gaps in your current platform solution and compare different
          tools to find the best fit for your business needs.
        </p>
        {/* <HomePage/> */}
      </div>
    </div>
  );
}

export default Hero;