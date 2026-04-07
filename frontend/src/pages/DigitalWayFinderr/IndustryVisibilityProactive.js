import React, { useState, useEffect } from 'react';
import styles from './IndustryVisibilityProactive.module.css';
import IndustryOperational from './IndustryOperational';
import IndustryAgenticAI from './IndustryAgenticAI';
import { apiGet, apiPost } from '../../api';
import { useFunctionalArea } from '../../hooks/useFunctionalArea';

const steps = [
  { label: 'Data and Cloud', status: 'completed' },
  { label: 'Industry Operational', status: 'completed' },
  { label: 'Visibility and Proactive', status: 'active' },
  { label: 'Agentic AI', status: 'inactive' }
];
 
const IndustryVisibilityProactive = ({ onNavigateBack }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showIndustryOperational, setShowIndustryOperational] = useState(false);
  const [showAgenticAI, setShowAgenticAI] = useState(false);
  const [navigatingBack, setNavigatingBack] = useState(false);
  
  // New state for API response data
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  // use shared hook for functional area/sub‑area
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
      console.log('IndustryVisibilityProactive component mounted with effectiveSubArea:', effectiveSubArea);
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching Visibility and Proactive questions and existing answers...');
        const response = await apiGet(`api/digital-wayfinder/questionnaire/visibility-proactive/get-questions?functionalSubArea=${encodeURIComponent(effectiveSubArea)}`);
        
        console.log('Visibility and Proactive API Response:', response);
        
        // Map the new response structure
        if (response.questions && Array.isArray(response.questions)) {
          // Store full question objects with answerType
          setQuestions(response.questions);
          
          // Initialize answers array
          const initialAnswers = Array(response.questions.length).fill(null);
          
          // If there are existing answers in the response, load them
          if (response.answers && Array.isArray(response.answers)) {
            console.log('Loading existing answers:', response.answers);
            response.answers.forEach(answerObj => {
              const questionIndex = response.questions.findIndex(q => q.question === answerObj.question);
              if (questionIndex !== -1) {
                // Convert lowercase answer to proper case for display
                const answerValue = answerObj.answer.charAt(0).toUpperCase() + answerObj.answer.slice(1);
                initialAnswers[questionIndex] = answerValue;
                console.log(`Loaded answer for question ${questionIndex}: ${answerValue}`);
              } else {
                console.warn('Could not find matching question for answer:', answerObj);
              }
            });
          } else {
            console.log('No existing answers found in response');
            
            // Check if we should try to fetch existing answers separately
            // This is a fallback in case the get-questions endpoint doesn't return answers
            try {
              console.log('Attempting to fetch existing answers separately...');
              const answersResponse = await apiGet(`api/digital-wayfinder/questionnaire/operational-innovations/get-answers?functionalSubArea=${encodeURIComponent(effectiveSubArea)}`);
              
              if (answersResponse && answersResponse.answers && Array.isArray(answersResponse.answers)) {
                console.log('Found existing answers in separate call:', answersResponse.answers);
                answersResponse.answers.forEach(answerObj => {
                  const questionIndex = response.questions.findIndex(q => q.question === answerObj.question);
                  if (questionIndex !== -1) {
                    const answerValue = answerObj.answer.charAt(0).toUpperCase() + answerObj.answer.slice(1);
                    initialAnswers[questionIndex] = answerValue;
                    console.log(`Loaded answer from separate call for question ${questionIndex}: ${answerValue}`);
                  }
                });
              }
            } catch (separateErr) {
              console.log('Separate answers fetch failed (this is expected if endpoint doesn\'t exist):', separateErr.message);
            }
          }
          
          setAnswers(initialAnswers);
          console.log('Final answers array:', initialAnswers);
          
          // Set other response data
          setUserId(response.userId || '');
          setSessionId(response.sessionId || '');
          
          // Set functional area - if not provided, determine from functionalSubArea
           // Set functional area - if not provided, determine from functionalSubArea
          // push values into hook state; deriveArea will compute a fallback
          if (response.functionalSubArea && response.functionalSubArea !== functionalSubArea) {
            setFunctionalSubArea(response.functionalSubArea);
          }
          if (response.functionalArea && response.functionalArea !== functionalArea) {
            setFunctionalArea(response.functionalArea);
          }

        } else {
          // Fallback for old response structure
          console.log('Using fallback structure for questions');
          const questionObjects = (response.questions || []).map(q => ({
            question: typeof q === 'string' ? q : q.question || '',
            answerType: typeof q === 'object' ? q.answerType || 'priority' : 'priority'
          }));
          setQuestions(questionObjects);
          setAnswers(Array(questionObjects.length).fill(null));
        }
      } catch (err) {
        console.error('Error fetching Visibility and Proactive questions:', err);
        setError('Failed to load questions.');
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [effectiveSubArea]);
 
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
        // the hook already keeps functionalArea up to date via deriveArea
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
          
          console.log('Saving partial Visibility and Proactive progress before navigation:', payload);
          
          // Save the partial progress
          await apiPost('api/digital-wayfinder/questionnaire/visibility-proactive/save-answers', payload);
          console.log('Partial progress saved successfully');
        }
        
      } catch (err) {
        console.error('Error saving progress before navigation:', err);
        // Continue with navigation even if save fails
        console.log('Continuing with navigation despite save error');
      }
    }
    
    // Navigate back to IndustryOperational
    if (onNavigateBack && typeof onNavigateBack === 'function') {
      console.log('Navigating back to IndustryOperational using onNavigateBack callback');
      onNavigateBack();
    } else {
      // Fallback: Navigate directly to IndustryOperational component
      console.log('Using fallback navigation to IndustryOperational');
      setShowIndustryOperational(true);
    }
    
    setNavigatingBack(false);
  };
 
  const handleSaveAndProceed = async () => {
    // Validate that all questions are answered
    if (!allQuestionsAnswered) {
      setError('Please answer all questions before proceeding.');
      return;
    }
 
    try {
      setSaving(true);
      setError(null); // Clear any previous errors
      
      // Ensure functional area is set with fallback
      let area = functionalArea;
      
      // Call API to save answers
      const payload = {
        functionalArea: area,
        functionalSubArea: functionalSubArea || '',
        answers: questions.map((questionObj, index) => ({
          question: questionObj.question || questionObj,
          answer: answers[index]?.toLowerCase() || ''
        }))
      };
      
      console.log('Sending payload:', payload);
      
      const response = await apiPost('api/digital-wayfinder/questionnaire/visibility-proactive/save-answers', payload);
 
      console.log('Answers saved successfully:', response);
      
      // Navigate to AgenticAI component
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
  
  // Calculate progress percentage
  const progressPercentage = questions.length > 0 ? (completedCount / questions.length) * 100 : 0;
  
  // Debug logging for progress bar
  console.log('Progress Debug:', {
    completedCount,
    totalQuestions: questions.length,
    progressPercentage,
    answers
  });
 
  // Early return for navigation to AgenticAI
  if (showAgenticAI) {
    console.log('Navigating to AgenticAI component');
    return <IndustryAgenticAI />;
  }

  // Early return for navigation to IndustryOperational (Previous button)
  if (showIndustryOperational) {
    console.log('Navigating back to IndustryOperational component, showIndustryOperational:', showIndustryOperational);
    return <IndustryOperational />;
  }
 
  return (
    <div className={styles.industryVisibilityProactiveContainer}>
      {/* Breadcrumb Row with Background */}
      <div className={styles.industryVisibilityProactiveBreadcrumbRow}>
        <div className={styles.industryVisibilityProactiveBreadcrumbContent}>
          <span className={styles.industryVisibilityProactiveBreadcrumbLink}>Home</span> &gt;{' '}
          <span className={styles.industryVisibilityProactiveBreadcrumbLink}>Digital Wayfinder</span> &gt;{' '}
          <span className={styles.industryVisibilityProactiveBreadcrumbCurrent}>Questionnaire</span>
        </div>
      </div>

      <div className={styles.industryVisibilityProactiveMainWrapper}>
        <div className={styles.industryVisibilityProactiveSidebar}>
          <div className={styles.industryVisibilityProactiveSidebarTitle}>Questionnaire</div>
          <div className={styles.industryVisibilityProactiveSidebarDesc}>
            Structured framework for selecting functional requirements, prioritising them based on different measures for informed decision-making.
          </div>
          <div className={styles.industryVisibilityProactiveSteps}>
            {steps.map((step, idx) => (
              <div key={step.label} className={styles.industryVisibilityProactiveStepItem}>
                <div className={step.status === 'completed' ? styles.industryVisibilityProactiveStepCircleCompleted : 
                                step.status === 'active' ? styles.industryVisibilityProactiveStepCircleActive : 
                                styles.industryVisibilityProactiveStepCircleInactive}
                     style={{
                       backgroundColor: step.status === 'completed' ? '#4CAF50' : 
                                      step.status === 'active' ? '#9C27B0' : '#e0e0e0',
                       color: step.status === 'inactive' ? '#666' : 'white'
                     }}>
                  {step.status === 'completed' ? '✓' : idx + 1}
                </div>
                <span className={step.status === 'completed' ? styles.industryVisibilityProactiveStepTextCompleted :
                                step.status === 'active' ? styles.industryVisibilityProactiveStepTextActive : 
                                styles.industryVisibilityProactiveStepTextInactive}
                      style={{
                        color: step.status === 'completed' ? '#4CAF50' : 
                               step.status === 'active' ? '#9C27B0' : '#666',
                        fontWeight: step.status === 'active' ? '600' : '400'
                      }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.industryVisibilityProactiveMainContent}>
          <div className={styles.industryVisibilityProactiveTitle}>Visibility and Proactive</div>
          {loading ? (
            <div className={styles.industryVisibilityProactiveLoading}>Loading questions...</div>
          ) : error ? (
            <div className={styles.industryVisibilityProactiveError}>{error}</div>
          ) : (
            <>
              <div className={styles.industryVisibilityProactiveProgressRow}>
                <span className={styles.industryVisibilityProactiveProgressLabel}>Completed question {completedCount}/{questions.length}</span>
                <div className={styles.industryVisibilityProactiveProgressBarBg}>
                  <div 
                    className={styles.industryVisibilityProactiveProgressBarFill} 
                    style={{ width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` }}
                  />
                </div>
              </div>
              <div className={styles.industryVisibilityProactiveQuestionsList}>
                {questions.map((questionObj, idx) => {
                  const questionText = questionObj.question || questionObj;
                  const answerType = questionObj.answerType || 'priority';
                  const options = getAnswerOptions(answerType);
                  
                  return (
                    <div key={idx} className={styles.industryVisibilityProactiveQuestionBlock}>
                      <div className={styles.industryVisibilityProactiveQuestionText}>{idx + 1}. {questionText}</div>
                      <div className={styles.industryVisibilityProactiveOptionsRow}>
                        {options.map(opt => (
                          <label
                            key={opt}
                            className={styles.industryVisibilityProactiveOptionLabel}
                          >
                            <input
                              type="radio"
                              name={`q${idx}`}
                              value={opt}
                              checked={answers[idx] === opt}
                              onChange={() => handleAnswer(idx, opt)}
                              className={styles.industryVisibilityProactiveRadio}
                            />
                            <span className={answers[idx] === opt ? styles.industryVisibilityProactiveOptionTextSelected : styles.industryVisibilityProactiveOptionText}>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.industryVisibilityProactiveButtonRow}>
                <button 
                  className={styles.industryVisibilityProactivePrevBtn} 
                  disabled={saving || navigatingBack}
                  onClick={handlePrevious}
                >
                  {navigatingBack ? 'Saving...' : 'Previous'}
                </button>
                <button
                  className={styles.industryVisibilityProactiveSaveBtn}
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
 
export default IndustryVisibilityProactive;