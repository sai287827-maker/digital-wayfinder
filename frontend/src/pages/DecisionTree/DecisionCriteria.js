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

  // Function to render hierarchical tree structure
  const renderTreeItem = (items, level = 0, parentKey = '') => {
    if (!items || !Array.isArray(items)) return null;

    return items.map((item, index) => {
      const itemKey = `${parentKey}-${level}-${index}`;
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expanded[itemKey];

      return (
        <div key={itemKey} className={`tree-item level-${level}`}>
          <div className="tree-item-content">
            <div className="tree-item-left">
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(itemKey)}
                  className={`tree-expand-btn ${isExpanded ? 'expanded' : ''}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d={isExpanded ? "M2 4l4 4 4-4" : "M4 2l4 4-4 4"} />
                  </svg>
                </button>
              )}
              {!hasChildren && <div className="tree-spacer"></div>}
              
              <div className={`tree-indicator level-${level}`}>
                {level === 0 && (
                  <div className="main-indicator">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  </div>
                )}
                {level === 1 && (
                  <div className="sub-indicator">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  </div>
                )}
                {level === 2 && (
                  <div className="sub-sub-indicator">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                      <circle cx="4" cy="4" r="3"/>
                    </svg>
                  </div>
                )}
                {level >= 3 && (
                  <div className="deep-indicator">
                    <div className="indicator-dot"></div>
                  </div>
                )}
              </div>
              
              <span className={`tree-label level-${level}`}>{item.label || item.name || item.title}</span>
            </div>
            
            <div className="tree-item-right">
              <input
                type="checkbox"
                checked={item.inScope || false}
                onChange={e => {
                  // Handle checkbox change for tree items
                  console.log(`Item ${itemKey} checked:`, e.target.checked);
                }}
                className="tree-checkbox"
              />
            </div>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="tree-children">
              {renderTreeItem(item.children, level + 1, itemKey)}
            </div>
          )}
        </div>
      );
    });
  };

  // Function to create tree structure from mapping data
  const createTreeStructure = (levelSelections) => {
    const tree = [];
    
    Object.entries(levelSelections).forEach(([level, selections]) => {
      if (selections && selections.length > 0) {
        const levelNode = {
          label: `${level.charAt(0).toUpperCase() + level.slice(1)} Level`,
          inScope: true,
          children: selections.map(selection => ({
            label: selection,
            inScope: true,
            children: [
              {
                label: `${selection} - Implementation Details`,
                inScope: true,
                children: [
                  {
                    label: `${selection} - Configuration and Setup`,
                    inScope: true
                  },
                  {
                    label: `${selection} - Integration Requirements`,
                    inScope: true
                  }
                ]
              }
            ]
          }))
        };
        tree.push(levelNode);
      }
    });
    
    return tree;
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
            <h1 className="dc-page-title">Reviews</h1>
          </div>
 
          {/* Tree Container */}
          <div className="dc-tree-container">
            <div className="dc-tree-header">
              <div className="dc-header-criteria">Scope Reviews</div>
              <div className="dc-header-scope">In-Scope</div>
            </div>
            
            <div className="dc-tree-content">
              {loading ? (
                <div className="loading-text">Loading...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : (
                <>
                  {/* Functional Section */}
                  <div className="tree-section">
                    <div className="tree-section-header">
                      <button
                        onClick={() => toggleExpand('functional')}
                        className={`tree-expand-btn ${expanded['functional'] ? 'expanded' : ''}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                          <path d={expanded['functional'] ? "M2 4l4 4 4-4" : "M4 2l4 4-4 4"} />
                        </svg>
                      </button>
                      
                      <div className="main-indicator functional">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="8" cy="8" r="6" stroke="#8B5CF6" strokeWidth="2" fill="none"/>
                        </svg>
                      </div>
                      
                      <span className="tree-section-title">Functional</span>
                      
                      <div className="tree-section-checkbox">
                        <input
                          type="checkbox"
                          checked={criteria.find(c => c.id === 'functional')?.inScope || false}
                          onChange={e => handleInScopeChange('functional', e.target.checked)}
                          className="tree-checkbox"
                        />
                      </div>
                    </div>
                    
                    {expanded['functional'] && mappingData?.functional?.levelSelections && (
                      <div className="tree-section-content">
                        {renderTreeItem(createTreeStructure(mappingData.functional.levelSelections))}
                      </div>
                    )}
                  </div>

                  {/* Non Functional Section */}
                  <div className="tree-section">
                    <div className="tree-section-header">
                      <button
                        onClick={() => toggleExpand('nonFunctional')}
                        className={`tree-expand-btn ${expanded['nonFunctional'] ? 'expanded' : ''}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                          <path d={expanded['nonFunctional'] ? "M2 4l4 4 4-4" : "M4 2l4 4-4 4"} />
                        </svg>
                      </button>
                      
                      <div className="main-indicator non-functional">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="8" cy="8" r="6" stroke="#8B5CF6" strokeWidth="2" fill="none"/>
                        </svg>
                      </div>
                      
                      <span className="tree-section-title">Non Functional</span>
                      
                      <div className="tree-section-checkbox">
                        <input
                          type="checkbox"
                          checked={criteria.find(c => c.id === 'nonFunctional')?.inScope || false}
                          onChange={e => handleInScopeChange('nonFunctional', e.target.checked)}
                          className="tree-checkbox"
                        />
                      </div>
                    </div>
                    
                    {expanded['nonFunctional'] && mappingData?.nonFunctional?.levelSelections && (
                      <div className="tree-section-content">
                        {renderTreeItem(createTreeStructure(mappingData.nonFunctional.levelSelections))}
                      </div>
                    )}
                  </div>
                </>
              )}
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