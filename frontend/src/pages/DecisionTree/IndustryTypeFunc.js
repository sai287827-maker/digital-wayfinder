import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './IndustryTypeFunc.css';
import { apiPost } from '../../api';
 
// Import icons - you'll need to add these images to your assets folder
import warehouseManagementImg from '../../assets/warehouse-management.png';
import orderManagementImg from '../../assets/order-management.png';
import transportationManagementImg from '../../assets/transportation-management.png';
import dashboardImage from "../../assets/dashboard.png";
 
function IndustryTypeFunc() {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
 
  const handleProceed = async () => {
    if (!selectedSystem) return;
    setLoading(true);
    setError(null);
    try {
      if (selectedSystem === 'warehouse-management' || selectedSystem === 'transportation-management') {
        // Industry Type API for planning
        await apiPost('api/decision-tree/industry-type/supply-chain-planning/save', {
          industryType: selectedSystem
        });
      } else if (selectedSystem === 'order-management') {
        // Sub Functional Area API for fulfillment
        await apiPost('api/digital-wayfinder/industry-type/supply-chain-fulfillment/save', {
          industryType: selectedSystem
        });
      }
      if(selectedSystem ==='warehouse-management'){
        navigate('/decision-tree/functional-scope', {
          state: {
            selectedArea: selectedFunctionalArea,
            selectedSystem: selectedSystem
          }
        });
      } else if(selectedSystem === 'transportation-management') {
        navigate('/decision-tree/transportation-functional-scope', {
          state: {
            selectedArea: selectedFunctionalArea,
            selectedSystem: selectedSystem
          }
        });
      } else {
        navigate('/decision-tree/', {
          state: {
            selectedArea: selectedFunctionalArea,
            selectedSystem: selectedSystem
          }
        });
      }
    } catch (err) {
      setError('Failed to save industry type. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 
 
  const handlePrevious = () => {
    navigate('/decision-tree/functional-area');
  };
 
  const tooltipContent = {
    'warehouse-management': 'The storage of goods in a facility until they are needed for distribution or sale. Manages inventory, location tracking, and warehouse operations.',
    'order-management': 'The process of tracking, processing, and fulfilling customer orders from placement to delivery. Handles order lifecycle and customer communications.',
    'transportation-management': 'The movement of goods from one location to another within the supply chain. Optimizes routes, manages carriers, and tracks shipments.'
  };
 
  const systemData = [
    {
      id: 'warehouse-management',
      title: 'Warehouse Management System',
      description: 'The storage of goods in a facility until they are needed for distribution or sale',
      image: warehouseManagementImg
    },
     {
      id: 'transportation-management',
      title: 'Transportation Management System',
      description: 'The movement of goods from one location to another within the supply chain',
      image: transportationManagementImg
    },
    {
      id: 'order-management',  
      title: 'Order Management System',
      description: 'The process of tracking, processing, and fulfilling customer orders from placement to delivery',
      image: orderManagementImg
    }
  ];
  // const getProgressText = () => {
  //   if (selectedSystem === 'warehouse-management') {
  //     return 'Completed step 1 of 3';
  //   }
  //   return 'Completed step 1 of 2';
  // };
 
  // const getButtonText = () => {
  //   if (selectedSystem === 'warehouse-management') {
  //     return 'Proceed';
  //   }
  //   return 'Finish';
  // };
 
  return (
    <div className="system-selection-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <span>Decision Tree</span>
      </div>
 
      <div className="tabs">
        <div className="tab">Project Information</div>
        <div className="tab">Functional Area</div>
        <div className="tab active">Sub-Functional Area</div>
      </div>
 
      <div className="content-area">
        <div className="content-left">
          <h1>Select a Sub Functional Area</h1>
          <p className="subtitle">Begin by choosing a key area</p>
 
          <div className="system-cards">
            {systemData.map((system) => {
              const isOrderManagement = system.id === 'order-management';
              return (
                <div
                  key={system.id}
                  className={`system-card ${selectedSystem === system.id ? 'selected' : ''} ${isOrderManagement ? 'disabled' : ''}`}
                  onClick={() => !isOrderManagement && handleSystemSelect(system.id)}
                  style={{
                    opacity: isOrderManagement ? 0.5 : 1,
                    pointerEvents: isOrderManagement ? 'none' : 'auto',
                    cursor: isOrderManagement ? 'not-allowed' : 'pointer'
                  }}
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
              );
            })}
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
              disabled={!selectedSystem || loading}
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
 
export default IndustryTypeFunc;