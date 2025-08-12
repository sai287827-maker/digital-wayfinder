import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './AgnosticDecisionCriteria.css';
import { apiGet } from '../../api';
 
const AgnosticDecisionCriteria = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mappingData, setMappingData] = useState({});
 
  // Get data passed from previous page
  const { fromNonFunctionalScope, levelSelections } = location.state || {};
 
  useEffect(() => {
    async function fetchCriteria() {
      setLoading(true);
      setError(null);
      try {
        // Fetch decision criteria and mapping data (single API)
        const response = await apiGet('api/decision-tree/functional-scope/decision-criteria/get-details');
        // Map criteria and mapping data from response
        setCriteria(response.criteria || []);
        setMappingData({
          userId: response.userId,
          sessionId: response.sessionId,
          functionalArea: response.functionalArea,
          industryType: response.industryType,
          functional: response.functional?.levelSelections ? response.functional : { levelSelections: {} },
          nonFunctional: response.nonFunctional?.levelSelections ? response.nonFunctional : { levelSelections: {} }
        });

      } catch (err) {
        setError('Failed to fetch decision criteria.');
      } finally {
        setLoading(false);
      }
    }
    fetchCriteria();
  }, []);
 
  const handleInScopeChange = (id, checked) => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, inScope: checked } : c
      )
    );
  };
 
  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
 
  const handlePrevious = () => {
    navigate('/decision-tree/agnostic-non-functional-scope');
  };
 
  const handleProceed = () => {
    navigate('/decision-tree/agnostic-solution', {
      state: {
        fromDecisionCriteria: true,
        criteriaData: criteria,
        previousData: levelSelections
      }
    });
  };
 
  return (
    <div className="agnostic-decision-criteria-container">
      {/* Breadcrumb */}
      <div className="adc-breadcrumb">
        <div className="adc-breadcrumb-content">
          <span className="adc-breadcrumb-link" style={{ color: '#0036C9' }}>Home</span>
          <span>›</span>
          <span className="adc-breadcrumb-link" style={{ color: '#0036C9' }}>Decision Tree</span>
          <span>›</span>
          <span className="adc-breadcrumb-current">Decision Criteria</span>
        </div>
      </div>
 
      <div className="adc-main-layout">
        {/* Left Sidebar Box */}
        <div className="adc-left-sidebar">
          <h2 className="adc-sidebar-title">Decision Criteria</h2>
          <p className="adc-sidebar-description">
            Structured framework for selecting functional requirements,
            prioritising them based on different measures for informed decision-making.
          </p>
 
          {/* Vertical line connecting all steps */}
          <div className="adc-step-line"></div>
 
          {/* Step indicators */}
          <div className="adc-steps-container">
            <div className="adc-step-item">
              <div className="adc-step-circle adc-completed">
                <svg className="step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="adc-step-text adc-completed">Functional Scope</span>
            </div>
           
            <div className="adc-step-item">
              <div className="adc-step-circle adc-completed">
                <svg className="step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="adc-step-text adc-completed">Non Functional</span>
            </div>
           
            <div className="adc-step-item">
              <div className="adc-step-circle adc-active">3</div>
              <span className="adc-step-text adc-active">Reviews</span>
            </div>
           
            <div className="adc-step-item">
              <div className="adc-step-circle adc-inactive">4</div>
              <span className="adc-step-text adc-inactive">Solution</span>
            </div>
          </div>
        </div>
 
        {/* Main Content Box */}
        <div className="adc-main-content">
          {/* Decision Criteria Header */}
          <div className="adc-title-section">
            <h1 className="adc-page-title"> Review </h1>
          </div>
 
          {/* Table Container */}
          <div className="adc-table-container">
            <div className="adc-table-header">
              <div className="adc-header-criteria">Scope Reviews</div>
              <div className="adc-header-scope">In-Scope</div>
            </div>
            <div className="adc-table-content">
              {loading ? (
                <div className="loading-text">Loading...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : criteria.map((c) => (
                <React.Fragment key={c.id}>
                  <div className="adc-table-row">
                    <div className="adc-criteria-cell">
                      <button
                        onClick={() => toggleExpand(c.id)}
                        className="adc-expand-button"
                        aria-label={expanded[c.id] ? "Collapse" : "Expand"}
                        type="button"
                      >
                        {expanded[c.id] ? "−" : "+"}
                      </button>
                      <span className="adc-criteria-label">{c.label}</span>
                    </div>
                    <div className="adc-scope-cell">
                      <input
                        type="checkbox"
                        checked={c.inScope}
                        onChange={e => handleInScopeChange(c.id, e.target.checked)}
                        className="adc-scope-checkbox"
                      />
                    </div>
                  </div>
                  {expanded[c.id] && (
                    <div className="adc-expanded-content">
                      Additional details for <b>{c.label}</b> criteria.
                      {/* Show mapped data for Functional Scope */}
                      {c.id === 'functional' && mappingData?.functional?.levelSelections && (
                        <div className="adc-data-display">
                          <p><strong>Functional Level Selections:</strong></p>
                          <ul>
                            {Object.entries(mappingData.functional.levelSelections).map(([level, selections]) => (
                              <li key={level}>
                                <strong>{level.toUpperCase()}:</strong> {selections.length === 0 ? 'None' : selections.join(', ')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* Show mapped data for Non-Functional Scope */}
                      {c.id === 'nonFunctional' && mappingData?.nonFunctional?.levelSelections && (
                        <div className="adc-data-display">
                          <p><strong>Non-Functional Level Selections:</strong></p>
                          <ul>
                            {Object.entries(mappingData.nonFunctional.levelSelections).map(([level, selections]) => (
                              <li key={level}>
                                <strong>{level.toUpperCase()}:</strong> {selections.length === 0 ? 'None' : selections.join(', ')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* Show mapped data from previous Non-Functional page if available */}
                      {c.id === 'nonFunctional' && fromNonFunctionalScope && levelSelections && (
                        <div className="adc-data-display">
                          <p><strong>Selections from Non-Functional Scope (Previous Page):</strong></p>
                          <pre className="adc-data-pre">
                            {JSON.stringify(levelSelections, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
 
          {/* Footer buttons inside main content */}
          <div className="adc-footer-buttons-container">
            <div className="adc-footer-content">
              <button
                className="adc-footer-button adc-previous"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button
                className="adc-footer-button adc-proceed"
                onClick={handleProceed}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default AgnosticDecisionCriteria;