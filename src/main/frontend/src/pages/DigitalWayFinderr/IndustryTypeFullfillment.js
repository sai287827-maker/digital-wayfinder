import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './IndustryTypeFullfillment.css';

// Import icons - you'll need to add these images to your assets folder
import warehouseManagementImg from '../../assets/warehouse-management.png';
import orderManagementImg from '../../assets/order-management.png';
import transportationManagementImg from '../../assets/transportation-management.png';
import dashboardImage from "../../assets/dashboard.png";

function IndustryTypeFullfillment() {
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
  // Navigate to the appropriate system page or final page
  if (selectedSystem === 'warehouse-management') {
    navigate('/digital-wayfinder/wms-system', {
      state: {
        selectedArea: selectedFunctionalArea,
        selectedSystem: selectedSystem
      }
    });
  } else if (selectedSystem === 'order-management') {
    navigate('/digital-wayfinder/wms-system', {
      state: {
        selectedArea: selectedFunctionalArea,
        selectedSystem: selectedSystem
      }
    });
  } else if(selectedSystem === 'transportation-management') {
    navigate('/digital-wayfinder/wms-system', {
      state: {
        selectedArea: selectedFunctionalArea,
        selectedSystem: selectedSystem
      }
    });
  } 
};
    // Navigate to the next step or wms page
  //   if(selectedSystem ==='warehouse-management'){
  //   navigate('/digital-wayfinder/wms-system', {
  //     state: {
  //       selectedArea: selectedFunctionalArea,
  //       selectedSystem: selectedSystem
  //     }
  //   });
  // } else{
  //   navigate('/digital-wayfinder/final', {
  //       state: {
  //         selectedArea: selectedFunctionalArea,
  //         selectedSystem: selectedSystem
        
  //       }
  //     });
  //   }
  // };


  const handlePrevious = () => {
    navigate('/digital-wayfinder/functional-area');
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
      id: 'order-management',  
      title: 'Order Management System',
      description: 'The process of tracking, processing, and fulfilling customer orders from placement to delivery',
      image: orderManagementImg
    },
    {
      id: 'transportation-management',
      title: 'Transportation Management System', 
      description: 'The movement of goods from one location to another within the supply chain',
      image: transportationManagementImg
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
        <Link to="/">Home</Link> &gt; <span>Digital Wayfinder</span>
      </div>

      <div className="tabs">
        <div className="tab">Functional Area</div>
        <div className="tab active">Sub Functional Area</div>
        <div className="tab">System</div>
      </div>

      <div className="content-area">
        <div className="content-left">
          <h1>Select a Sub Functional Area</h1>
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
            <div className="progress-text">Completed step 1 of 3</div>
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

export default IndustryTypeFullfillment;