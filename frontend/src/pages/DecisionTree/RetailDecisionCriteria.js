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

  // Render hierarchical tree items based on mapping data (supports 5 levels for retail)
  const renderTreeItems = (levelSelections, type) => {
    if (!levelSelections || Object.keys(levelSelections).length === 0) {
      return <div className="rdc-no-data">No selections available</div>;
    }

    const renderLevel = (level, selections, parentNumber = '') => {
      return selections.map((selection, index) => {
        const itemNumber = parentNumber ? `${parentNumber}.${index + 1}` : `${index + 1}.0`;
        const itemId = `${type}-${level}-${index}`;
        
        return (
          <div key={itemId} className={`rdc-tree-item level-${level}`}>
            <div className="rdc-tree-item-content">
              <div className="rdc-tree-indicator">
                <div className={`rdc-tree-dot level-${level}`}></div>
              </div>
              <div className="rdc-tree-text">
                <span className="rdc-item-number">{itemNumber}</span>
                <span className="rdc-item-label">{selection}</span>
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
        );
      });
    };

    return (
      <div className="rdc-tree-items">
        {Object.entries(levelSelections).map(([level, selections]) => {
          const levelNum = parseInt(level.replace('l', ''));
          return renderLevel(levelNum, selections);
        })}
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
          <span className="rdc-breadcrumb-current">Retail Functional Scope</span>
        </div>
      </div>
 
      <div className="rdc-main-layout">
        {/* Left Sidebar Box */}
        <div className="rdc-left-sidebar">
          <h2 className="rdc-sidebar-title">Retail Functional Scope</h2>
          <p className="rdc-sidebar-description">
            Retail-specific structured framework for selecting functional requirements,
            prioritising them based on different measures for informed decision-making.
          </p>
 
          {/* Step indicators */}
          <div className="rdc-steps-container">
            <div className="rdc-step-item">
              <div className="rdc-step-number completed">1</div>
              <span className="rdc-step-text completed">Functional Scope</span>
            </div>
           
            <div className="rdc-step-item">
              <div className="rdc-step-number active">2</div>
              <span className="rdc-step-text active">Decision Criteria</span>
            </div>
           
            <div className="rdc-step-item">
              <div className="rdc-step-number inactive">3</div>
              <span className="rdc-step-text inactive">Solution</span>
            </div>
          </div>
        </div>
 
        {/* Main Content Box */}
        <div className="rdc-main-content">
          {/* Header */}
          <div className="rdc-header">
            <h1 className="rdc-page-title">Decision Criteria</h1>
            <div className="rdc-header-buttons">
              <button className="rdc-header-button outline">Define Weightage</button>
              <button className="rdc-header-button outline">Custom Criteria</button>
              <button className="rdc-header-button filled">Select Parameters</button>
            </div>
          </div>

          {/* Content Header */}
          <div className="rdc-content-header">
            <div className="rdc-content-title">Decision Criteria</div>
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
 
export default RetailDecisionCriteria;