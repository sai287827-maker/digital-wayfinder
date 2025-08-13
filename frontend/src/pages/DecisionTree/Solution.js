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
 
  // Handle generate dashboard
  const handleGenerateDashboard = async () => {
    try {
      if (selectedSolutions.length === 0) {
        setError('Please select at least one solution before generating dashboard.');
        setTimeout(() => setError(null), 3000);
        return;
      }
      setLoading(true);
      await apiPost('api/decision-tree/functional-scope/solution/save', {
        selectedSolutions,
        searchQuery,
        timestamp: new Date().toISOString()
      });
      navigate('/decision-tree/dashboard', {
        state: {
          fromSolution: true,
          selectedData: {
            selectedSolutions,
            searchQuery,
            timestamp: new Date().toISOString()
          }
        }
      });
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
    </div>
  );
};
 
export default Solution;