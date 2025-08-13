import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgnosticSolution.css';
import { apiGet, apiPost } from '../../api';

const AgnosticSolution = () => {
  const navigate = useNavigate();
  const [solutionData, setSolutionData] = useState([]);
  const [selectedSolutions, setSelectedSolutions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAgnosticSolutions() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet('api/decision-tree/agnostic-solution/all');
        setSolutionData(data);
      } catch (err) {
        setError('Failed to fetch agnostic solutions.');
      } finally {
        setLoading(false);
      }
    }
    fetchAgnosticSolutions();
  }, []);

  // Filter solutions based on search query
  const getFilteredSolutions = () => {
    if (!searchQuery) return solutionData;
    return solutionData.filter(solution =>
      solution.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.platformName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.category?.toLowerCase().includes(searchQuery.toLowerCase())
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
    const allFilteredIds = filteredSolutions.map(solution => solution.id || solution.platformName);
    const allSelected = allFilteredIds.every(id => selectedSolutions.includes(id));
    
    if (allSelected) {
      // Deselect all filtered solutions
      setSelectedSolutions(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      // Select all filtered solutions (merge with existing selections)
      setSelectedSolutions(prev => [...new Set([...prev, ...allFilteredIds])]);
    }
  };

  // Handle previous button
  const handlePrevious = () => {
    navigate('/decision-tree/agnostic-decision-criteria');
  };

  // Handle generate dashboard
  const handleGenerateReport = async () => {
    try {
      if (selectedSolutions.length === 0) {
        setError('Please select at least one agnostic solution before generating the report.');
        setTimeout(() => setError(null), 3000);
        return;
      }
      setLoading(true);
      await apiPost('api/decision-tree/agnostic-solution/save', {
        selectedSolutions,
        searchQuery,
        timestamp: new Date().toISOString()
      });
      navigate('/decision-tree/agnostic-daashboard', {
        state: {
          fromAgnosticSolution: true,
          selectedData: {
            selectedSolutions,
            searchQuery,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      setError('Failed to generate agnostic report. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Check if all filtered solutions are selected
  const filteredSolutions = getFilteredSolutions();
  const allFilteredSelected = filteredSolutions.length > 0 && 
    filteredSolutions.every(solution => selectedSolutions.includes(solution.id || solution.platformName));

  return (
    <div className="agnostic-solution-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="breadcrumb-content">
          <span className="breadcrumb-link">Home</span>
          <span>›</span>
          <span className="breadcrumb-link">Decision Tree</span>
          <span>›</span>
          <span className="breadcrumb-link">Solution</span>
        </div>
      </div>
      
      <div className="main-layout">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          <h2 className="sidebar-title">Solution Selection</h2>
          <p className="sidebar-description">
            Technology-agnostic framework for evaluating and selecting solutions
            based on capabilities rather than specific platforms or vendors.
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
              <span className="step-text completed">Review</span>
            </div>
            {/* <div className="step-item">
              <div className="step-circle completed">
                <svg className="step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="step-text completed">Solution</span>
            </div> */}
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
                placeholder="Search agnostic solutions..."
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
          <div className="agnostic-solution-section">
            <div className="agnostic-solution-header">
              <h1 className="agnostic-solution-title">Agnostic Solution</h1>
              <div className="agnostic-solution-controls">
                <span className="agnostic-solution-subtitle">
                  Select Solution(s) ({selectedSolutions.length})
                </span>
                <button
                  className="select-all---button"
                  onClick={handleSelectAll}
                >
                  {allFilteredSelected ? 'Deselect all' : 'Select all'}
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
            <div className="agnostic-solutions-list">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Loading agnostic solutions...</div>
                </div>
              ) : getFilteredSolutions().map((solution, index) => (
                <div
                  key={solution.id || solution.platformName || index}
                  className={`agnostic-solution-row ${selectedSolutions.includes(solution.id || solution.platformName) ? 'selected' : ''}`}
                  onClick={() => handleSolutionSelect(solution.id || solution.platformName)}
                >
                  <div className="agnostic-solution-checkbox-container">
                    <input
                      type="checkbox"
                      checked={selectedSolutions.includes(solution.id || solution.platformName)}
                      onChange={() => handleSolutionSelect(solution.id || solution.platformName)}
                      className="agnostic-solution-checkbox"
                    />
                  </div>
                  <div className="agnostic-solution-content">
                    <div className="agnostic-solution-info">
                      <div className="agnostic-solution-name-container">
                        <h3 className="agnostic-solution-name">
                          {solution.name || solution.platformName}
                        </h3>
                        {solution.category && (
                          <span className="agnostic-solution-category">{solution.category}</span>
                        )}
                      </div>
                      {solution.description && (
                        <p className="agnostic-solution-description">{solution.description}</p>
                      )}
                      {solution.capabilities && solution.capabilities.length > 0 && (
                        <div className="agnostic-solution-capabilities">
                          {solution.capabilities.slice(0, 3).map((capability, idx) => (
                            <span key={idx} className="capability-tag">
                              {capability}
                            </span>
                          ))}
                          {solution.capabilities.length > 3 && (
                            <span className="capability-tag more">
                              +{solution.capabilities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {solution.platformImageUrl && (
                      <div className="agnostic-solution-logo-container">
                        <img
                          src={solution.platformImageUrl}
                          alt={solution.platformName || solution.name}
                          className="agnostic-solution-logo"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* No results message */}
            {!loading && getFilteredSolutions().length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No agnostic solutions found</h3>
                <p>Try adjusting your search criteria or check back later for more options.</p>
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
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgnosticSolution;