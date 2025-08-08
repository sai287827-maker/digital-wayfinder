import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './FinalPage.css';
import dashboardImage from "../../assets/dashboard.png";

function FinalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { selectedArea, selectedSystem } = location.state || {};

  const handleStartOver = () => {
    navigate('/digital-wayfinder/functional-area');
  };

  const handleGoToDashboard = () => {
    // Navigate to actual dashboard or home
    navigate('/dashboard');
  };

  return (
    <div className="final-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <span>Digital Wayfinder</span> &gt; <span>Complete</span>
      </div>

      <div className="tabs">
        <div className="tab completed">FUNCTIONAL AREA</div>
        <div className="tab completed">INDUSTRY TYPE</div>
        <div className="tab active">WMS SYSTEM</div>
      </div>

      <div className="content-area">
        <div className="content-left">
          <div className="completion-container">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#10B981"/>
                <path d="M20 32L28 40L44 24" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h1>Configuration Complete!</h1>
            <p className="subtitle">Your digital wayfinder setup is now ready</p>

            <div className="selection-summary">
              <h3>Your Selections:</h3>
              <div className="selection-item">
                <strong>Functional Area:</strong> 
                <span>{selectedArea?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not selected'}</span>
              </div>
              <div className="selection-item">
                <strong>System Type:</strong> 
                <span>{selectedSystem?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not selected'}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button className="secondary-button" onClick={handleStartOver}>
                Start Over
              </button>
              <button className="primary-button" onClick={handleGoToDashboard}>
                Go to Dashboard
              </button>
            </div>
          </div>

          <div className="progress-footer">
            <div className="progress-text">Completed step 3 of 3</div>
          </div>
        </div>

        <div className="content-right">
          <div className="preview-container">
            <img 
              src={dashboardImage} 
              alt="Dashboard Preview" 
              className="dashboard-preview" 
            />
            <div className="preview-overlay">
              <div className="overlay-content">
                <h4>Your Customized Dashboard</h4>
                <p>Based on your selections, your dashboard has been configured for optimal workflow.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinalPage;