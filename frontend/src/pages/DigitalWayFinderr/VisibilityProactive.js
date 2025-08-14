import React, { useState, useEffect } from 'react';
import styles from './VisibilityProactive.module.css';
import AgenticAI from './AgenticAI';
import Operational from './Operational';
import { apiGet, apiPost } from '../../api';

const steps = [
  { label: 'Data and Cloud', status: 'completed' },
  { label: 'Operational Innovations', status: 'completed' },
  { label: 'Visibility and Proactive', status: 'active' },
  { label: 'Agentic AI', status: 'inactive' }
];

const VisibilityProactive = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAgenticAI, setShowAgenticAI] = useState(false);
  const [showOperational, setShowOperational] = useState(false);
  
  // State for API response data
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [functionalArea, setFunctionalArea] = useState('');
  const [functionalSubArea, setFunctionalSubArea] = useState('');

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching visibility-proactive questions...');

        const response = await apiGet(`api/digital-wayfinder/questionnaire/visibility-proactive/get-questions?functionalSubArea=${encodeURIComponent('Warehouse Management System')}`);

        console.log('API Response:', response);

        // Map the response structure similar to Operational component
        if (response.questions && Array.isArray(response.questions)) {
          // Extract questions from the response
          const questionTexts = response.questions.map(q => q.question);
          setQuestions(questionTexts);
          
          // Initialize answers array
          const initialAnswers = Array(questionTexts.length).fill(null);
          
          // If there are existing answers in the response, load them
          if (response.answers && Array.isArray(response.answers)) {
            response.answers.forEach(answerObj => {
              const questionIndex = questionTexts.findIndex(q => q === answerObj.question);
              if (questionIndex !== -1) {
                // Convert lowercase answer to proper case for display
                const answerValue = answerObj.answer.charAt(0).toUpperCase() + answerObj.answer.slice(1);
                initialAnswers[questionIndex] = answerValue;
              }
            });
          }
          
          setAnswers(initialAnswers);
          
          // Set other response data
          setUserId(response.userId || '');
          setSessionId(response.sessionId || '');
          
          // Set functional area - if not provided, determine from functionalSubArea
          let area = response.functionalArea || '';
          if (!area && response.functionalSubArea) {
            // Map functional sub-areas to functional areas
            const areaMapping = {
              'Warehouse Management System': 'Supply Chain Fulfillment',
              'Inventory Management': 'Supply Chain Fulfillment',
              'Order Management': 'Supply Chain Fulfillment',
              'Transportation Management': 'Supply Chain Fulfillment',
              'Customer Relationship Management': 'Customer Experience',
              'Sales Management': 'Customer Experience',
              'Marketing Automation': 'Customer Experience',
              'Financial Management': 'Financial Operations',
              'Accounting': 'Financial Operations',
              'Procurement': 'Financial Operations'
            };
            area = areaMapping[response.functionalSubArea] || 'Supply Chain Fulfillment';
          }
          // Default fallback if still empty
          if (!area) {
            area = 'Supply Chain Fulfillment';
          }
          setFunctionalArea(area);
          setFunctionalSubArea(response.functionalSubArea || '');
        } else {
          // Fallback for different response structure
          setQuestions(response.questions || []);
          setAnswers(Array((response.questions || []).length).fill(null));
        }
        
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  const handlePrevious = () => {
    console.log('Navigating back to Operational component');
    setShowOperational(true);
  };

  const handleSaveAndProceed = async () => {
    // Validate that all questions are answered
    if (!allQuestionsAnswered) {
      setError('Please answer all questions before proceeding.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Ensure functional area is set with fallback
      let area = functionalArea;
      if (!area && functionalSubArea) {
        // Map functional sub-areas to functional areas
        const areaMapping = {
          'Warehouse Management System': 'Supply Chain Fulfillment',
          'Inventory Management': 'Supply Chain Fulfillment',
          'Order Management': 'Supply Chain Fulfillment',
          'Transportation Management': 'Supply Chain Fulfillment',
          'Customer Relationship Management': 'Customer Experience',
          'Sales Management': 'Customer Experience',
          'Marketing Automation': 'Customer Experience',
          'Financial Management': 'Financial Operations',
          'Accounting': 'Financial Operations',
          'Procurement': 'Financial Operations'
        };
        area = areaMapping[functionalSubArea] || 'Supply Chain Fulfillment';
      }
      // Default fallback if still empty
      if (!area) {
        area = 'Supply Chain Fulfillment';
      }
      
      // Call API to save answers
      const payload = {
        functionalArea: area,
        functionalSubArea: functionalSubArea || '',
        answers: questions.map((question, index) => ({
          question: question,
          answer: answers[index]?.toLowerCase() || ''
        }))
      };
      
      console.log('Sending payload:', payload);
      
      const response = await apiPost('api/digital-wayfinder/questionnaire/visibility-proactive/save-answers', payload);

      console.log('Answers saved successfully:', response);
      console.log('Setting showAgenticAI to true');
      
      // Navigate to Agentic AI component
      setShowAgenticAI(true);
      
    } catch (err) {
      console.error('Error saving answers:', err);
      setError('Failed to save answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = answers.filter(Boolean).length;
  const allQuestionsAnswered = completedCount === questions.length && questions.length > 0;

  // Early return for navigation to AgenticAI
  if (showAgenticAI) {
    console.log('Navigating to AgenticAI component, showAgenticAI:', showAgenticAI);
    return <AgenticAI />;
  }

  // Early return for navigation to Operational (Previous button)
  if (showOperational) {
    console.log('Navigating back to Operational component, showOperational:', showOperational);
    return <Operational />;
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
              <div className={step.status === 'completed' ? styles.stepCircleCompleted : 
                              step.status === 'active' ? styles.stepCircleActive : 
                              styles.stepCircleInactive}>
                {step.status === 'completed' ? '✓' : idx + 1}
              </div>
              <span className={step.status === 'completed' ? styles.stepTextCompleted :
                              step.status === 'active' ? styles.stepTextActive : 
                              styles.stepTextInactive}>
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
        <div className={styles.title}>Visibility and Proactive</div>
        {loading ? (
          <div className={styles.loading}>Loading questions...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            <div className={styles.progressRow}>
              <span className={styles.progressLabel}>Completed question {completedCount}/{questions.length}</span>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${questions.length > 0 ? (completedCount / questions.length) * 100 : 0}%` }} />
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
                        className={styles.optionLabel}
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
              <button 
                className={styles.prevBtn} 
                disabled={saving}
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button
                className={styles.saveBtn}
                disabled={!allQuestionsAnswered || saving}
                onClick={handleSaveAndProceed}
              >
                {saving ? 'Saving...' : 'Save & Proceed'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VisibilityProactive;