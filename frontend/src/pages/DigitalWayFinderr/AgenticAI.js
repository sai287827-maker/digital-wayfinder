import React, { useState, useEffect } from 'react';
import styles from './AgenticAI.module.css';
import { apiGet, apiPost } from '../../api';
 
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
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
 
  // New state for API response data
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [functionalArea, setFunctionalArea] = useState('');
  const [functionalSubArea, setFunctionalSubArea] = useState('');
 
  const steps = ai ? aiSteps : defaultSteps;
  const title = ai ? 'Agentic AI' : 'Visibility and Proactive';
 
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        const response = await apiGet(`api/digital-wayfinder/questionnaire/genai/get-questions?functionalSubArea=${encodeURIComponent('Warehouse Management System')}`);

        // Map the new response structure
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
          setFunctionalArea(area);
          setFunctionalSubArea(response.functionalSubArea || '');
        } else {
          // Fallback for old response structure
          setQuestions(response.questions || []);
          setAnswers(Array((response.questions || []).length).fill(null));
        }
      } catch (err) {
        setError('Failed to load questions.');
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);
 
  const handleAnswer = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };
 
  const handleSaveAndProceed = async () => {
    try {
      setSaving(true);
     
      // Call API to save answers
      const payload = {
        functionalArea: functionalArea,
        functionalSubArea: functionalSubArea,
        answers: questions.map((question, index) => ({
          question: question,
          answer: answers[index]?.toLowerCase() || ''
        }))
      };
     
      console.log('Sending payload:', payload);
     
      const response = await apiPost('api/digital-wayfinder/questionnaire/genai/saveanswers', payload);
 
      console.log('Answers saved successfully:', response);
     
      // Handle completion - could navigate to results page or show success message
      alert('Questionnaire completed successfully!');
     
    } catch (err) {
      console.error('Error saving answers:', err);
      setError('Failed to save answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };
 
  const completedCount = answers.filter(Boolean).length;
  const allQuestionsAnswered = completedCount === questions.length;
 
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
                      <span>{opt}</span>
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
              {saving ? 'Saving...' : (ai ? 'Finish' : 'Save & Proceed')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default AgenticAI;