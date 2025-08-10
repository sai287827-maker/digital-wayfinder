import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './DecisionCriteria.css';
import { apiGet } from '../../api';
 
const DecisionCriteria = () => {
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
    navigate('/decision-tree/non-functional-scope');
  };
 
  const handleProceed = () => {
    navigate('/decision-tree/solution', {
      state: {
        fromDecisionCriteria: true,
        criteriaData: criteria,
        previousData: levelSelections
      }
    });
  };
 
  return (
    <div className="decision-criteria-container">
      {/* Breadcrumb */}
      <div className="dc-breadcrumb">
        <div className="dc-breadcrumb-content">
          <span className="dc-breadcrumb-link" style={{ color: '#0036C9' }}>Home</span>
          <span>›</span>
          <span className="dc-breadcrumb-link" style={{ color: '#0036C9' }}>Decision Tree</span>
          <span>›</span>
          <span className="dc-breadcrumb-current">Decision Criteria</span>
        </div>
      </div>
 
      <div className="dc-main-layout">
        {/* Left Sidebar Box */}
        <div className="dc-left-sidebar">
          <h2 className="dc-sidebar-title">Decision Criteria</h2>
          <p className="dc-sidebar-description">
            Structured framework for selecting functional requirements,
            prioritising them based on different measures for informed decision-making.
          </p>
 
          {/* Vertical line connecting all steps */}
          <div className="dc-step-line"></div>
 
          {/* Step indicators */}
          <div className="dc-steps-container">
            <div className="dc-step-item">
              <div className="dc-step-circle dc-completed">
                <svg className="step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="dc-step-text dc-completed">Functional Scope</span>
            </div>
           
            <div className="dc-step-item">
              <div className="dc-step-circle dc-completed">
                <svg className="step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="dc-step-text dc-completed">Non Functional</span>
            </div>
           
            <div className="dc-step-item">
              <div className="dc-step-circle dc-active">3</div>
              <span className="dc-step-text dc-active">Reviews</span>
            </div>
           
            <div className="dc-step-item">
              <div className="dc-step-circle dc-inactive">4</div>
              <span className="dc-step-text dc-inactive">Solution</span>
            </div>
          </div>
        </div>
 
        {/* Main Content Box */}
        <div className="dc-main-content">
          {/* Decision Criteria Header */}
          <div className="dc-title-section">
            <h1 className="dc-page-title"> Reviews </h1>
          </div>
 
          {/* Table Container */}
          <div className="dc-table-container">
            <div className="dc-table-header">
              <div className="dc-header-criteria">Scope Reviews</div>
              <div className="dc-header-scope">In-Scope</div>
            </div>
            <div className="dc-table-content">
              {loading ? (
                <div className="loading-text">Loading...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : criteria.map((c) => (
                <React.Fragment key={c.id}>
                  <div className="dc-table-row">
                    <div className="dc-criteria-cell">
                      <button
                        onClick={() => toggleExpand(c.id)}
                        className="dc-expand-button"
                        aria-label={expanded[c.id] ? "Collapse" : "Expand"}
                        type="button"
                      >
                        {expanded[c.id] ? "−" : "+"}
                      </button>
                      <span className="dc-criteria-label">{c.label}</span>
                    </div>
                    <div className="dc-scope-cell">
                      <input
                        type="checkbox"
                        checked={c.inScope}
                        onChange={e => handleInScopeChange(c.id, e.target.checked)}
                        className="dc-scope-checkbox"
                      />
                    </div>
                  </div>
                  {expanded[c.id] && (
                    <div className="dc-expanded-content">
                      Additional details for <b>{c.label}</b> criteria.
                      {/* Show mapped data for Functional Scope */}
                      {c.id === 'functional' && mappingData?.functional?.levelSelections && (
                        <div className="dc-data-display">
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
                        <div className="dc-data-display">
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
                        <div className="dc-data-display">
                          <p><strong>Selections from Non-Functional Scope (Previous Page):</strong></p>
                          <pre className="dc-data-pre">
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
          <div className="dc-footer-buttons-container">
            <div className="dc-footer-content">
              <button
                className="dc-footer-button dc-previous"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button
                className="dc-footer-button dc-proceed"
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
 
export default DecisionCriteria;
 