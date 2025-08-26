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
          // Handle nested structure with functional and nonFunctional objects
          functional: response.functional || { levelSelections: [] },
          nonFunctional: response.nonFunctional || { levelSelections: [] }
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

  // Render hierarchical tree items based on new array-based structure
  const renderTreeItems = (levelSelections, type) => {
    if (!levelSelections || !Array.isArray(levelSelections) || levelSelections.length === 0) {
      return <div className="rdc-no-data">No selections available</div>;
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
          <div key={itemId} className={`rdc-tree-item level-${level}`}>
            <div className="rdc-tree-item-content">
              <div className="rdc-tree-indicator">
                <div className={`rdc-tree-dot level-${level}`}></div>
              </div>
              <div className="rdc-tree-text">
                <span className="rdc-item-number">{itemNumber}</span>
                <span className="rdc-item-label">{key}</span>
              </div>
              <div className="rdc-tree-checkbox">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => {}}
                  className="rdc-scope-checkbox"
                />
              </div>
            </div>
            
            {hasChildren && (
              <div className="rdc-tree-children">
                {renderTreeLevel(value, level + 1, itemNumber)}
              </div>
            )}
            
            {Array.isArray(value) && value.length > 0 && (
              <div className="rdc-tree-children">
                {value.map((item, idx) => (
                  <div key={`${itemId}-${idx}`} className={`rdc-tree-item level-${level + 1}`}>
                    <div className="rdc-tree-item-content">
                      <div className="rdc-tree-indicator">
                        <div className={`rdc-tree-dot level-${level + 1}`}></div>
                      </div>
                      <div className="rdc-tree-text">
                        <span className="rdc-item-number">{itemNumber}.{idx + 1}</span>
                        <span className="rdc-item-label">{item}</span>
                      </div>
                      <div className="rdc-tree-checkbox">
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => {}}
                          className="rdc-scope-checkbox"
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
      <div className="rdc-tree-items">
        {renderTreeLevel(grouped)}
      </div>
    );
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
          <span className="rdc-breadcrumb-current">Functional Scope</span>
        </div>
      </div>
 
      <div className="rdc-main-layout">
        {/* Left Sidebar Box */}
        <div className="rdc-left-sidebar">
          <h2 className="rdc-sidebar-title">Functional Scope</h2>
          <p className="rdc-sidebar-description">
            structured framework for selecting functional requirements,
            prioritising them based on different measures for informed decision-making.
          </p>
 
          {/* Step indicators */}
          <div className="rdc-steps-container">
            <div className="rdc-step-item">
              <div className="rdc-step-number completed">1</div>
              <span className="rdc-step-text completed">Functional Scope</span>
            </div>

            <div className="rdc-step-item">
              <div className="rdc-step-number completed">2</div>
              <span className="rdc-step-text completed">Non Functional Scope</span>
            </div>
           
            <div className="rdc-step-item">
              <div className="rdc-step-number active">3</div>
              <span className="rdc-step-text active">Review</span>
            </div>
           
            <div className="rdc-step-item">
              <div className="rdc-step-number inactive">4</div>
              <span className="rdc-step-text inactive">Solution</span>
            </div>
          </div>
        </div>
 
        {/* Main Content Box */}
        <div className="rdc-main-content">
          {/* Header */}
          <div className="rdc-header">
            <h1 className="rdc-page-title">Review</h1>
          </div>

          {/* Content Header */}
          <div className="rdc-content-header">
            <div className="rdc-content-title">Review</div>
            <div className="rdc-content-scope">In-Scope</div>
          </div>
 
          {/* Tree Container */}
          <div className="rdc-tree-container">
            {loading ? (
              <div className="loading-text">Loading...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <>
                {/* Functional Section */}
                <div className="rdc-main-category">
                  <div className="rdc-category-header">
                    <div className="rdc-category-content">
                      <button
                        onClick={() => toggleExpand('functional')}
                        className="rdc-expand-button"
                        aria-label={expanded.functional ? "Collapse" : "Expand"}
                      >
                        {expanded.functional ? "−" : "+"}
                      </button>
                      <span className="rdc-category-label">Functional</span>
                    </div>
                    <div className="rdc-category-checkbox">
                      <input
                        type="checkbox"
                        checked={criteria.find(c => c.id === 'functional')?.inScope || true}
                        onChange={e => handleInScopeChange('functional', e.target.checked)}
                        className="rdc-scope-checkbox main"
                      />
                    </div>
                  </div>
                  
                  {expanded.functional && mappingData?.functional?.levelSelections && (
                    <div className="rdc-category-content-expanded">
                      {renderTreeItems(mappingData.functional.levelSelections, 'functional')}
                    </div>
                  )}
                </div>

                {/* Non-Functional Section */}
                <div className="rdc-main-category">
                  <div className="rdc-category-header">
                    <div className="rdc-category-content">
                      <button
                        onClick={() => toggleExpand('nonFunctional')}
                        className="rdc-expand-button"
                        aria-label={expanded.nonFunctional ? "Collapse" : "Expand"}
                      >
                        {expanded.nonFunctional ? "−" : "+"}
                      </button>
                      <span className="rdc-category-label">Non Functional</span>
                    </div>
                    <div className="rdc-category-checkbox">
                      <input
                        type="checkbox"
                        checked={criteria.find(c => c.id === 'nonFunctional')?.inScope || true}
                        onChange={e => handleInScopeChange('nonFunctional', e.target.checked)}
                        className="rdc-scope-checkbox main"
                      />
                    </div>
                  </div>
                  
                  {expanded.nonFunctional && mappingData?.nonFunctional?.levelSelections && (
                    <div className="rdc-category-content-expanded">
                      {renderTreeItems(mappingData.nonFunctional.levelSelections, 'nonFunctional')}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
 
          {/* Footer buttons */}
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
 
export default DecisionCriteria;