import React, { useState, useEffect } from 'react';
import styles from './DataAndCloud.module.css';
// import VisibilityProactive from './VisibilityProactive';
import Operational from './Operational';
import WmsSystem from './WmsSystem'; // Add import for WmsSystem
import { apiGet, apiPost } from '../../api';

const steps = [
  { label: 'Data and Cloud', status: 'active' },
  { label: 'Operational Innovations', status: 'inactive' },
  { label: 'Visibility and Proactive', status: 'inactive' },
  { label: 'Agentic  AI', status: 'inactive' }
];
 
const DataAndCloud = ({ onNavigateBack }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showVisibilityProactive, setShowVisibilityProactive] = useState(false);
  const [showWmsSystem, setShowWmsSystem] = useState(false);
  const [navigatingBack, setNavigatingBack] = useState(false);
  
  // New state for API response data
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [functionalArea, setFunctionalArea] = useState('');
  const [functionalSubArea, setFunctionalSubArea] = useState('');

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        const response = await apiGet(`api/digital-wayfinder/questionnaire/data-cloud/get-questions?functionalSubArea=${encodeURIComponent('Warehouse Management System')}`);
        
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

  const handlePrevious = async () => {
    // Check if there are any answers to save before going back
    const hasAnswers = answers.some(answer => answer !== null);
    
    if (hasAnswers) {
      try {
        setNavigatingBack(true);
        setError(null);
        
        // Save current progress before navigating back
        let area = functionalArea;
        if (!area && functionalSubArea) {
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
        
        // Create payload with only answered questions
        const answeredQuestions = questions
          .map((question, index) => ({
            question: question,
            answer: answers[index]?.toLowerCase() || ''
          }))
          .filter(item => item.answer !== ''); // Only include answered questions
        
        if (answeredQuestions.length > 0) {
          const payload = {
            functionalArea: area,
            functionalSubArea: functionalSubArea || '',
            answers: answeredQuestions,
            isPartialSave: true // Flag to indicate this is a partial save before navigation
          };
          
          console.log('Saving partial Data and Cloud progress before navigation:', payload);
          
          // Save the partial progress
          await apiPost('api/digital-wayfinder/questionnaire/data-cloud/save-answers', payload);
          console.log('Partial progress saved successfully');
        }
        
      } catch (err) {
        console.error('Error saving progress before navigation:', err);
        // Continue with navigation even if save fails
        console.log('Continuing with navigation despite save error');
      }
    }
    
    // Navigate back to WmsSystem
    if (onNavigateBack && typeof onNavigateBack === 'function') {
      console.log('Navigating back to WmsSystem using onNavigateBack callback');
      onNavigateBack();
    } else {
      // Fallback: Navigate directly to WmsSystem component
      console.log('Using fallback navigation to WmsSystem');
      setShowWmsSystem(true);
    }
    
    setNavigatingBack(false);
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
      
      const response = await apiPost('api/digital-wayfinder/questionnaire/data-cloud/save-answers', payload);

      console.log('Answers saved successfully:', response);
      
      // Navigate to next component
      setShowVisibilityProactive(true);
      
    } catch (err) {
      console.error('Error saving answers:', err);
      setError('Failed to save answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = answers.filter(Boolean).length;
  const allQuestionsAnswered = completedCount === questions.length;

  // Early return for navigation to WmsSystem
  if (showWmsSystem) {
    console.log('Navigating to WmsSystem component, showWmsSystem:', showWmsSystem);
    return <WmsSystem />;
  }

  if (showVisibilityProactive) {
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
                disabled={saving || navigatingBack}
                onClick={handlePrevious}
              >
                {navigatingBack ? 'Saving...' : 'Previous'}
              </button>
              <button
                className={styles.saveBtn}
                disabled={!allQuestionsAnswered || saving || navigatingBack}
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
 
export default DataAndCloud;