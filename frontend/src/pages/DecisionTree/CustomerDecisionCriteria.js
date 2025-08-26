import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './CustomerDecisionCriteria.css';
import { apiGet } from '../../api';
 
const CustomerDecisionCriteria = () => {
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
          functional: response.functional?.levelSelections ? response.functional : { levelSelections: [] },
          nonFunctional: response.nonFunctional?.levelSelections ? response.nonFunctional : { levelSelections: [] }
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
    navigate('/decision-tree/customer-solution', {
      state: {
        fromDecisionCriteria: true,
        criteriaData: criteria,
        previousData: levelSelections
      }
    });
  };

  // Render hierarchical tree items based on new array-based structure
  const renderTreeItems = (levelSelections, type) => {
    if (!levelSelections || !Array.isArray(levelSelections) || levelSelections.length === 0) {
      return <div className="customer-dc-no-data">No selections available</div>;
    }

    // Group by l1, then l2, then l3, then l4
    const grouped = {};
    
    levelSelections.forEach((item, index) => {
      const l1 = item.l1 || 'Uncategorized';
      const l2 = item.l2 || '';
      const l3 = item.l3 || '';
      const l4 = item.l4 || '';
      const l5 = item.l5 || '';
      
      if (!grouped[l1]) grouped[l1] = {};
      if (!grouped[l1][l2]) grouped[l1][l2] = {};
      if (!grouped[l1][l2][l3]) grouped[l1][l2][l3] = {};
      if (!grouped[l1][l2][l3][l4]) grouped[l1][l2][l3][l4] = [];
      
      if (l5) {
        grouped[l1][l2][l3][l4].push(l5);
      }
    });

    const renderTreeLevel = (data, level = 1, parentNumber = '') => {
      return Object.entries(data).map(([key, value], index) => {
        if (!key) return null;
        
        const itemNumber = parentNumber ? `${parentNumber}.${index + 1}` : `${index + 1}`;
        const itemId = `${type}-${level}-${index}-${key}`;
        
        const hasChildren = typeof value === 'object' && Object.keys(value).length > 0 && Object.keys(value).some(k => k !== '');
        
        return (
          <div key={itemId} className={`customer-dc-tree-item level-${level}`}>
            <div className="customer-dc-tree-item-content">
              <div className="customer-dc-tree-indicator">
                <div className={`customer-dc-tree-dot level-${level}`}></div>
              </div>
              <div className="customer-dc-tree-text">
                <span className="customer-dc-item-number">{itemNumber}</span>
                <span className="customer-dc-item-label">{key}</span>
              </div>
              <div className="customer-dc-tree-checkbox">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => {}}
                  className="customer-dc-scope-checkbox"
                />
              </div>
            </div>
            
            {hasChildren && (
              <div className="customer-dc-tree-children">
                {renderTreeLevel(value, level + 1, itemNumber)}
              </div>
            )}
            
            {Array.isArray(value) && value.length > 0 && (
              <div className="customer-dc-tree-children">
                {value.map((item, idx) => (
                  <div key={`${itemId}-${idx}`} className={`customer-dc-tree-item level-${level + 1}`}>
                    <div className="customer-dc-tree-item-content">
                      <div className="customer-dc-tree-indicator">
                        <div className={`customer-dc-tree-dot level-${level + 1}`}></div>
                      </div>
                      <div className="customer-dc-tree-text">
                        <span className="customer-dc-item-number">{itemNumber}.{idx + 1}</span>
                        <span className="customer-dc-item-label">{item}</span>
                      </div>
                      <div className="customer-dc-tree-checkbox">
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => {}}
                          className="customer-dc-scope-checkbox"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }).filter(Boolean);
    };
    return (
      <div className="customer-dc-tree-items">
        {renderTreeLevel(grouped)}
      </div>
    );
  };
 
  return (
    <div className="customer-decision-criteria-container">
      {/* Breadcrumb */}
      <div className="customer-dc-breadcrumb">
        <div className="customer-dc-breadcrumb-content">
          <span className="customer-dc-breadcrumb-link" style={{ color: '#0036C9' }}>Home</span>
          <span>›</span>
          <span className="customer-dc-breadcrumb-link" style={{ color: '#0036C9' }}>Decision Tree</span>
          <span>›</span>
          <span className="customer-dc-breadcrumb-current">Decision Criteria</span>
        </div>
      </div>
 
      <div className="customer-dc-main-layout">
        {/* Left Sidebar Box */}
        <div className="customer-dc-left-sidebar">
          <h2 className="customer-dc-sidebar-title">Decision Criteria</h2>
          <p className="customer-dc-sidebar-description">
            Structured framework for selecting functional requirements,
            prioritising them based on different measures for informed decision-making.
          </p>
 
          {/* Vertical line connecting all steps */}
          <div className="customer-dc-step-line"></div>
 
          {/* Step indicators */}
          <div className="customer-dc-steps-container">
            <div className="customer-dc-step-item">
              <div className="customer-dc-step-circle customer-dc-completed">
                <svg className="customer-dc-step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="customer-dc-step-text customer-dc-completed">Functional Scope</span>
            </div>
           
            <div className="customer-dc-step-item">
              <div className="customer-dc-step-circle customer-dc-completed">
                <svg className="customer-dc-step-check" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="customer-dc-step-text customer-dc-completed">Non Functional</span>
            </div>
           
            <div className="customer-dc-step-item">
              <div className="customer-dc-step-circle customer-dc-active">3</div>
              <span className="customer-dc-step-text customer-dc-active">Reviews</span>
            </div>
           
            <div className="customer-dc-step-item">
              <div className="customer-dc-step-circle customer-dc-inactive">4</div>
              <span className="customer-dc-step-text customer-dc-inactive">Solution</span>
            </div>
          </div>
        </div>
 
        {/* Main Content Box */}
        <div className="customer-dc-main-content">
          {/* Decision Criteria Header */}
          <div className="customer-dc-title-section">
            <h1 className="customer-dc-page-title">Reviews</h1>
          </div>
 
          {/* Table Container */}
          <div className="customer-dc-table-container">
            <div className="customer-dc-table-header">
              <div className="customer-dc-header-criteria">Scope Reviews</div>
              <div className="customer-dc-header-scope">In-Scope</div>
            </div>
            <div className="customer-dc-table-content">
              {loading ? (
                <div className="customer-dc-loading-container">
                  <div className="customer-dc-loading-spinner"></div>
                  <p className="customer-dc-loading-text">Loading...</p>
                </div>
              ) : error ? (
                <div className="customer-dc-error-container">
                  <div className="customer-dc-error-title">Error</div>
                  <div className="customer-dc-error-message">{error}</div>
                </div>
              ) : (
                <>
                  {/* Functional Section */}
                  <div className="customer-dc-main-category">
                    <div className="customer-dc-table-row">
                      <div className="customer-dc-criteria-cell">
                        <button
                          onClick={() => toggleExpand('functional')}
                          className="customer-dc-expand-button"
                          aria-label={expanded.functional ? "Collapse" : "Expand"}
                          type="button"
                        >
                          {expanded.functional ? "−" : "+"}
                        </button>
                        <span className="customer-dc-criteria-label">Functional</span>
                      </div>
                      <div className="customer-dc-scope-cell">
                        <input
                          type="checkbox"
                          checked={criteria.find(c => c.id === 'functional')?.inScope || true}
                          onChange={e => handleInScopeChange('functional', e.target.checked)}
                          className="customer-dc-scope-checkbox"
                        />
                      </div>
                    </div>
                    
                    {expanded.functional && mappingData?.functional?.levelSelections && (
                      <div className="customer-dc-expanded-content">
                        {renderTreeItems(mappingData.functional.levelSelections, 'functional')}
                      </div>
                    )}
                  </div>

                  {/* Non-Functional Section */}
                  <div className="customer-dc-main-category">
                    <div className="customer-dc-table-row">
                      <div className="customer-dc-criteria-cell">
                        <button
                          onClick={() => toggleExpand('nonFunctional')}
                          className="customer-dc-expand-button"
                          aria-label={expanded.nonFunctional ? "Collapse" : "Expand"}
                          type="button"
                        >
                          {expanded.nonFunctional ? "−" : "+"}
                        </button>
                        <span className="customer-dc-criteria-label">Non Functional</span>
                      </div>
                      <div className="customer-dc-scope-cell">
                        <input
                          type="checkbox"
                          checked={criteria.find(c => c.id === 'nonFunctional')?.inScope || true}
                          onChange={e => handleInScopeChange('nonFunctional', e.target.checked)}
                          className="customer-dc-scope-checkbox"
                        />
                      </div>
                    </div>
                    
                    {expanded.nonFunctional && mappingData?.nonFunctional?.levelSelections && (
                      <div className="customer-dc-expanded-content">
                        {renderTreeItems(mappingData.nonFunctional.levelSelections, 'nonFunctional')}
                      </div>
                    )}
                    
                    {/* Show mapped data from previous Non-Functional page if available */}
                    {expanded.nonFunctional && fromNonFunctionalScope && levelSelections && (
                      <div className="customer-dc-data-display">
                        <p><strong>Selections from Non-Functional Scope (Previous Page):</strong></p>
                        <pre className="customer-dc-data-pre">
                          {JSON.stringify(levelSelections, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
 
          {/* Footer buttons inside main content */}
          <div className="customer-dc-footer-buttons-container">
            <div className="customer-dc-footer-content">
              <button
                className="customer-dc-footer-button customer-dc-previous"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button
                className="customer-dc-footer-button customer-dc-proceed"
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
 
export default CustomerDecisionCriteria;

 