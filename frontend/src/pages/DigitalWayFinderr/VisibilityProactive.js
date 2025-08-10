import React, { useState } from 'react';
import styles from './VisibilityProactive.module.css';
import AgenticAI from './AgenticAI';

const questions = [
  'Does the WMS system provide a dedicated real-time visibility capability across all operations within the warehouse?',
  'Do you leverage any cloud-based solution to monitor all warehouse operations?',
  'Please rate the existing warehousing visibility capability (strictly from a visibility perspective).',
  'Does the WMS system provide customised reporting capability?',
  'Do you leverage any cloud based solution such as power BI/Tableau for custom reporting?',
  'Does the reporting capability support NLP/Custom Visuals based on user requirement dynamically?',
  'Does the WMS systems provide customised reporting capability ?',
  'Do you leverage any cloud based solution such as power BI/Tableau for custom reporting?',
  'Does the WMS systems provide real-time alerting capability?'
];

const steps = [
  { label: 'Data and Cloud', status: 'completed' },
  { label: 'Operational Innovations', status: 'completed' },
  { label: 'Visibility and Proactive', status: 'active' },
  { label: 'Agentic AI', status: 'inactive' }
];

const VisibilityProactive = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showAgenticAI, setShowAgenticAI] = useState(false);

  const handleAnswer = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  const completedCount = answers.filter(Boolean).length;

  if (showAgenticAI) {
    console.log('showAgenticAI', showAgenticAI);
    return <AgenticAI ai />;
  }
  console.log('showAgenticAI');
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbLink}>Home</span> &gt;{' '}
        <span className={styles.breadcrumbLink}>Digital Wayfinder</span> &gt;{' '}
        <span className={styles.breadcrumbCurrent}>Questionnaire</span>
      </div>
      <div className={styles.layout}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Questionnaire</div>
          <div className={styles.sidebarDesc}>
            Structured framework for selecting functional requirements, prioritising them based on different measures for informed decision-making.
          </div>
          <div className={styles.steps}>
            {steps.map((step, idx) => (
              <div key={step.label} className={styles.stepItem}>
                <div className={
                  step.status === 'completed' ? styles.stepCircleCompleted :
                  step.status === 'active' ? styles.stepCircleActive :
                  styles.stepCircleInactive
                }>
                  {step.status === 'completed' ? <span>&#10003;</span> : idx + 1}
                </div>
                <span className={
                  step.status === 'active' ? styles.stepTextActive :
                  step.status === 'completed' ? styles.stepTextCompleted :
                  styles.stepTextInactive
                }>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.title}>Visibility and Proactive</div>
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
                    <label key={opt} className={styles.optionLabel}>
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleAnswer(idx, opt)}
                        className={styles.radio}
                      />
                      {opt}
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
              onClick={() => setShowAgenticAI(true)}
            >
              Save & Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisibilityProactive;
