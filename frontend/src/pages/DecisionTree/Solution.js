// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Solution.css';
// import { apiGet, apiPost } from '../../api';
 
// const Solution = () => {
//   const navigate = useNavigate();
//   const [solutionData, setSolutionData] = useState([]);
//   const [selectedSolutions, setSelectedSolutions] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
 
//   useEffect(() => {
//     async function fetchSolutions() {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await apiGet(`api/decision-tree/functional-scope/solution/all?functionalSubArea=${encodeURIComponent('Warehouse Management System')}`);
//         setSolutionData(data);
//       } catch (err) {
//         setError('Failed to fetch solutions.');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchSolutions();
//   }, []);
 
//   // Filter solutions based on search query
//   const getFilteredSolutions = () => {
//     if (!searchQuery) return solutionData;
//     return solutionData.filter(solution =>
//       solution.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };
 
//   // Handle solution selection
//   const handleSolutionSelect = (solutionId) => {
//     setSelectedSolutions(prev => {
//       if (prev.includes(solutionId)) {
//         return prev.filter(id => id !== solutionId);
//       } else {
//         return [...prev, solutionId];
//       }
//     });
//   };
 
//   // Handle select all
//   const handleSelectAll = () => {
//     const filteredSolutions = getFilteredSolutions();
//     const allFilteredIds = filteredSolutions.map(solution => solution.id);
//     if (selectedSolutions.length === allFilteredIds.length) {
//       setSelectedSolutions([]);
//     } else {
//       setSelectedSolutions(allFilteredIds);
//     }
//   };
 
//   // Handle previous button
//   const handlePrevious = () => {
//     navigate('/decision-tree/decision-criteria');
//   };
 
//   // Handle generate dashboard
//   const handleGenerateDashboard = async () => {
//     try {
//       if (selectedSolutions.length === 0) {
//         setError('Please select at least one solution before generating dashboard.');
//         setTimeout(() => setError(null), 3000);
//         return;
//       }
//       setLoading(true);
//       await apiPost('api/decision-tree/functional-scope/solution/save', {
//         selectedSolutions,
//         searchQuery,
//         timestamp: new Date().toISOString()
//       });
//       navigate('/decision-tree/dashboard', {
//         state: {
//           fromSolution: true,
//           selectedData: {
//             selectedSolutions,
//             searchQuery,
//             timestamp: new Date().toISOString()
//           }
//         }
//       });
//     } catch (error) {
//       setError('Failed to generate dashboard. Please try again.');
//       setTimeout(() => setError(null), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   // Example: Mapping only platformImageUrl for Warehouse Management System
//   const warehouseManagementImages = solutionData
//     .filter(item => item.functionalSubArea === "Warehouse Management System")
//     .map(item => item.platformImageUrl);
 
//   console.log(warehouseManagementImages);
//   // Output: Array
 
