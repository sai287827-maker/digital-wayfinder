//THIS IS THE CODE FOR WMS OPTIONS ONLY FOR 1 OPTION----

// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import './WmsSystem.css';

// import dashboardImage from "../../assets/dashboard.png";
// import BlueYonder from "../../assets/Blueyonder.png";
// import Korber from "../../assets/Korber.png";
// import Manhattan from "../../assets/Manhattan.png";
// import SAP from "../../assets/SAP.jpg";
// import Oracle from "../../assets/Oracle.png";


// function WmsSystem() {
//   const [selectedPlatforms, setSelectedPlatforms] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Get the selected data from the previous page
//   const selectedFunctionalArea = location.state?.selectedArea || null;
//   const selectedSystem = location.state?.selectedSystem || null;

//   const platformData = [
//     {id: 'blueyonder', name: 'BlueYonder', logo: BlueYonder },
//     {id: 'korber', name: 'KORBER', logo: Korber },
//     {id: 'manhattan', name: 'Manhattan', logo: Manhattan },
//     {id: 'sap', name: 'SAP', logo: SAP },
//     {id: 'oracle', name: 'ORACLE', logo: Oracle }
//   ];

//   const handlePlatformSelect = (platformId) => {
//     setSelectedPlatforms(prev => {
//       if (prev.includes(platformId)) {
//         const newSelection = prev.filter(id => id !== platformId);
//         if (newSelection.length === 0) {
//           setSelectAll(false);
//         }
//         return newSelection;
//       } else {
//         const newSelection = [...prev, platformId];
//         if (newSelection.length === platformData.length) {
//           setSelectAll(true);
//         }
//         return newSelection;
//       }
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedPlatforms([]);
//       setSelectAll(false);
//     } else {
//       setSelectedPlatforms(platformData.map(platform => platform.id));
//       setSelectAll(true);
//     }
//   };

//   const handlePrevious = () => {
//     // Navigate back to IndustryTypeFullfillment component
//     navigate('/digital-wayfinder/industry-type-fullfillment', {
//       state: {
//         selectedArea: selectedFunctionalArea
//       }
//     });
//   };

//   const handleFinish = () => {
//     console.log('Selected platforms:', selectedPlatforms);
//     // Navigate to final page or next step
//     navigate('/digital-wayfinder/final', {
//       state: {
//         selectedArea: selectedFunctionalArea,
//         selectedSystem: selectedSystem,
//         selectedPlatforms: selectedPlatforms
//       }
//     });
//   };

//   return (
//     <div className="wms-system-page">
//       <div className="breadcrumb">
//         <Link to="/">Home</Link> &gt; <span>Digital Wayfinder</span>
//       </div>

//       <div className="tabs">
//         <div className="tab">FUNCTIONAL AREA</div>
//         <div className="tab">SUB FUNCTIONAL AREA</div>
//         <div className="tab active">SYSTEM</div>
//       </div>

//       <div className="content-area">
//         <div className="content-left">
//           <h1>Select the WMS Platform</h1>
//           <p className="subtitle">Begin by choosing a key area</p>

//           <div className="select-all-container">
//             <button 
//               className="select-all-button"
//               onClick={handleSelectAll}
//             >
//               {selectAll ? 'Deselect all' : 'Select all'}
//             </button>
//           </div>

//           <div className="platform-cards">
//             {platformData.map((platform) => (
//               <div
//                 key={platform.id}
//                 className={`platform-card ${selectedPlatforms.includes(platform.id) ? 'selected' : ''}`}
//                 onClick={() => handlePlatformSelect(platform.id)}
//               >
//                 <div className="card-content">
//                   <input
//                     type="checkbox"
//                     checked={selectedPlatforms.includes(platform.id)}
//                     onChange={() => {}}
//                     className="platform-checkbox"
//                   />
//                   <div className="platform-logo">
//                     <img src={platform.logo} alt={platform.name} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="progress-footer">
//             <button 
//               className="previous-button"
//               onClick={handlePrevious}
//             >
//               Previous
//             </button>
//             <div className="progress-text">Completed step 2 of 3</div>
//             <button 
//               className="finish-button"
//               disabled={selectedPlatforms.length === 0}
//               onClick={handleFinish}
//             >
//               Finish
//             </button>
//           </div>
//         </div>

