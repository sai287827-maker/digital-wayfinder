import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './FuncAreaPage.css';
import { apiPost } from '../../api';

// Import icons
import supplyChainPlanningImg from '../../assets/supply-chain-planning.png';
import supplyChainFulfillmentImg from '../../assets/supply-chain-fulfillment.png';
import dashboardImage from "../../assets/dashboard.png";

function FuncAreaPage() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [projectType, setProjectType] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Get project data from navigation state
  useEffect(() => {
    if (location.state) {
      setProjectData(location.state.projectData);
      setProjectType(location.state.projectType);
      setSelectedArea(location.state.functionalArea || null);
    }
  }, [location.state]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
  };

  const showTooltip = (area) => {
    if (!isMobile) {
      setTooltipVisible(area);
    }
  };

  const hideTooltip = () => {
    if (!isMobile) {
      setTooltipVisible(null);
    }
  };

  const toggleTooltip = (area) => {
    if (isMobile) {
      setTooltipVisible(tooltipVisible === area ? null : area);
    }
  };
  const handlePrevious = () => {
    navigate('/decision-tree', {
      state: {
        ...location.state
      }
    });
  };
  const handleProceed = () => {
    const prev = location.state || {};

    const payload = {
      ...prev,
      functionalArea: selectedArea
    };

    if (selectedArea === 'supply-chain-planning') {
      navigate('/decision-tree/industry-type-plannD', {
        state: payload
      });
    } else if (selectedArea === 'supply-chain-fulfillment') {
      navigate('/decision-tree/industry-type-func', {
        state: payload
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
        <Link to="/">Home</Link> &gt; <span>Decision Tree</span>
      </div>

      <div className="tabs">
        <div className="tab active">Functional Area</div>
        <div className="tab">Industry Type</div>
      </div>

      <div className="content-area">
        <div className="content-left">
          <h1>Select a Functional Area</h1>
          <p className="subtitle">Begin by choosing a key area</p>

          {/* Display project information if available */}
          {projectData && (
            <div className="project-summary">
              <p><strong>Project:</strong> {projectData.clientName} ({projectType})</p>
            </div>
          )}

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
              <div className="info-icon">
                <div
                  className="tooltip-wrapper"
                  onMouseEnter={() => showTooltip('supply-chain-planning')}
                  onMouseLeave={hideTooltip}
                  onClick={() => toggleTooltip('supply-chain-planning')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16V12" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 8H12.01" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {tooltipVisible === 'supply-chain-planning' && (
                    <div className="tooltip">
                      <div className="tooltip-header">Supply Chain Planning</div>
                      <div className="tooltip-content">
                        {tooltipContent['supply-chain-planning']}
                      </div>
                    </div>
                  )}
                </div>
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
              <div className="info-icon">
                <div
                  className="tooltip-wrapper"
                  onMouseEnter={() => showTooltip('supply-chain-fulfillment')}
                  onMouseLeave={hideTooltip}
                  onClick={() => toggleTooltip('supply-chain-fulfillment')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 16V12" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 8H12.01" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {tooltipVisible === 'supply-chain-fulfillment' && (
                    <div className="tooltip">
                      <div className="tooltip-header">Supply Chain Fulfillment</div>
                      <div className="tooltip-content">
                        {tooltipContent['supply-chain-fulfillment']}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional functional areas can be added here */}
          </div>

          <div className="progress-footer">
            <button
              className="previous-button"
              onClick={handlePrevious}
            >
              Previous
            </button>
            <div className="progress-text">Completed step 1 of 3</div>
            <button
              className="finish-button"
              disabled={!selectedArea || loading}
              onClick={handleProceed}
            >
              {loading ? 'Saving...' : 'Proceed'}
            </button>
            {error && <div className="form-error">{error}</div>}
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

export default FuncAreaPage;