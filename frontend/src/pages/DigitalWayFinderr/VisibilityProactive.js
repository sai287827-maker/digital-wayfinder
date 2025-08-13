import React, { useState, useEffect } from 'react';
import styles from './VisibilityProactive.module.css';
import AgenticAI from './AgenticAI';

const steps = [
  { label: 'Data and Cloud', status: 'completed' },
  { label: 'Operational Innovations', status: 'completed' },
  { label: 'Visibility and Proactive', status: 'active' },
  { label: 'Agentic AI', status: 'inactive' }
];

const VisibilityProactive = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAgenticAI, setShowAgenticAI] = useState(false);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/digital-wayfinder/questionnaire/visibility-proactive/get-questions?functionalSubArea=${encodeURIComponent('Warehouse Management System')}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setQuestions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSaveAndProceed = async () => {
    try {
      setSaving(true);
      
      // Call API to save answers
      const response = await fetch('/api/digital-wayfinder/questionnaire/visibility-proactive/save-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers,
          step: 'visibility-proactive'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Answers saved successfully:', result);
      
      // Navigate to Agentic AI component
      setShowAgenticAI(true);
      
    } catch (err) {
      console.error('Error saving answers:', err);
      setError('Failed to save answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = Object.keys(answers).filter(key => answers[key]).length;
  const totalQuestions = questions.length;
  const progressPercentage = totalQuestions > 0 ? (completedCount / totalQuestions) * 100 : 0;
  const allQuestionsAnswered = completedCount === totalQuestions;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.saveBtn} 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            <span className={styles.progressLabel}>Completed question {completedCount}/{totalQuestions}</span>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
          <div className={styles.questionsList}>
            {questions.map((question) => (
              <div key={question.id} className={styles.questionBlock}>
                <div className={styles.questionText}>{question.id}. {question.text}</div>
                <div className={styles.optionsRow}>
                  {['High', 'Medium', 'Low'].map(opt => (
                    <label key={opt} className={styles.optionLabel}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={opt}
                        checked={answers[question.id] === opt}
                        onChange={() => handleAnswer(question.id, opt)}
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
            <button className={styles.prevBtn} disabled={saving}>Previous</button>
            <button
              className={styles.saveBtn}
              disabled={!allQuestionsAnswered || saving}
              onClick={handleSaveAndProceed}
            >
              {saving ? 'Saving...' : 'Save & Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisibilityProactive;