//   return (
//     <div className="solution-container">
//       {/* Breadcrumb */}
//       <div className="breadcrumb">
//         <div className="breadcrumb-content">
//           <span className="breadcrumb-link">Home</span>
//           <span>›</span>
//           <span className="breadcrumb-link">Decision Tree</span>
//           <span>›</span>
//           <span className="breadcrumb-current">Solution</span>
//         </div>
//       </div>
//       <div className="main-layout">
//         {/* Left Sidebar */}
//         <div className="left-sidebar">
//           <h2 className="sidebar-title">Functional Scope</h2>
//           <p className="sidebar-description">
//             Structured framework for selecting functional requirements,
//             prioritising them based on different measures for informed
//             decision-making.
//           </p>
//           {/* Vertical line connecting all steps */}
//           <div className="step-line"></div>
//           {/* Step indicators */}
//           <div className="steps-container">
//             <div className="step-item">
//               <div className="step-circle completed">
//                 <svg className="step-check" viewBox="0 0 24 24" fill="none">
//                   <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </div>
//               <span className="step-text completed">Functional Scope</span>
//             </div>
//             <div className="step-item">
//               <div className="step-circle completed">
//                 <svg className="step-check" viewBox="0 0 24 24" fill="none">
//                   <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </div>
//               <span className="step-text completed">Non Functional Scope</span>
//             </div>
//             <div className="step-item">
//               <div className="step-circle completed">
//                 <svg className="step-check" viewBox="0 0 24 24" fill="none">
//                   <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </div>
//               <span className="step-text completed">Decision Criteria</span>
//             </div>
//             <div className="step-item">
//               <div className="step-circle active">4</div>
//               <span className="step-text active">Solution</span>
//             </div>
//           </div>
//         </div>
//         {/* Main Content */}
//         <div className="main-content">
//           {/* Header with search */}
//           <div className="content-header">
//             <div className="search-container">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-input"
//               />
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={2}
//                 stroke="currentColor"
//                 className="search-icon"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
//               </svg>
//             </div>
//           </div>
//           {/* Solution Section */}
//           <div className="solution-section">
//             <div className="solution-header">
//               <h1 className="solution-title">Solution</h1>
//               <div className="solution-controls">
//                 <span className="solution-subtitle">Select Solution(s)</span>
//                 <button
//                   className="select-all--button"
//                   onClick={handleSelectAll}
//                 >
//                   Select all
//                 </button>
//               </div>
//             </div>
//             {/* Error Message */}
//             {error && (
//               <div className="error-message">
//                 {error}
//               </div>
//             )}
//             {/* Solutions Vertical List Layout */}
//             <div className="solutions-list">
//               {loading ? (
//                 <div className="loading-text">Loading...</div>
//               ) : getFilteredSolutions().map((solution) => (
//                 <div
//                   key={solution.id || solution.platformName}
//                   className={`solution-row ${selectedSolutions.includes(solution.id || solution.platformName) ? 'selected' : ''}`}
//                   onClick={() => handleSolutionSelect(solution.id || solution.platformName)}
//                 >
//                   <div className="solution-checkbox-container">
//                     <input
//                       type="checkbox"
//                       checked={selectedSolutions.includes(solution.id || solution.platformName)}
//                       onChange={() => handleSolutionSelect(solution.id || solution.platformName)}
//                       className="solution-checkbox"
//                     />
//                   </div>
//                   <div className="solution-content">
//                     <div className="solution-logo-container">
//                       {solution.platformImageUrl && (
//                         <img
//                           src={solution.platformImageUrl}
//                           alt={solution.platformName || solution.name}
//                           className="solution-logo"
//                         />
//                       )}
//                       {!solution.platformImageUrl && (
//                         <span className="solution-name">{solution.platformName || solution.name}</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {/* No results message */}
//             {!loading && getFilteredSolutions().length === 0 && (
//               <div className="no-results">
//                 No solutions found matching your search.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {/* Footer */}
//       <div className="footer">
//         <div className="footer-content">
//           <button
//             className="previous-button"
//             onClick={handlePrevious}
//             disabled={loading}
//           >
//             Previous
//           </button>
//           <button
//             className="generate-button"
//             onClick={handleGenerateDashboard}
//             disabled={loading}
//           >
//             {loading ? 'Generating...' : 'Generate Dashboard'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default Solution;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Solution.css';
import { apiGet, apiPost } from '../../api';
 
