import React from 'react';
import './FeatureCard.css';

function FeatureCard({ icon, title, description, buttonText, onClick }) {
  return (
    <div className="feature-card">
      <div className="icon-container">{icon}</div>
      <h2>{title}</h2>
      <div className="divider"></div>
      <p>{description}</p>
      <button className="action-button" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
}

export default FeatureCard;