//         <div className="content-right">
//           <div className="preview-container">
//             <img 
//               src={dashboardImage} 
//               alt="Dashboard Preview" 
//               className="dashboard-preview" 
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default WmsSystem;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './WmsSystem.css';
import DataAndCloud from './DataAndCloud';

// Import dashboard image
import dashboardImage from "../../assets/dashboard.png";

// Import existing logos
import BlueYonder from "../../assets/Blueyonder.png";
import Korber from "../../assets/Korber.png";
import Manhattan from "../../assets/Manhattan.png";
import SAP from "../../assets/SAP.jpg";
import Oracle from "../../assets/Oracle.png";
import E2Open from "../../assets/e2open.png";
import FluentCommerce from "../../assets/fluentcommerce.png";
import IBMSterling from "../../assets/ibmsterling.png";
import VisibilityProactive from './VisibilityProactive';

function WmsSystem() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDataAndCloud, setShowDataAndCloud] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected data from the previous page
  const selectedFunctionalArea = location.state?.selectedArea || null;
  const selectedSystem = location.state?.selectedSystem || null;

  // Define platform data based on system type
  const getPlatformData = () => {
    switch(selectedSystem) {
      case 'warehouse-management':
        return [
          { id: 'blueyonder', name: 'BlueYonder', logo: BlueYonder },
          { id: 'korber', name: 'KORBER', logo: Korber },
          { id: 'manhattan', name: 'Manhattan', logo: Manhattan },
          { id: 'sap', name: 'SAP', logo: SAP },
          { id: 'oracle', name: 'ORACLE', logo: Oracle }
        ];
      case 'transportation-management':
        return [
          { id: 'oracle', name: 'ORACLE', logo: Oracle },
          { id: 'sap', name: 'SAP', logo: SAP },
          { id: 'blueyonder', name: 'BlueYonder', logo: BlueYonder },
          { id: 'manhattan', name: 'Manhattan', logo: Manhattan },
          { id: 'e2open', name: 'E2Open', logo: E2Open }
        ];
      case 'order-management':
        return [
          { id: 'manhattan', name: 'Manhattan', logo: Manhattan },
          { id: 'blueyonder', name: 'BlueYonder', logo: BlueYonder },
          { id: 'fluentcommerce', name: 'Fluent Commerce', logo: FluentCommerce },
          { id: 'sap', name: 'SAP', logo: SAP },
          { id: 'oracle', name: 'ORACLE', logo: Oracle },
          { id: 'ibmsterling', name: 'IBM Sterling Commerce', logo: IBMSterling }
        ];
      default:
        return [];
    }
  };

  // Get system title and description
  const getSystemInfo = () => {
    switch(selectedSystem) {
      case 'warehouse-management':
        return {
          title: 'Select the WMS Platform',
          description: 'Choose your Warehouse Management System platform'
        };
      case 'transportation-management':
        return {
          title: 'Select the TMS Platform',
          description: 'Choose your Transportation Management System platform'
        };
      case 'order-management':
        return {
          title: 'Select the OMS Platform',
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
    navigate('/digital-wayfinder/industry-type-fullfillment', {
      state: {
        selectedArea: selectedFunctionalArea
      }
    });
  };

  const handleFinish = () => {
    setShowDataAndCloud(true);
  };

  if (showDataAndCloud) {
    return <DataAndCloud />;
  }

  return (
    <div className="wms-system-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt; <span>Digital Wayfinder</span>
      </div>

      <div className="tabs">
        <div className="tab">Functional Area</div>
        <div className="tab">Sub Functional Area</div>
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

export default WmsSystem;