const Solution = () => {
  const navigate = useNavigate();
  const [solutionData, setSolutionData] = useState([]);
  const [selectedSolutions, setSelectedSolutions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  // Power BI overlay state and functions
  const [showOverlay, setShowOverlay] = useState(false);
 
  const redirectToReport = () => {
    window.location.href =
    "https://app.powerbi.com/reportEmbed?reportId=05fa398e-8b43-46b6-ad04-bfd079df067f&appId=cf916295-c334-463b-ae2e-98fa9e4e47a1&autoAuth=true&ctid=e0793d39-0939-496d-b129-198edd916feb";
  };
 
  const openOverlay = () => {
    setShowOverlay(true);
  };
 
  const closeOverlay = () => {
    setShowOverlay(false);
  };
 
  useEffect(() => {
    async function fetchSolutions() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet(`api/decision-tree/functional-scope/solution/all?functionalSubArea=${encodeURIComponent('Warehouse Management System')}`);
        setSolutionData(data);
      } catch (err) {
        setError('Failed to fetch solutions.');
      } finally {
        setLoading(false);
      }
    }
    fetchSolutions();
  }, []);
 
  // Filter solutions based on search query
  const getFilteredSolutions = () => {
    if (!searchQuery) return solutionData;
    return solutionData.filter(solution =>
      solution.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
 
  // Handle solution selection
  const handleSolutionSelect = (solutionId) => {
    setSelectedSolutions(prev => {
      if (prev.includes(solutionId)) {
        return prev.filter(id => id !== solutionId);
      } else {
        return [...prev, solutionId];
      }
    });
  };
 
  // Handle select all
  const handleSelectAll = () => {
    const filteredSolutions = getFilteredSolutions();
    const allFilteredIds = filteredSolutions.map(solution => solution.id);
    if (selectedSolutions.length === allFilteredIds.length) {
      setSelectedSolutions([]);
    } else {
      setSelectedSolutions(allFilteredIds);
    }
  };
 
  // Handle previous button
  const handlePrevious = () => {
    navigate('/decision-tree/decision-criteria');
  };
 
  // Handle generate dashboard - modified to show Power BI report
  const handleGenerateDashboard = async () => {
    try {
      if (selectedSolutions.length === 0) {
        setError('Please select at least one solution before generating dashboard.');
        setTimeout(() => setError(null), 3000);
        return;
      }
      setLoading(true);
     
      // Save the selected solutions data via API
      await apiPost('api/decision-tree/functional-scope/solution/save', {
        selectedSolutions,
        searchQuery,
        timestamp: new Date().toISOString()
      });
     
      // Show the Power BI report overlay instead of navigating
      setShowOverlay(true);
     
    } catch (error) {
      setError('Failed to generate dashboard. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };
 
  // Example: Mapping only platformImageUrl for Warehouse Management System
  const warehouseManagementImages = solutionData
    .filter(item => item.functionalSubArea === "Warehouse Management System")
    .map(item => item.platformImageUrl);
 
  console.log(warehouseManagementImages);
  // Output: Array
 
  return (
    <div className="solution-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="breadcrumb-content">
          <span className="breadcrumb-link">Home</span>
          <span>›</span>
          <span className="breadcrumb-link">Decision Tree</span>
          <span>›</span>
          <span className="breadcrumb-current">Solution</span>
        </div>
      </div>
      <div className="main-layout">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          <h2 className="sidebar-title">Functional Scope</h2>
          <p className="sidebar-description">
            Structured framework for selecting functional requirements,
            prioritising them based on different measures for informed
            decision-making.
          </p>
          {/* Vertical line connecting all steps */}
          <div className="step-line"></div>
          {/* Step indicators */}
          <div className="steps-container">
            <div className="step-item">
              <div className="step-circle completed">
                <svg className="step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="step-text completed">Functional Scope</span>
            </div>
            <div className="step-item">
              <div className="step-circle completed">
                <svg className="step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="step-text completed">Non Functional Scope</span>
            </div>
            <div className="step-item">
              <div className="step-circle completed">
                <svg className="step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="step-text completed">Decision Criteria</span>
            </div>
            <div className="step-item">
              <div className="step-circle active">4</div>
              <span className="step-text active">Solution</span>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="main-content">
          {/* Header with search */}
          <div className="content-header">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="search-icon"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
          {/* Solution Section */}
          <div className="solution-section">
            <div className="solution-header">
              <h1 className="solution-title">Solution</h1>
              <div className="solution-controls">
                <span className="solution-subtitle">Select Solution(s)</span>
                <button
                  className="select-all--button"
                  onClick={handleSelectAll}
                >
                  Select all
                </button>
              </div>
            </div>
            {/* Error Message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            {/* Solutions Vertical List Layout */}
            <div className="solutions-list">
              {loading ? (
                <div className="loading-text">Loading...</div>
              ) : getFilteredSolutions().map((solution) => (
                <div
                  key={solution.id || solution.platformName}
                  className={`solution-row ${selectedSolutions.includes(solution.id || solution.platformName) ? 'selected' : ''}`}
                  onClick={() => handleSolutionSelect(solution.id || solution.platformName)}
                >
                  <div className="solution-checkbox-container">
                    <input
                      type="checkbox"
                      checked={selectedSolutions.includes(solution.id || solution.platformName)}
                      onChange={() => handleSolutionSelect(solution.id || solution.platformName)}
                      className="solution-checkbox"
                    />
                  </div>
                  <div className="solution-content">
                    <div className="solution-logo-container">
                      {solution.platformImageUrl && (
                        <img
                          src={solution.platformImageUrl}
                          alt={solution.platformName || solution.name}
                          className="solution-logo"
                        />
                      )}
                      {!solution.platformImageUrl && (
                        <span className="solution-name">{solution.platformName || solution.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* No results message */}
            {!loading && getFilteredSolutions().length === 0 && (
              <div className="no-results">
                No solutions found matching your search.
              </div>
            )}
          </div>
 
          {/* Power BI Report Buttons */}
          <div style={{ marginTop: '20px', padding: '20px' }}>
            <button
              onClick={redirectToReport}
              style={{
                marginRight: '10px',
                padding: '10px 20px',
                backgroundColor: '#007acc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Temporary Report Generation
            </button>
       
            <button
              onClick={openOverlay}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Show Report in Overlay
            </button>
          </div>
        </div>
      </div>
     
      {/* Footer */}
      <div className="footer">
        <div className="footer-content">
          <button
            className="previous-button"
            onClick={handlePrevious}
            disabled={loading}
          >
            Previous
          </button>
          <button
            className="generate-button"
            onClick={handleGenerateDashboard}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Dashboard'}
          </button>
        </div>
      </div>
 
      {/* Power BI Report Overlay */}
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div style={{ position: "relative", width: "90%", height: "90%" }}>
            <iframe
              title="Power BI Report"
              src="https://app.powerbi.com/reportEmbed?reportId=05fa398e-8b43-46b6-ad04-bfd079df067f&appId=cf916295-c334-463b-ae2e-98fa9e4e47a1&autoAuth=true&ctid=e0793d39-0939-496d-b129-198edd916feb"
              style={{ width: "100%", height: "100%", border: "none" }}
              allowFullScreen
            />
            <button
              onClick={closeOverlay}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#fff",
                border: "none",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: "bold",
                borderRadius: "4px"
              }}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default Solution;