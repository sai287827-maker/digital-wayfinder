
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './IndustryTypePlanParts.css';

// Import dashboard image
import dashboardImage from "../../assets/dashboard.png";

// Import existing logos
import BlueYonder from "../../assets/Blueyonder.png";
import SAP from "../../assets/SAP.jpg";
import Oracle from "../../assets/Oracle.png";
import Anaplan from "../../assets/Anaplan.png";
import O9 from "../../assets/O9.png";
import OMP from "../../assets/OMP.png";
import Kinaxis from "../../assets/Kinaxis.jpg";
import relex from "../../assets/relex.png";

function IndustryTypePlanParts() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected data from the previous page
  const selectedFunctionalArea = location.state?.selectedArea || null;
  const selectedSystem = location.state?.selectedSystem || null;

  // Define platform data based on system type
  const getPlatformData = () => {
    switch(selectedSystem) {
      case 'industry-agnostic-system':
        return [
          { id: 'sap', name: 'SAP', logo: SAP },
          { id: 'oracle', name: 'ORACLE', logo: Oracle },
          { id: 'blueyonder', name: 'BlueYonder', logo: BlueYonder },
          { id: 'o9', name: 'O9', logo: O9 },
          { id: 'OMP', name: 'OMP', logo: OMP },
          { id: 'Kinaxis', name: 'Kinaxis', logo: Kinaxis },
          { id: 'anaplan', name: 'Anaplan', logo: Anaplan }
        ];
      case 'retail-industry-specific-system':
        return [
          { id: 'blueyonder', name: 'BlueYonder', logo: BlueYonder },
          { id: 'sap', name: 'SAP', logo: SAP },
          { id: 'oracle', name: 'ORACLE', logo: Oracle },
          { id: 'relex', name: 'Relex', logo: relex },
          { id: 'anaplan', name: 'Anaplan', logo: Anaplan }
        ];
      case 'consumer-goods-industry-specific-system':
        return [
          { id: 'blueyonder', name: 'BlueYonder', logo: BlueYonder },
          { id: 'sap', name: 'SAP', logo: SAP },
          { id: 'oracle', name: 'ORACLE', logo: Oracle },
          { id: 'o9', name: 'O9', logo: O9 },
          { id: 'OMP', name: 'OMP', logo: OMP },
          { id: 'relex', name: 'Relex', logo: relex },
          { id: 'Kinaxis', name: 'Kinaxis', logo: Kinaxis }
        ];
      default:
        return [];
    }
  };

  // Get system title and description
  const getSystemInfo = () => {
    switch(selectedSystem) {
      case 'industry-agnostic-system':
        return {
          title: 'Select the Industry Platform',
          description: 'Choose your Warehouse Management System platform'
        };
      case 'retail-industry-specific-system':
        return {
          title: 'Select the Retail Industry Platform',
          description: 'Choose your Transportation Management System platform'
        };
      case 'consumer-goods-industry-specific-system':
        return {
          title: 'Select the Consumer Goods Platform',
          description: 'Choose your Order Management System platform'
        };
      default:
        return {
          title: 'Select Platform',
          description: 'Choose your system platform'
        };
    }
  };

  const platformData = getPlatformData();
  const systemInfo = getSystemInfo();

  const handlePlatformSelect = (platformId) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        const newSelection = prev.filter(id => id !== platformId);
        if (newSelection.length === 0) {
          setSelectAll(false);
        }
        return newSelection;
      } else {
        const newSelection = [...prev, platformId];
        if (newSelection.length === platformData.length) {
          setSelectAll(true);
        }
        return newSelection;
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPlatforms([]);
      setSelectAll(false);
    } else {
      setSelectedPlatforms(platformData.map(platform => platform.id));
      setSelectAll(true);
    }
  };

  const handlePrevious = () => {
    // Navigate back to IndustryTypeFullfillment component
    navigate('/digital-wayfinder/industry-type-planning', {
      state: {
        selectedArea: selectedFunctionalArea
      }
    });
  };

  const handleFinish = () => {
    console.log('Selected platforms:', selectedPlatforms);
    // Navigate to final page or next step
    navigate('/digital-wayfinder/final', {
      state: {
        selectedArea: selectedFunctionalArea,
        selectedSystem: selectedSystem,
        selectedPlatforms: selectedPlatforms
      }
    });
  };

  return (
    <div className="wms-system-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <span>Digital Wayfinder</span>
      </div>

      <div className="tabs">
        <div className="tab">Functional Area</div>
        <div className="tab">Industry Type</div>
        <div className="tab active">System</div>
      </div>

      <div className="content-area">
        <div className="content-left">
          <h1>{systemInfo.title}</h1>
          <p className="subtitle">{systemInfo.description}</p>

          <div className="select-all-container">
            <button 
              className="select-all-button"
              onClick={handleSelectAll}
            >
              {selectAll ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          <div className="platform-cards">
            {platformData.map((platform) => (
              <div
                key={platform.id}
                className={`platform-card ${selectedPlatforms.includes(platform.id) ? 'selected' : ''}`}
                onClick={() => handlePlatformSelect(platform.id)}
              >
                <div className="card-content">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={() => {}}
                    className="platform-checkbox"
                  />
                  <div className="platform-logo">
                    <img src={platform.logo} alt={platform.name} />
                  </div>
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
              disabled={selectedPlatforms.length === 0}
              onClick={handleFinish}
            >
              Finish
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

export default IndustryTypePlanParts;