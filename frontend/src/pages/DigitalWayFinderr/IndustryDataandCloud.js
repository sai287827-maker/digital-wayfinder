import React, { useState, useEffect } from 'react';
import styles from './IndustryDataandCloud.module.css';
import { useFunctionalArea } from '../../hooks/useFunctionalArea';
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
  const [showIndustryOperational, setShowIndustryOperational] = useState(false);
  const [showIndustryTypePlanParts, setShowIndustryTypePlanParts] = useState(false);
  const [navigatingBack, setNavigatingBack] = useState(false);
  
  // New state for API response data
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  // Use shared hook for functional area/sub–area
  const {
    functionalArea,
    functionalSubArea,
    setFunctionalArea,
    setFunctionalSubArea,
    deriveArea,
    effectiveSubArea
  } = useFunctionalArea();
  

  // Helper function to get answer options based on answerType
  const getAnswerOptions = (answerType) => {
    switch(answerType?.toLowerCase()) {
      case 'yes/no':
      case 'yesno':
        return ['Yes', 'No']; 
      case 'priority':
      case 'high/medium/low':
        return ['High', 'Medium', 'Low'];
      default:
        return ['High', 'Medium', 'Low']; // Default fallback
    }
  };

  useEffect(() => {
    async function fetchQuestions() {
      
      console.log('IndustryDataandCloud rendered with functionalArea:', functionalArea, 'functionalSubArea:', functionalSubArea, 'effectiveSubArea:', effectiveSubArea);
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiGet(`api/digital-wayfinder/questionnaire/data-cloud/get-questions?functionalSubArea=${encodeURIComponent(effectiveSubArea)}`);
        
        // Map the new response structure
        if (response.questions && Array.isArray(response.questions)) {
          // Store full question objects with answerType
          setQuestions(response.questions);
          
          // Initialize answers array
          const initialAnswers = Array(response.questions.length).fill(null);
          
          // If there are existing answers in the response, load them
          if (response.answers && Array.isArray(response.answers)) {
            response.answers.forEach(answerObj => {
              const questionIndex = response.questions.findIndex(q => q.question === answerObj.question);
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
          
          // Push API response into hook state; deriveArea effect will sync functional area
          if (response.functionalSubArea) {
            setFunctionalSubArea(response.functionalSubArea);
          }
          if (response.functionalArea) {
            setFunctionalArea(response.functionalArea);
          }
        } else {
          // Fallback for old response structure
          const questionObjects = (response.questions || []).map(q => ({
            question: typeof q === 'string' ? q : q.question || '',
            answerType: typeof q === 'object' ? q.answerType || 'priority' : 'priority'
          }));
          setQuestions(questionObjects);
          setAnswers(Array(questionObjects.length).fill(null));
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
        const area = deriveArea();
        
        // Create payload with only answered questions
        const answeredQuestions = questions
          .map((questionObj, index) => ({
            question: questionObj.question || questionObj,
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
      // Fallback: Navigate directly to IndustryTypePlanParts component
      console.log('Using fallback navigation to IndustryTypePlanParts');
      setShowIndustryTypePlanParts(true);
    }
    
    setNavigatingBack(false);
  };

  const handleSaveAndProceed = async () => {
    try {
      setSaving(true);
      
      // Call API to save answers
      const area = deriveArea();
      const payload = {
        functionalArea: area,
        functionalSubArea: functionalSubArea,
        answers: questions.map((questionObj, index) => ({
          question: questionObj.question || questionObj,
          answer: answers[index]?.toLowerCase() || ''
        }))
      };
      
      console.log('Sending payload:', payload);
      
      const response = await apiPost('api/digital-wayfinder/questionnaire/data-cloud/save-answers', payload);

      console.log('Answers saved successfully:', response);
      
      // Navigate to next component
      setShowIndustryOperational(true);
      
    } catch (err) {
      console.error('Error saving answers:', err);
      setError('Failed to save answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = answers.filter(Boolean).length;
  const allQuestionsAnswered = completedCount === questions.length;

  // Early return for navigation to IndustryTypePlanParts
  if (showIndustryTypePlanParts) {
    console.log('Navigating to IndustryTypePlanParts component, showIndustryTypePlanParts:', showIndustryTypePlanParts);
    return <IndustryTypePlanParts />;
  }

  if (showIndustryOperational) {
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
              {questions.map((questionObj, idx) => {
                const questionText = questionObj.question || questionObj;
                const answerType = questionObj.answerType || 'priority';
                const options = getAnswerOptions(answerType);
                
                return (
                  <div key={idx} className={styles.industryDataCloudQuestionBlock}>
                    <div className={styles.industryDataCloudQuestionText}>{idx + 1}. {questionText}</div>
                    <div className={styles.industryDataCloudOptionsRow}>
                      {options.map(opt => (
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
                );
              })}
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
  );
};
 
export default IndustryDataandCloud;