import React, { useState, useEffect } from 'react';
import styles from './IndustryVisibilityProactive.module.css';
import IndustryOperational from './IndustryOperational';
import IndustryAgenticAI from './IndustryAgenticAI';
import { apiGet, apiPost } from '../../api';

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
  const [functionalArea, setFunctionalArea] = useState('');
  const [functionalSubArea, setFunctionalSubArea] = useState('');

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
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching Visibility and Proactive questions and existing answers...');
        const response = await apiGet(`api/digital-wayfinder/questionnaire/visibility-proactive/get-questions?functionalSubArea=${encodeURIComponent('Industry Agnostic')}`);
        
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
              const answersResponse = await apiGet(`api/digital-wayfinder/questionnaire/operational-innovations/get-answers?functionalSubArea=${encodeURIComponent('Industry Agnostic')}`);
              
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
                <div className={styles.industryVisibilityProactiveProgressBarBg} style={{ width: '100%', maxWidth: '300px', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    className={styles.industryVisibilityProactiveProgressBarFill} 
                    style={{ 
                      width: `${Math.min(Math.max(progressPercentage, 0), 100)}%`,
                      height: '100%',
                      backgroundColor: '#9C27B0',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }} 
                  />
                </div>
              </div>
              <div className={styles.industryVisibilityProactiveQuestionsList}>
                {questions.map((questionObj, idx) => {
                  const questionText = questionObj.question || questionObj;
                  const answerType = questionObj.answerType || 'priority';
                  const options = getAnswerOptions(answerType);
                  
                  return (
                    <div key={idx} className={styles.industryVisibilityProactiveQuestionBlock} style={{ marginBottom: '24px', padding: '20px', backgroundColor: 'white', border: 'none', boxShadow: 'none', borderRadius: '8px' }}>
                      <div className={styles.industryVisibilityProactiveQuestionText} style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '500', color: '#333' }}>{idx + 1}. {questionText}</div>
                      <div className={styles.industryVisibilityProactiveOptionsRow}>
                        {options.map(opt => (
                          <label
                            key={opt}
                            className={styles.industryVisibilityProactiveOptionLabel}
                            style={{ display: 'flex', alignItems: 'center', marginRight: '20px', cursor: 'pointer' }}
                          >
                            <input
                              type="radio"
                              name={`q${idx}`}
                              value={opt}
                              checked={answers[idx] === opt}
                              onChange={() => handleAnswer(idx, opt)}
                              className={styles.industryVisibilityProactiveRadio}
                              style={{
                                accentColor: '#9C27B0',
                                marginRight: '8px',
                                width: '18px',
                                height: '18px'
                              }}
                            />
                            <span style={{ color: answers[idx] === opt ? '#9C27B0' : '#333', fontWeight: answers[idx] === opt ? '600' : '400' }}>{opt}</span>
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
                  style={{
                    backgroundColor: '#f5f5f5',
                    border: '2px solid #9C27B0',
                    color: '#9C27B0',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: (saving || navigatingBack) ? 'not-allowed' : 'pointer',
                    opacity: (saving || navigatingBack) ? 0.6 : 1,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!saving && !navigatingBack) {
                      e.target.style.backgroundColor = '#9C27B0';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!saving && !navigatingBack) {
                      e.target.style.backgroundColor = '#f5f5f5';
                      e.target.style.color = '#9C27B0';
                    }
                  }}
                >
                  {navigatingBack ? 'Saving...' : 'Previous'}
                </button>
                <button
                  className={styles.industryVisibilityProactiveSaveBtn}
                  disabled={!allQuestionsAnswered || saving || navigatingBack}
                  onClick={handleSaveAndProceed}
                  style={{
                    backgroundColor: '#9C27B0',
                    border: '2px solid #9C27B0',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: (!allQuestionsAnswered || saving || navigatingBack) ? 'not-allowed' : 'pointer',
                    opacity: (!allQuestionsAnswered || saving || navigatingBack) ? 0.6 : 1,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (allQuestionsAnswered && !saving && !navigatingBack) {
                      e.target.style.backgroundColor = '#7B1FA2';
                      e.target.style.borderColor = '#7B1FA2';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (allQuestionsAnswered && !saving && !navigatingBack) {
                      e.target.style.backgroundColor = '#9C27B0';
                      e.target.style.borderColor = '#9C27B0';
                    }
                  }}
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