import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './RetailDecisionCriteria.css';
import { apiGet } from '../../api';
 
const RetailDecisionCriteria = () => {
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
        const response = await apiGet('api/decision-tree/retail/decision-criteria/get-details');
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
    navigate('/decision-tree/retail-non-functional-scope');
  };
 
  const handleProceed = () => {
    navigate('/decision-tree/retail-solution', {
      state: {
        fromDecisionCriteria: true,
        criteriaData: criteria,
        previousData: levelSelections
      }
    });
  };
 
  return (
    <div className="retail-decision-criteria-container">
      {/* Breadcrumb */}
      <div className="rdc-breadcrumb">
        <div className="rdc-breadcrumb-content">
          <span className="rdc-breadcrumb-link" style={{ color: '#0036C9' }}>Home</span>
          <span>›</span>
          <span className="rdc-breadcrumb-link" style={{ color: '#0036C9' }}>Decision Tree</span>
          <span>›</span>
          <span className="rdc-breadcrumb-current">Decision Criteria</span>
        </div>
      </div>
 
      <div className="rdc-main-layout">
        {/* Left Sidebar Box */}
        <div className="rdc-left-sidebar">
          <h2 className="rdc-sidebar-title">Decision Criteria</h2>
          <p className="rdc-sidebar-description">
            Structured framework for selecting functional requirements,
            prioritising them based on different measures for informed decision-making.
          </p>
 
          {/* Vertical line connecting all steps */}
          <div className="rdc-step-line"></div>
 
          {/* Step indicators */}
          <div className="rdc-steps-container">
            <div className="rdc-step-item">
              <div className="rdc-step-circle rdc-completed">
                <svg className="step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="rdc-step-text rdc-completed">Functional Scope</span>
            </div>
           
            <div className="rdc-step-item">
              <div className="rdc-step-circle rdc-completed">
                <svg className="step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="rdc-step-text rdc-completed">Non Functional</span>
            </div>
           
            <div className="rdc-step-item">
              <div className="rdc-step-circle rdc-active">3</div>
              <span className="rdc-step-text rdc-active">Reviews</span>
            </div>
           
            <div className="rdc-step-item">
              <div className="rdc-step-circle rdc-inactive">4</div>
              <span className="rdc-step-text rdc-inactive">Solution</span>
            </div>
          </div>
        </div>
 
        {/* Main Content Box */}
        <div className="rdc-main-content">
          {/* Decision Criteria Header */}
          <div className="rdc-title-section">
            <h1 className="rdc-page-title"> Review </h1>
          </div>
 
          {/* Table Container */}
          <div className="rdc-table-container">
            <div className="rdc-table-header">
              <div className="rdc-header-criteria">Scope Reviews</div>
              <div className="rdc-header-scope">In-Scope</div>
            </div>
            <div className="rdc-table-content">
              {loading ? (
                <div className="loading-text">Loading...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : criteria.map((c) => (
                <React.Fragment key={c.id}>
                  <div className="rdc-table-row">
                    <div className="rdc-criteria-cell">
                      <button
                        onClick={() => toggleExpand(c.id)}
                        className="rdc-expand-button"
                        aria-label={expanded[c.id] ? "Collapse" : "Expand"}
                        type="button"
                      >
                        {expanded[c.id] ? "−" : "+"}
                      </button>
                      <span className="rdc-criteria-label">{c.label}</span>
                    </div>
                    <div className="rdc-scope-cell">
                      <input
                        type="checkbox"
                        checked={c.inScope}
                        onChange={e => handleInScopeChange(c.id, e.target.checked)}
                        className="rdc-scope-checkbox"
                      />
                    </div>
                  </div>
                  {expanded[c.id] && (
                    <div className="rdc-expanded-content">
                      Additional details for <b>{c.label}</b> criteria.
                      {/* Show mapped data for Functional Scope */}
                      {c.id === 'functional' && mappingData?.functional?.levelSelections && (
                        <div className="rdc-data-display">
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
                        <div className="rdc-data-display">
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
                        <div className="rdc-data-display">
                          <p><strong>Selections from Non-Functional Scope (Previous Page):</strong></p>
                          <pre className="rdc-data-pre">
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
          <div className="rdc-footer-buttons-container">
            <div className="rdc-footer-content">
              <button
                className="rdc-footer-button rdc-previous"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button
                className="rdc-footer-button rdc-proceed"
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
 
export default RetailDecisionCriteria;