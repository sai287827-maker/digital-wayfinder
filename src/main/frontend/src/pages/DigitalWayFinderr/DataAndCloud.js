import React, { useState } from 'react';
import styles from './DataAndCloud.module.css';
import VisibilityProactive from './VisibilityProactive';

const questions = [
  'Do you use cloud services (Any cloud service provider) to augment WMS capabilities?',
  'How would you rate existing capability in integrating real-time data to cloud for various use cases?',
  'Do you have a unified data model as a single source of truth for analytics/AI-ML use cases?',
  'Does the WMS systems allow seamless integration to all relevant external data such as traffic, weather, shipment tracking etc.?'
];

const steps = [
  { label: 'Data and Cloud', status: 'active' },
  { label: 'Operational Innovations', status: 'inactive' },
  { label: 'Visibility and Proactive', status: 'inactive' },
  { label: 'Agentic  AI', status: 'inactive' }
];

const DataAndCloud = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showVisibilityProactive, setShowVisibilityProactive] = useState(false);

  const handleAnswer = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  const completedCount = answers.filter(Boolean).length;

  if (showVisibilityProactive) {
    return <VisibilityProactive />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Questionnaire</div>
        <div className={styles.sidebarDesc}>
          Structured framework for selecting functional requirements, prioritising them based on different measures for informed decision-making.
        </div>
        <div className={styles.steps}>
          {steps.map((step, idx) => (
            <div key={step.label} className={styles.stepItem}>
              <div className={step.status === 'active' ? styles.stepCircleActive : styles.stepCircleInactive}>
                {idx + 1}
              </div>
              <span className={step.status === 'active' ? styles.stepTextActive : styles.stepTextInactive}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbLink}>Home</span> &gt;{' '}
          <span className={styles.breadcrumbLink}>Digital Wayfinder</span> &gt;{' '}
          <span className={styles.breadcrumbCurrent}>Questionnaire</span>
        </div>
        <div className={styles.title}>Data and Cloud</div>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>Completed question {completedCount}/{questions.length}</span>
          <div className={styles.progressBarBg}>
            <div className={styles.progressBarFill} style={{ width: `${(completedCount / questions.length) * 100}%` }} />
          </div>
        </div>
        <div className={styles.questionsList}>
          {questions.map((q, idx) => (
            <div key={idx} className={styles.questionBlock}>
              <div className={styles.questionText}>{idx + 1}. {q}</div>
              <div className={styles.optionsRow}>
                {['High', 'Medium', 'Low'].map(opt => (
                  <label
                    key={opt}
                    className={
                      styles.optionLabel + ' ' +
                      (opt === 'High' ? styles.optionHigh : opt === 'Medium' ? styles.optionMedium : styles.optionLow) +
                      (answers[idx] === opt ? ' ' + styles.selected : '')
                    }
                  >
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={opt}
                      checked={answers[idx] === opt}
                      onChange={() => handleAnswer(idx, opt)}
                      className={styles.radio}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.prevBtn}>Previous</button>
          <button
            className={styles.saveBtn}
            disabled={completedCount !== questions.length}
            onClick={() => setShowVisibilityProactive(true)}
          >
            Save & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataAndCloud;