import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './IndustryTypePlannD.css';

// Import icons - you'll need to add these images to your assets folder
import warehouseManagementImg from '../../assets/warehouse-management.png';
import orderManagementImg from '../../assets/order-management.png';
import transportationManagementImg from '../../assets/transportation-management.png';
import dashboardImage from "../../assets/dashboard.png";

function SystemSelectionPage() {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected functional area from the previous page
  const selectedFunctionalArea = location.state?.selectedArea || null;
  // const selectedIndustry = location.state?.selectedIndustry || null;

  const handleSystemSelect = (system) => {
    setSelectedSystem(system);
  };

  const showTooltip = (system) => {
    setTooltipVisible(system);
  };

  const hideTooltip = () => {
    setTooltipVisible(null);
  };

  const handleProceed = () => {
    // Navigate to the next step or final page
    navigate('/decision-tree/', {
      state: {
        selectedArea: selectedFunctionalArea,
        selectedSystem: selectedSystem
      }
    });
  };

  const handlePrevious = () => {
    navigate('/decision-tree/functional-area');
  };

  const tooltipContent = {
    'Industry Agnostic': 'The process of aligning supply and demand across various industries.',
    'Retail Industry Specific': 'The process of forecasting demand, managing inventory, and ensuring timely product availability to meet customer needs in retail.',
    'Consumer Goods Industry Specific': 'The process of forecasting demand, optimizing inventory and distribution for timely delivery of consumer goods.'
  };

  const systemData = [
    {
      id: 'Industry Agnostic',
      title: 'Industry Agnostic System',
      description: 'The process of aligning supply and demand across various industries.',
      image: warehouseManagementImg
    },
    {
      id: 'Retail Industry Specific',  
      title: 'Retail Industry Specific System',
      description: 'The process of forecasting demand, managing inventory, and ensuring timely product availability to meet customer needs in retail.',
      image: orderManagementImg
    },
    {
      id: 'Consumer Goods Industry Specific',
      title: 'Consumer Goods Industry Specific System', 
      description: 'The process of forecasting demand, optimizing inventory and distribution for timely delivery of consumer goods.',
      image: transportationManagementImg
    }
  ];

  return (
    <div className="system-selection-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <span>Decision Tree</span>
      </div>

      <div className="tabs">
        <div className="tab">Project Information</div>
        <div className="tab">Functional Area</div>
        <div className="tab active">Industry Type</div>
      </div>

      <div className="content-area">
        <div className="content-left">
          <h1>Select a Industry Type</h1>
          <p className="subtitle">Begin by choosing a key area</p>

          <div className="system-cards">
            {systemData.map((system) => (
              <div 
                key={system.id}
                className={`system-card ${selectedSystem === system.id ? 'selected' : ''}`}
                onClick={() => handleSystemSelect(system.id)}
              >
                <div className="card-content">
                  <div className="card-image">
                    <img src={system.image} alt={system.title} />
                  </div>
                  <div className="card-text">
                    <h3>{system.title}</h3>
                    <p>{system.description}</p>
                  </div>
                </div>
                <div 
                  className="info-icon"
                  onMouseEnter={() => showTooltip(system.id)}
                  onMouseLeave={hideTooltip}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {tooltipVisible === system.id && (
                    <div className="tooltip">
                      <div className="tooltip-header">{system.title}</div>
                      <div className="tooltip-content">
                        {tooltipContent[system.id]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="progress-footer">
            <button 
              className="previous-button"
              onClick={handlePrevious}
            >
              Previous
            </button>
            <div className="progress-text">Completed step 2 of 3</div>
            <button 
              className="finish-button"
              disabled={!selectedSystem}
              onClick={handleProceed}
            >
              Proceed
            </button>
          </div>
        </div>

        <div className="content-right">
          <div className="preview-container">
            <img 
              src={dashboardImage} 
              alt="Dashboard Preview" 
              className="dashboard-preview" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemSelectionPage;