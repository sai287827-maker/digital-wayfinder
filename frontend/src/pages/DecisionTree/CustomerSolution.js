import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerSolution.css';
import { apiGet, apiPost } from '../../api';
 
const CustomerSolution = () => {
  const navigate = useNavigate();
  const [customerSolutionData, setCustomerSolutionData] = useState([]);
  const [selectedCustomerSolutions, setSelectedCustomerSolutions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    async function fetchCustomerSolutions() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet('api/decision-tree/functional-scope/solution/all');
        setCustomerSolutionData(data);
      } catch (err) {
        setError('Failed to fetch customer solutions.');
      } finally {
        setLoading(false);
      }
    }
    fetchCustomerSolutions();
  }, []);
 
  // Filter customer solutions based on search query
  const getFilteredCustomerSolutions = () => {
    if (!searchQuery) return customerSolutionData;
    return customerSolutionData.filter(customerSolution =>
      customerSolution.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
 
  // Handle customer solution selection
  const handleCustomerSolutionSelect = (customerSolutionId) => {
    setSelectedCustomerSolutions(prev => {
      if (prev.includes(customerSolutionId)) {
        return prev.filter(id => id !== customerSolutionId);
      } else {
        return [...prev, customerSolutionId];
      }
    });
  };
 
  // Handle select all
  const handleSelectAllCustomerSolutions = () => {
    const filteredCustomerSolutions = getFilteredCustomerSolutions();
    const allFilteredIds = filteredCustomerSolutions.map(customerSolution => customerSolution.id);
    if (selectedCustomerSolutions.length === allFilteredIds.length) {
      setSelectedCustomerSolutions([]);
    } else {
      setSelectedCustomerSolutions(allFilteredIds);
    }
  };
 
  // Handle previous button
  const handlePreviousStep = () => {
    navigate('/decision-tree/decision-criteria');
  };
 
  // Handle generate dashboard
  const handleGenerateCustomerDashboard = async () => {
    try {
      if (selectedCustomerSolutions.length === 0) {
        setError('Please select at least one customer solution before generating dashboard.');
        setTimeout(() => setError(null), 3000);
        return;
      }
      setLoading(true);
      await apiPost('api/decision-tree/functional-scope/solution/save', {
        selectedCustomerSolutions,
        searchQuery,
        timestamp: new Date().toISOString()
      });
      navigate('/decision-tree/dashboard', {
        state: {
          fromCustomerSolution: true,
          selectedData: {
            selectedCustomerSolutions,
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
  const warehouseManagementImages = customerSolutionData
    .filter(item => item.functionalSubArea === "Warehouse Management System")
    .map(item => item.platformImageUrl);
 
  console.log(warehouseManagementImages);
  // Output: Array
 
  return (
    <div className="customer-solution-wrapper">
      {/* Breadcrumb */}
      <div className="customer-breadcrumb">
        <div className="customer-breadcrumb-content">
          <span className="customer-breadcrumb-link">Home</span>
          <span>›</span>
          <span className="customer-breadcrumb-link">Decision Tree</span>
          <span>›</span>
          <span className="customer-breadcrumb-current">Customer Solution</span>
        </div>
      </div>
      <div className="customer-main-layout">
        {/* Left Sidebar */}
        <div className="customer-left-sidebar">
          <h2 className="customer-sidebar-title">Functional Scope</h2>
          <p className="customer-sidebar-description">
            Structured framework for selecting functional requirements,
            prioritising them based on different measures for informed
            decision-making.
          </p>
          {/* Vertical line connecting all steps */}
          <div className="customer-step-line"></div>
          {/* Step indicators */}
          <div className="customer-steps-container">
            <div className="customer-step-item">
              <div className="customer-step-circle completed">
                <svg className="customer-step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="customer-step-text completed">Functional Scope</span>
            </div>
            <div className="customer-step-item">
              <div className="customer-step-circle completed">
                <svg className="customer-step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="customer-step-text completed">Non Functional Scope</span>
            </div>
            <div className="customer-step-item">
              <div className="customer-step-circle completed">
                <svg className="customer-step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="customer-step-text completed">Decision Criteria</span>
            </div>
            <div className="customer-step-item">
              <div className="customer-step-circle active">4</div>
              <span className="customer-step-text active">Customer Solution</span>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="customer-main-content">
          {/* Header with search */}
          <div className="customer-content-header">
            <div className="customer-search-container">
              <input
                type="text"
                placeholder="Search customer solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="customer-search-input"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="customer-search-icon"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
          {/* Customer Solution Section */}
          <div className="customer-solution-section">
            <div className="customer-solution-header">
              <h1 className="customer-solution-title">Customer Solution</h1>
              <div className="customer-solution-controls">
                <span className="customer-solution-subtitle">Select Customer Solution(s)</span>
                <button
                  className="customer-select-all-button"
                  onClick={handleSelectAllCustomerSolutions}
                >
                  Select all
                </button>
              </div>
            </div>
            {/* Error Message */}
            {error && (
              <div className="customer-error-message">
                {error}
              </div>
            )}
            {/* Customer Solutions Vertical List Layout */}
            <div className="customer-solutions-list">
              {loading ? (
                <div className="customer-loading-text">Loading...</div>
              ) : getFilteredCustomerSolutions().map((customerSolution) => (
                <div
                  key={customerSolution.id || customerSolution.platformName}
                  className={`customer-solution-row ${selectedCustomerSolutions.includes(customerSolution.id || customerSolution.platformName) ? 'selected' : ''}`}
                  onClick={() => handleCustomerSolutionSelect(customerSolution.id || customerSolution.platformName)}
                >
                  <div className="customer-solution-checkbox-container">
                    <input
                      type="checkbox"
                      checked={selectedCustomerSolutions.includes(customerSolution.id || customerSolution.platformName)}
                      onChange={() => handleCustomerSolutionSelect(customerSolution.id || customerSolution.platformName)}
                      className="customer-solution-checkbox"
                    />
                  </div>
                  <div className="customer-solution-content">
                    <div className="customer-solution-logo-container">
                      {customerSolution.platformImageUrl && (
                        <img
                          src={customerSolution.platformImageUrl}
                          alt={customerSolution.platformName || customerSolution.name}
                          className="customer-solution-logo"
                        />
                      )}
                      {!customerSolution.platformImageUrl && (
                        <span className="customer-solution-name">{customerSolution.platformName || customerSolution.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* No results message */}
            {!loading && getFilteredCustomerSolutions().length === 0 && (
              <div className="customer-no-results">
                No customer solutions found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="customer-footer">
        <div className="customer-footer-content">
          <button
            className="customer-previous-button"
            onClick={handlePreviousStep}
            disabled={loading}
          >
            Previous
          </button>
          <button
            className="customer-generate-button"
            onClick={handleGenerateCustomerDashboard}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default CustomerSolution;