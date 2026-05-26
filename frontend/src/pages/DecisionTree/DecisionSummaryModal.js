import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './DecisionSummaryModal.module.css';

const DecisionSummaryModal = ({ isOpen, onClose, mappingData = {} }) => {
  const [activeTab, setActiveTab] = useState('Decision Criteria');
  const [expandedSections, setExpandedSections] = useState({
    functional: true,
    nonFunctional: true
  });

  console.log('Mapping Data in Modal:', mappingData);
  const tabs = ['Decision Criteria' /* , 'General Info', 'Solutions' */];

  if (!isOpen) return null;

  // Render hierarchical tree items based on level selections
  const renderTreeItems = (levelSelections, type) => {
    if (!levelSelections || !Array.isArray(levelSelections) || levelSelections.length === 0) {
      return <div className={styles.noData}>No selections available</div>;
    }

    // Group by l1, then l2, then l3, then l4, then l5
    const grouped = {};
    
    levelSelections.forEach((item) => {
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
          <div key={itemId} className={`${styles.treeItem} ${styles[`level${level}`]}`}>
            <div className={styles.treeItemContent}>
              <div className={styles.treeIndicator}>
                <div className={`${styles.treeDot} ${styles[`level${level}`]}`}></div>
              </div>
              <div className={styles.treeText}>
                <span className={styles.itemNumber}>{itemNumber}</span>
                <span className={styles.itemLabel}>{key}</span>
              </div>
            </div>
            
            {hasChildren && (
              <div className={styles.treeChildren}>
                {renderTreeLevel(value, level + 1, itemNumber)}
              </div>
            )}
            
            {Array.isArray(value) && value.length > 0 && (
              <div className={styles.treeChildren}>
                {value.map((item, idx) => (
                  <div key={`${itemId}-${idx}`} className={`${styles.treeItem} ${styles[`level${level + 1}`]}`}>
                    <div className={styles.treeItemContent}>
                      <div className={styles.treeIndicator}>
                        <div className={`${styles.treeDot} ${styles[`level${level + 1}`]}`}></div>
                      </div>
                      <div className={styles.treeText}>
                        <span className={styles.itemNumber}>{itemNumber}.{idx + 1}</span>
                        <span className={styles.itemLabel}>{item}</span>
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
      <div className={styles.treeItems}>
        {renderTreeLevel(grouped)}
      </div>
    );
  };

  const toggleExpandSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerTitle}>Decision Tree Selections</span>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? styles.activeTab : styles.tab}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.content}>
        {/* <div className={styles.content}>
          {activeTab === 'General Info' && (
            <div className={styles.infoTable}>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>WMS System</div>
                <div className={styles.infoValue}>
                  Project Information
                  <div className={styles.infoSubfields}>
                    <div className={styles.infoSubLabel}>Project Type :</div>
                    <div className={styles.infoSubLabel}>Request ID :</div>
                    <div className={styles.infoSubLabel}>Client Name :</div>
                    <div className={styles.infoSubLabel}>Client Description :</div>
                    <div className={styles.infoSubLabel}>Project Scope :</div>
                  </div>
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Functional Area</div>
                <div className={styles.infoValue}>Supply Chain Planning</div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Industry Type</div>
                <div className={styles.infoValue}>Industry Agnostic</div>
              </div>
            </div>
          )} */}
          {activeTab === 'Decision Criteria' && (
            <div className={styles.decisionCriteriaContent}>
              <div className={styles.selectionSummary}>
              <div className={styles.selectionSummaryRow}>
                  <span className={styles.selectionSummaryLabel}>Project/Client Name: </span>
                  <span className={styles.selectionSummaryValue}>{(mappingData.clientProjectName) || 'N/A'}</span>
                </div>
                <div className={styles.selectionSummaryRow}>
                  <span className={styles.selectionSummaryLabel}>Functional Area: </span>
                  <span className={styles.selectionSummaryValue}>{(mappingData.functionalArea.replace(/(^\w|-\w)/g, match => match.toUpperCase())) || 'N/A'}</span>
                </div>
                <div className={styles.selectionSummaryRow}>
                  <span className={styles.selectionSummaryLabel}>Industry Type: </span>
                  <span className={styles.selectionSummaryValue}>{(mappingData.industryType.replace(/(^\w|-\w)/g, match => match.toUpperCase())) || 'N/A'}</span>
                </div>
                <div className={styles.selectionSummaryRow}>
                  <span className={styles.selectionSummaryLabel}>Selected Platforms: </span>
                  <span className={styles.selectionSummaryValue}>
                    {Array.isArray(mappingData.selectedPlatforms) && mappingData.selectedPlatforms.length > 0
                      ? mappingData.selectedPlatforms.join(', ')
                      : 'None'}
                  </span>
                </div>
              </div>
              {/* Functional Section */}
              <div className={styles.mainCategory}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryContent}>
                    <button
                      onClick={() => toggleExpandSection('functional')}
                      className={styles.expandButton}
                      aria-label={expandedSections.functional ? "Collapse" : "Expand"}
                    >
                      {expandedSections.functional ? "−" : "+"}
                    </button>
                    <span className={styles.categoryLabel}>Functional</span>
                  </div>
                </div>
                
                {expandedSections.functional && mappingData?.functional?.levelSelections && (
                  <div className={styles.categoryContentExpanded}>
                    {renderTreeItems(mappingData.functional.levelSelections, 'functional')}
                  </div>
                )}
                {expandedSections.functional && (!mappingData?.functional?.levelSelections || mappingData.functional.levelSelections.length === 0) && (
                  <div className={styles.noData}>No functional selections available</div>
                )}
              </div>

              {/* Non-Functional Section */}
              <div className={styles.mainCategory}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryContent}>
                    <button
                      onClick={() => toggleExpandSection('nonFunctional')}
                      className={styles.expandButton}
                      aria-label={expandedSections.nonFunctional ? "Collapse" : "Expand"}
                    >
                      {expandedSections.nonFunctional ? "−" : "+"}
                    </button>
                    <span className={styles.categoryLabel}>Non Functional</span>
                  </div>
                </div>
                
                {expandedSections.nonFunctional && mappingData?.nonFunctional?.levelSelections && (
                  <div className={styles.categoryContentExpanded}>
                    {renderTreeItems(mappingData.nonFunctional.levelSelections, 'nonFunctional')}
                  </div>
                )}
                {expandedSections.nonFunctional && (!mappingData?.nonFunctional?.levelSelections || mappingData.nonFunctional.levelSelections.length === 0) && (
                  <div className={styles.noData}>No non-functional selections available</div>
                )}
              </div>
            </div>
          )} 
          {/* {activeTab === 'Solutions' && (
            <ol className={styles.solutionsList}>
              <li className={styles.solutionItem}>ORACLE</li>
              <li className={styles.solutionItem}>BlueYonder</li>
              <li className={styles.solutionItem}>O9</li>
            </ol>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default DecisionSummaryModal;
