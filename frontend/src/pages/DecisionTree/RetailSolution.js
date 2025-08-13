import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RetailSolution.css';
import { apiGet, apiPost } from '../../api';

const RetailSolution = () => {
  const navigate = useNavigate();
  const [solutionData, setSolutionData] = useState([]);
  const [selectedSolutions, setSelectedSolutions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRetailSolutions() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet(`api/decision-tree/functional-scope/solution/all?industryType=${encodeURIComponent('Retail Industry Specific')}`);
        setSolutionData(data);
      } catch (err) {
        setError('Failed to fetch retail solutions.');
      } finally {
        setLoading(false);
      }
    }
    fetchRetailSolutions();
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
    navigate('/decision-tree/retail-decision-criteria');
  };

  // Handle generate dashboard
  const handleGenerateReport = async () => {
    try {
      if (selectedSolutions.length === 0) {
        setError('Please select at least one retail solution before generating the report.');
        setTimeout(() => setError(null), 3000);
        return;
      }
      setLoading(true);
      await apiPost('api/decision-tree/retail-solution/save', {
        selectedSolutions,
        searchQuery,
        timestamp: new Date().toISOString()
      });
      navigate('/decision-tree/retail-dashboard', {
        state: {
          fromRetailSolution: true,
          selectedData: {
            selectedSolutions,
            searchQuery,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      setError('Failed to generate retail report. Please try again.');
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
    <div className="retail-solution-wrapper">
      {/* Breadcrumb */}
      <div className="retail-breadcrumb">
        <div className="retail-breadcrumb-inner">
          <span className="retail-breadcrumb-item">Home</span>
          <span>›</span>
          <span className="retail-breadcrumb-item">Decision Tree</span>
          <span>›</span>
          <span className="retail-breadcrumb-item">Solution</span>
        </div>
      </div>
      
      <div className="retail-main-layout">
        {/* Left Sidebar */}
        <div className="retail-left-panel">
          <h2 className="retail-panel-title">Solution Selection</h2>
          <p className="retail-panel-description">
            Retail-specific solutions tailored for commerce platforms,
            inventory management, and customer engagement systems.
          </p>
          {/* Vertical line connecting all steps */}
          <div className="retail-step-connector"></div>
          {/* Step indicators */}
          <div className="retail-steps-wrapper">
            <div className="retail-step-indicator">
              <div className="retail-step-badge completed">
                <svg className="retail-step-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="retail-step-label completed">Functional Scope</span>
            </div>
            <div className="retail-step-indicator">
              <div className="retail-step-badge completed">
                <svg className="retail-step-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="retail-step-label completed">Non Functional Scope</span>
            </div>
            <div className="retail-step-indicator">
              <div className="retail-step-badge completed">
                <svg className="retail-step-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="retail-step-label completed">Review</span>
            </div>
            <div className="retail-step-indicator">
              <div className="retail-step-badge current">4</div>
              <span className="retail-step-label current">Solution</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="retail-content-area">
          {/* Header with search */}
          <div className="retail-content-header">
            <div className="retail-search-wrapper">
              <input
                type="text"
                placeholder="Search retail solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="retail-search-field"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="retail-search-icon"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>

          {/* Solution Section */}
          <div className="retail-solutions-section">
            <div className="retail-solutions-header">
              <h1 className="retail-solutions-title">Retail Solutions</h1>
              <div className="retail-solutions-controls">
                <span className="retail-solutions-counter">
                  Selected Solutions(s) ({selectedSolutions.length})
                </span>
                <button
                  className="retail-select-all-btn"
                  onClick={handleSelectAll}
                >
                  {allFilteredSelected ? 'Deselect all' : 'Select all'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="retail-error-alert">
                {error}
              </div>
            )}

            {/* Solutions Vertical List Layout */}
            <div className="retail-solutions-grid">
              {loading ? (
                <div className="retail-loading-state">
                  <div className="retail-loading-spinner"></div>
                  <div className="retail-loading-message">Loading retail solutions...</div>
                </div>
              ) : getFilteredSolutions().map((solution, index) => (
                <div
                  key={solution.id || solution.platformName || index}
                  className={`retail-solution-card ${selectedSolutions.includes(solution.id || solution.platformName) ? 'selected' : ''}`}
                  onClick={() => handleSolutionSelect(solution.id || solution.platformName)}
                >
                  <div className="retail-solution-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={selectedSolutions.includes(solution.id || solution.platformName)}
                      onChange={() => handleSolutionSelect(solution.id || solution.platformName)}
                      className="retail-solution-checkbox"
                    />
                  </div>
                  <div className="retail-solution-body">
                    <div className="retail-solution-details">
                      <div className="retail-solution-header-info">
                        <h3 className="retail-solution-title-text">
                          {solution.name || solution.platformName}
                        </h3>
                        {solution.category && (
                          <span className="retail-solution-category-tag">{solution.category}</span>
                        )}
                      </div>
                      {solution.description && (
                        <p className="retail-solution-description-text">{solution.description}</p>
                      )}
                      {solution.capabilities && solution.capabilities.length > 0 && (
                        <div className="retail-solution-capabilities-list">
                          {solution.capabilities.slice(0, 3).map((capability, idx) => (
                            <span key={idx} className="retail-capability-badge">
                              {capability}
                            </span>
                          ))}
                          {solution.capabilities.length > 3 && (
                            <span className="retail-capability-badge extra">
                              +{solution.capabilities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {solution.platformImageUrl && (
                      <div className="retail-solution-image-wrapper">
                        <img
                          src={solution.platformImageUrl}
                          alt={solution.platformName || solution.name}
                          className="retail-solution-image"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* No results message */}
            {!loading && getFilteredSolutions().length === 0 && (
              <div className="retail-no-results">
                <div className="retail-no-results-icon">🛍️</div>
                <h3>No retail solutions found</h3>
                <p>Try adjusting your search criteria or check back later for more options.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="retail-footer">
        <div className="retail-footer-content">
          <button
            className="retail-previous-btn"
            onClick={handlePrevious}
            disabled={loading}
          >
            Previous
          </button>
          <button
            className="retail-generate-btn"
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

export default RetailSolution;