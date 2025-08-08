import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FunctionalAreaPage.css';

// Import icons
import supplyChainPlanningImg from '../../assets/supply-chain-planning.png';
import supplyChainFulfillmentImg from '../../assets/supply-chain-fulfillment.png';
import dashboardImage from "../../assets/dashboard.png";

function FunctionalAreaPage() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const navigate = useNavigate();

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
  };

  const showTooltip = (area) => {
    setTooltipVisible(area);
  };

  const hideTooltip = () => {
    setTooltipVisible(null);
  };

 const handleProceed = () => {
  if (selectedArea === 'supply-chain-planning') {
    navigate('/digital-wayfinder/industry-type-planning/', {
      state: { selectedArea }
    });
  } else if (selectedArea === 'supply-chain-fulfillment') {
    navigate('/digital-wayfinder/industry-type-fullfillment/', {
      state: { selectedArea }
    });
  }
};

  const tooltipContent = {
    'supply-chain-planning': 'Supply chain planning strategically balances supply and demand to optimize the flow of goods, services, and information from source to customer. Aligns supply, demand, and financial plans to drive strategic decision-making.',
    'supply-chain-fulfillment': 'Supply chain fulfillment focuses on the execution of orders and delivery to customers. It encompasses warehousing, order processing, inventory management, and logistics to ensure accurate and timely delivery.'
  };

  return (
    <div className="functional-area-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <span>Digital Wayfinder</span>
      </div>

      <div className="tabs">
        <div className="tab active">FUNCTIONAL AREA</div>
        <div className="tab">INDUSTRY TYPE</div>
        <div className="tab">SYSTEM</div>
      </div>

      <div className="content-area">
        <div className="content-left">
          <h1>Select a Functional Area</h1>
          <p className="subtitle">Begin by choosing a key area</p>

          <div className="area-cards">
            <div 
              className={`area-card ${selectedArea === 'supply-chain-planning' ? 'selected' : ''}`}
              onClick={() => handleAreaSelect('supply-chain-planning')}
            >
              <div className="card-content">
                <div className="card-image">
                  <img src={supplyChainPlanningImg} alt="Supply Chain Planning" />
                </div>
                <div className="card-text">
                  <h3>Supply Chain Planning</h3>
                  <p>The process of optimizing the flow of goods and resources to meet demand efficiently.</p>
                </div>
              </div>
              <div 
                className="info-icon"
                onMouseEnter={() => showTooltip('supply-chain-planning')}
                onMouseLeave={hideTooltip}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {tooltipVisible === 'supply-chain-planning' && (
                  // <div className="tooltip"> 
                   <div className="tooltip tooltip-top-right">
 "
                    <div className="tooltip-header">Supply Chain Planning</div>
                    <div className="tooltip-content">
                      {tooltipContent['supply-chain-planning']}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div 
              className={`area-card ${selectedArea === 'supply-chain-fulfillment' ? 'selected' : ''}`}
              onClick={() => handleAreaSelect('supply-chain-fulfillment')}
            >
              <div className="card-content">
                <div className="card-image">
                  <img src={supplyChainFulfillmentImg} alt="Supply Chain Fulfillment" />
                </div>
                <div className="card-text">
                  <h3>Supply Chain Fulfillment</h3>
                  <p>The process of delivering orders to customers accurately and on time.</p>
                </div>
              </div>
              <div 
                className="info-icon"
                onMouseEnter={() => showTooltip('supply-chain-fulfillment')}
                onMouseLeave={hideTooltip}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {tooltipVisible === 'supply-chain-fulfillment' && (
                  <div className="tooltip">
                  {/* //  <div className="tooltip tooltip-top-right"> */}
                    <div className="tooltip-header">Supply Chain Fulfillment</div>
                    <div className="tooltip-content">
                      {tooltipContent['supply-chain-fulfillment']}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional functional areas can be added here */}
          </div>

          <div className="progress-footer">
            <div className="progress-text">Completed step 0 of 3</div>
            <button 
              className="finish-button"
              disabled={!selectedArea}
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

export default FunctionalAreaPage;