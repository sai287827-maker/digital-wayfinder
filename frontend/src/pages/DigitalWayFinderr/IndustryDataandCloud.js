import React, { useState, useEffect } from 'react';
import styles from './IndustryDataandCloud.module.css';
// import VisibilityProactive from './VisibilityProactive';
import IndustryOperational from './IndustryOperational';
import IndustryTypePlanParts from './IndustryTypePlanParts'; // Add import for WmsSystem
import { apiGet, apiPost } from '../../api';

const steps = [
  { label: 'Data and Cloud', status: 'active' },
  { label: 'Operational Innovations', status: 'inactive' },
  { label: 'Visibility and Proactive', status: 'inactive' },
  { label: 'Agentic  AI', status: 'inactive' }
];
 
const IndustryDataandCloud = ({ onNavigateBack }) => {
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
        const response = await apiGet(`api/digital-wayfinder/questionnaire/data-cloud/get-questions?functionalSubArea=${encodeURIComponent('Industry Agnostic')}`);
        
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
    return <IndustryTypePlanParts />;
  }

  if (showVisibilityProactive) {
    return <IndustryOperational />;
  }
 
  return (
    <div className={styles.industryDataCloudWrapper}>
      <div className={styles.industryDataCloudBreadcrumb}>
        <span className={styles.industryDataCloudBreadcrumbLink}>Home</span> &gt;{' '}
        <span className={styles.industryDataCloudBreadcrumbLink}>Digital Wayfinder</span> &gt;{' '}
        <span className={styles.industryDataCloudBreadcrumbCurrent}>Questionnaire</span>
      </div>
      <div className={styles.industryDataCloudContainer}>
        <div className={styles.industryDataCloudSidebar}>
          <div className={styles.industryDataCloudSidebarTitle}>Questionnaire</div>
          <div className={styles.industryDataCloudSidebarDesc}>
            Structured framework for selecting functional requirements, prioritising them based on different measures for informed decision-making.
          </div>
          <div className={styles.industryDataCloudSteps}>
            {steps.map((step, idx) => (
              <div key={step.label} className={styles.industryDataCloudStepItem}>
                <div className={step.status === 'active' ? styles.industryDataCloudStepCircleActive : styles.industryDataCloudStepCircleInactive}>
                  {idx + 1}
                </div>
                <span className={step.status === 'active' ? styles.industryDataCloudStepTextActive : styles.industryDataCloudStepTextInactive}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.industryDataCloudMainContent}>
        <div className={styles.industryDataCloudTitle}>Industry Data and Cloud</div>
        {loading ? (
          <div className={styles.industryDataCloudLoading}>Loading questions...</div>
        ) : error ? (
          <div className={styles.industryDataCloudError}>{error}</div>
        ) : (
          <>
            <div className={styles.industryDataCloudProgressRow}>
              <span className={styles.industryDataCloudProgressLabel}>Completed question {completedCount}/{questions.length}</span>
              <div className={styles.industryDataCloudProgressBarBg}>
                <div className={styles.industryDataCloudProgressBarFill} style={{ width: `${questions.length > 0 ? (completedCount / questions.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div className={styles.industryDataCloudQuestionsList}>
              {questions.map((q, idx) => (
                <div key={idx} className={styles.industryDataCloudQuestionBlock}>
                  <div className={styles.industryDataCloudQuestionText}>{idx + 1}. {q}</div>
                  <div className={styles.industryDataCloudOptionsRow}>
                    {['High', 'Medium', 'Low'].map(opt => (
                      <label
                        key={opt}
                        className={styles.industryDataCloudOptionLabel}
                      >
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => handleAnswer(idx, opt)}
                          className={styles.industryDataCloudRadio}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.industryDataCloudButtonRow}>
              <button 
                className={styles.industryDataCloudPrevBtn} 
                disabled={saving || navigatingBack}
                onClick={handlePrevious}
              >
                {navigatingBack ? 'Saving...' : 'Previous'}
              </button>
              <button
                className={styles.industryDataCloudSaveBtn}
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
    </div>
  )};
 
export default IndustryDataandCloud;