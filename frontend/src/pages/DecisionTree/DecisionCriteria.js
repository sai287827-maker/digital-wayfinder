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

  // Render hierarchical tree items based on mapping data
  const renderTreeItems = (levelSelections, type) => {
    if (!levelSelections || Object.keys(levelSelections).length === 0) {
      return <div className="dc-no-data">No selections available</div>;
    }

    const renderLevel = (level, selections, parentNumber = '') => {
      return selections.map((selection, index) => {
        const itemNumber = parentNumber ? `${parentNumber}.${index + 1}` : `${index + 1}.0`;
        const itemId = `${type}-${level}-${index}`;
        
        return (
          <div key={itemId} className={`dc-tree-item level-${level}`}>
            <div className="dc-tree-item-content">
              <div className="dc-tree-indicator">
                <div className={`dc-tree-dot level-${level}`}></div>
              </div>
              <div className="dc-tree-text">
                <span className="dc-item-number">{itemNumber}</span>
                <span className="dc-item-label">{selection}</span>
              </div>
              <div className="dc-tree-checkbox">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => {}}
                  className="dc-scope-checkbox"
                />
              </div>
            </div>
          </div>
        );
      });
    };

    return (
      <div className="dc-tree-items">
        {Object.entries(levelSelections).map(([level, selections]) => {
          const levelNum = parseInt(level.replace('l', ''));
          return renderLevel(levelNum, selections);
        })}
      </div>
    );
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
          <span className="dc-breadcrumb-current">Functional Scope</span>
        </div>
      </div>
 
      <div className="dc-main-layout">
        {/* Left Sidebar Box */}
        <div className="dc-left-sidebar">
          <h2 className="dc-sidebar-title">Functional Scope</h2>
          <p className="dc-sidebar-description">
            Structured framework for selecting functional requirements,
            prioritising them based on different measures for informed decision-making.
          </p>
 
          {/* Step indicators */}
          <div className="dc-steps-container">
            <div className="dc-step-item">
              <div className="dc-step-number completed">1</div>
              <span className="dc-step-text completed">Functional Scope</span>
            </div>
           
            <div className="dc-step-item">
              <div className="dc-step-number active">2</div>
              <span className="dc-step-text active">Decision Criteria</span>
            </div>
           
            <div className="dc-step-item">
              <div className="dc-step-number inactive">3</div>
              <span className="dc-step-text inactive">Solution</span>
            </div>
          </div>
        </div>
 
        {/* Main Content Box */}
        <div className="dc-main-content">
          {/* Header */}
          <div className="dc-header">
            <h1 className="dc-page-title">Decision Criteria</h1>
            <div className="dc-header-buttons">
              <button className="dc-header-button outline">Define Weightage</button>
              <button className="dc-header-button outline">Custom Criteria</button>
              <button className="dc-header-button filled">Select Parameters</button>
            </div>
          </div>

          {/* Content Header */}
          <div className="dc-content-header">
            <div className="dc-content-title">Decision Criteria</div>
            <div className="dc-content-scope">In-Scope</div>
          </div>
 
          {/* Tree Container */}
          <div className="dc-tree-container">
            {loading ? (
              <div className="loading-text">Loading...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <>
                {/* Functional Section */}
                <div className="dc-main-category">
                  <div className="dc-category-header">
                    <div className="dc-category-content">
                      <button
                        onClick={() => toggleExpand('functional')}
                        className="dc-expand-button"
                        aria-label={expanded.functional ? "Collapse" : "Expand"}
                      >
                        {expanded.functional ? "−" : "+"}
                      </button>
                      <span className="dc-category-label">Functional</span>
                    </div>
                    <div className="dc-category-checkbox">
                      <input
                        type="checkbox"
                        checked={criteria.find(c => c.id === 'functional')?.inScope || true}
                        onChange={e => handleInScopeChange('functional', e.target.checked)}
                        className="dc-scope-checkbox main"
                      />
                    </div>
                  </div>
                  
                  {expanded.functional && mappingData?.functional?.levelSelections && (
                    <div className="dc-category-content-expanded">
                      {renderTreeItems(mappingData.functional.levelSelections, 'functional')}
                    </div>
                  )}
                </div>

                {/* Non-Functional Section */}
                <div className="dc-main-category">
                  <div className="dc-category-header">
                    <div className="dc-category-content">
                      <button
                        onClick={() => toggleExpand('nonFunctional')}
                        className="dc-expand-button"
                        aria-label={expanded.nonFunctional ? "Collapse" : "Expand"}
                      >
                        {expanded.nonFunctional ? "−" : "+"}
                      </button>
                      <span className="dc-category-label">Non Functional</span>
                    </div>
                    <div className="dc-category-checkbox">
                      <input
                        type="checkbox"
                        checked={criteria.find(c => c.id === 'nonFunctional')?.inScope || true}
                        onChange={e => handleInScopeChange('nonFunctional', e.target.checked)}
                        className="dc-scope-checkbox main"
                      />
                    </div>
                  </div>
                  
                  {expanded.nonFunctional && mappingData?.nonFunctional?.levelSelections && (
                    <div className="dc-category-content-expanded">
                      {renderTreeItems(mappingData.nonFunctional.levelSelections, 'nonFunctional')}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
 
          {/* Footer buttons */}
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