import React, { useState } from 'react';
import styles from './AgenticAI.module.css';

const defaultQuestions = [
  'Does the WMS systems provides a dedicated real-time visibility capability across all operations within the warehouse ?',
  'Do you leverage any cloud based solution to have an eye over all warehouse operations ?',
  'Please rate the existing warehousing visibility capability (Strictly from a visibility perspective)',
  'Does the WMS systems provide customised reporting capability ?',
  'Do you leverage any cloud based solution such as power BI/Tableau for custom reporting?',
  'Does the reporting capability support NLP/Custom Visuals based on user requirement dynamically?',
  'Does the WMS systems provide customised reporting capability ?',
  'Do you leverage any cloud based solution such as power BI/Tableau for custom reporting?',
  'Does the WMS systems provide real-time alerting capability?'
];

const aiQuestions = [
  'Does the WMS systems provides Gen AI based capabilities ?',
  'Do you use cloud based Gen AI capabilities for various use cases ?',
  'Do you leverage Gen AI to generate based dynamic Loading/unloading plan based on internal & external data inputs ?',
  'Does the warehousing Visibility capability supports predictive alerts (based on internal & external data) and recommend actions ?',
  'Do you have a chat platform to quickly query the WMS systems and generate human like output to different queries ?',
  'Do you have ability to run what if scenarios for use cases such as checking stock levels, replenishment rate in case of various situations etc. ?'
];

const defaultSteps = [
  { label: 'Data and Cloud', status: 'completed' },
  { label: 'Operational Innovations', status: 'completed' },
  { label: 'Visibility and Proactive', status: 'active' },
  { label: 'Agentic AI', status: 'inactive' }
];

const aiSteps = [
  { label: 'Data and Cloud', status: 'completed' },
  { label: 'Operational Innovations', status: 'completed' },
  { label: 'Visibility and Proactive', status: 'completed' },
  { label: 'Agentic AI', status: 'active' }
];

const AgenticAI = ({ ai }) => {
  const questions = ai ? aiQuestions : defaultQuestions;
  const steps = ai ? aiSteps : defaultSteps;
  const title = ai ? 'Agentic AI' : 'Visibility and Proactive';
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const handleAnswer = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  const completedCount = answers.filter(Boolean).length;

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
          <div className={styles.title}>{title}</div>
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
            <button className={styles.saveBtn} disabled={completedCount !== questions.length}>
              {ai ? 'Finish' : 'Save & Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgenticAI;
