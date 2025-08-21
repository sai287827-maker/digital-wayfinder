import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './DecisionSummaryModal.module.css';

const DecisionSummaryModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('General Info');
  const [functionalValue, setFunctionalValue] = useState('Functional');
  const [nonFunctionalValue, setNonFunctionalValue] = useState('Non Functional');

  const tabs = ['General Info', 'Decision Criteria', 'Solutions'];

  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerTitle}>Decision Tree Summary</span>
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
          )}
          {activeTab === 'Decision Criteria' && (
            <>
              <select
                className={styles.dropdown}
                value={functionalValue}
                onChange={e => setFunctionalValue(e.target.value)}
              >
                <option value="Functional">Functional</option>
                {/* Add more options as needed */}
              </select>
              <select
                className={styles.dropdown}
                value={nonFunctionalValue}
                onChange={e => setNonFunctionalValue(e.target.value)}
              >
                <option value="Non Functional">Non Functional</option>
                {/* Add more options as needed */}
              </select>
            </>
          )}
          {activeTab === 'Solutions' && (
            <ol className={styles.solutionsList}>
              <li className={styles.solutionItem}>ORACLE</li>
              <li className={styles.solutionItem}>BlueYonder</li>
              <li className={styles.solutionItem}>O9</li>
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecisionSummaryModal;
