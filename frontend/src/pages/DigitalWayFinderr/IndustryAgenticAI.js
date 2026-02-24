import React, { useState, useEffect } from 'react';
import styles from './IndustryAgenticAI.module.css';
import { apiGet, apiPost } from '../../api';
import IndustryReport from './IndustryReport';

const steps = [
  { label: 'Data and Cloud', status: 'completed' },
  { label: 'Operational Innovations', status: 'completed' },
  { label: 'Visibility and Proactive', status: 'completed' },
  { label: 'Agentic AI', status: 'active' }
];

const IndustryAgenticAI = ({ onNavigateBack }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [answerOptions, setAnswerOptions] = useState([]);                  // added
  const [questionAnswerTypes, setQuestionAnswerTypes] = useState([]);      // added
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showIndustryReport, setShowIndustryReport] = useState(false);
  const [navigatingBack, setNavigatingBack] = useState(false);
  
  // State for API response data
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [functionalArea, setFunctionalArea] = useState('');
  const [functionalSubArea, setFunctionalSubArea] = useState('');

  // helper to derive options from response structure or existing answers
  const determineAnswerOptions = (apiResponse) => {
    if (apiResponse.questions && Array.isArray(apiResponse.questions)) {
      const firstQuestion = apiResponse.questions[0];
      if (firstQuestion && firstQuestion.answerType) {
        const answerType = firstQuestion.answerType.toLowerCase();
        if (answerType.includes('yes') && answerType.includes('no')) {
          return ['Yes', 'No'];
        } else if (answerType.includes('high') && answerType.includes('medium') && answerType.includes('low')) {
          return ['High', 'Medium', 'Low'];
        }
      }
    }
    if (apiResponse.answers && Array.isArray(apiResponse.answers)) {
      const existingAnswers = apiResponse.answers.map(a => a.answer?.toLowerCase());
      const hasYesNo = existingAnswers.some(answer => ['yes','no'].includes(answer));
      const hasHighMediumLow = existingAnswers.some(answer => ['high','medium','low'].includes(answer));
      if (hasYesNo) return ['Yes','No'];
      if (hasHighMediumLow) return ['High','Medium','Low'];
    }
    return ['High','Medium','Low'];
  };

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching Agentic AI questions...');

        // For testing purposes, let's add some fallback questions if API fails
        const mockQuestions = [
          "Do you use cloud services (Any cloud service provider) to augment WMS capabilities ?",
          "How would you rate existing capability in integrating real-time data to cloud for various use cases ?",
          "Do you have a unified data model as a single source of truth for analytics/AI-ML use cases ?",
          "Does the WMS systems allows seamless integration to all relevant external data such as traffic, weather, shipment tracking etc."
        ];

        const response = await apiGet(`api/digital-wayfinder/questionnaire/genai/get-questions?functionalSubArea=${encodeURIComponent('Industry Agnostic')}`);

        console.log('Agentic AI API Response:', response);

        // Map the response structure
        if (response && response.questions && Array.isArray(response.questions) && response.questions.length > 0) {
          // Extract questions from the response
          const questionTexts = response.questions.map(q => q.question || q);

          // derive answer types per question if provided
          const answerTypes = response.questions.map(q => {
            if (q.answerType) {
              const answerType = q.answerType.toLowerCase();
              if (answerType.includes('yes') && answerType.includes('no')) {
                return ['Yes', 'No'];
              } else if (answerType.includes('high') && answerType.includes('medium') && answerType.includes('low')) {
                return ['High', 'Medium', 'Low'];
              }
            }
            return ['High', 'Medium', 'Low'];
          });

          setQuestions(questionTexts);
          setQuestionAnswerTypes(answerTypes);

          const options = determineAnswerOptions(response);
          setAnswerOptions(options);
          console.log('Determined answer options for IndustryAgenticAI:', options);

          const initialAnswers = Array(questionTexts.length).fill(null);

          // If there are existing answers in the response, load them
          if (response.answers && Array.isArray(response.answers)) {
            response.answers.forEach(answerObj => {
              const questionIndex = questionTexts.findIndex(q => q === (answerObj.question || answerObj));
              if (questionIndex !== -1) {
                const answerValue = answerObj.answer ? answerObj.answer.charAt(0).toUpperCase() + answerObj.answer.slice(1) : answerObj;
                initialAnswers[questionIndex] = answerValue;
              }
            });
          } else {
            // try secondary endpoint for previous answers, like supply chain component does
            try {
              console.log('Attempting to fetch existing answers separately...');
              const answersResponse = await apiGet(`api/digital-wayfinder/questionnaire/visibility-proactive/get-answers?functionalSubArea=${encodeURIComponent('Industry Agnostic')}`);
              if (answersResponse && answersResponse.answers && Array.isArray(answersResponse.answers)) {
                console.log('Found existing answers in separate call:', answersResponse.answers);
                if (!response.questions || !response.questions[0]?.answerType) {
                  const separateOptions = determineAnswerOptions(answersResponse);
                  setAnswerOptions(separateOptions);
                  console.log('Updated answer options from separate call:', separateOptions);
                }
                answersResponse.answers.forEach(answerObj => {
                  const questionIndex = questionTexts.findIndex(q => q === answerObj.question);
                  if (questionIndex !== -1) {
                    const answerValue = answerObj.answer.charAt(0).toUpperCase() + answerObj.answer.slice(1);
                    initialAnswers[questionIndex] = answerValue;
                  }
                });
              }
            } catch (separateErr) {
              console.log('Separate answers fetch failed (expected if endpoint doesn\'t exist):', separateErr.message);
            }
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
          setFunctionalSubArea(response.functionalSubArea || 'Industry Agnostic');
        } else {
          // Use mock questions as fallback
          console.log('Using mock questions as fallback');
          setQuestions(mockQuestions);
          setAnswers(Array(mockQuestions.length).fill(null));
          setAnswerOptions(['High','Medium','Low']);
          setQuestionAnswerTypes(Array(mockQuestions.length).fill(['High','Medium','Low']));
          setFunctionalArea('Supply Chain Fulfillment');
          setFunctionalSubArea('Industry Agnostic');
        }
      } catch (err) {
        console.error('Error fetching Agentic AI questions:', err);
        console.log('Using mock questions due to API error');
        
        // Use mock questions as fallback when API fails
        const mockQuestions = [
          "Do you use cloud services (Any cloud service provider) to augment WMS capabilities ?",
          "How would you rate existing capability in integrating real-time data to cloud for various use cases ?",
          "Do you have a unified data model as a single source of truth for analytics/AI-ML use cases ?",
          "Does the WMS systems allows seamless integration to all relevant external data such as traffic, weather, shipment tracking etc."
        ];
        
        setQuestions(mockQuestions);
        setAnswers(Array(mockQuestions.length).fill(null));
        setAnswerOptions(['High','Medium','Low']);
        setQuestionAnswerTypes(Array(mockQuestions.length).fill(['High','Medium','Low']));
        setFunctionalArea('Supply Chain Fulfillment');
        setFunctionalSubArea('Industry Agnostic');
        
        // Don't set error state, just use fallback data
        // setError('Failed to load questions.');
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
          
          console.log('Saving partial Agentic AI progress before navigation:', payload);
          
          // Save the partial progress
          await apiPost('api/digital-wayfinder/questionnaire/genai/save-answers', payload);
          console.log('Partial progress saved successfully');
        }
        
      } catch (err) {
        console.error('Error saving progress before navigation:', err);
        // Continue with navigation even if save fails
        console.log('Continuing with navigation despite save error');
      }
    }
    
    // Navigate back to previous step
    if (onNavigateBack && typeof onNavigateBack === 'function') {
      console.log('Navigating back using onNavigateBack callback');
      onNavigateBack();
    } else {
      // Fallback navigation methods
      console.log('Using fallback navigation method');
      
      // Option 1: If using React Router, you might have history available
      if (window.history && window.history.length > 1) {
        window.history.back();
      } else {
        // Option 2: Navigate to a specific route (adjust based on your routing structure)
        // This assumes you have a router setup
        console.log('Attempting to navigate to previous step...');
        
        // You might need to replace this with your specific routing logic
        // For example, if using React Router:
        // navigate('/digital-wayfinder/visibility-and-proactive');
        
        // Or if you have a parent component handling navigation:
        // window.parent.postMessage({ action: 'navigateToPreviousStep' }, '*');
        
        // For now, we'll show an alert as a placeholder
        alert('Previous step navigation would be implemented here based on your routing setup.');
      }
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
      
      console.log('Sending Agentic AI payload:', payload);
      
      const response = await apiPost('api/digital-wayfinder/questionnaire/genai/save-answers', payload);

      console.log('Agentic AI answers saved successfully:', response);
      
      //alert('Questionnaire completed successfully!');
      setShowIndustryReport(true);
      
    } catch (err) {
      console.error('Error saving Agentic AI answers:', err);
      setError('Failed to save answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = answers.filter(Boolean).length;
  const allQuestionsAnswered = completedCount === questions.length && questions.length > 0;
  const progressPercentage = questions.length > 0 ? (completedCount / questions.length) * 100 : 0;

  console.log('IndustryAgenticAI Progress Debug:', {
    completedCount,
    totalQuestions: questions.length,
    progressPercentage,
    answers,
    answerOptions,
    questionAnswerTypes
  });

  // Early return for navigation to report component
  if (showIndustryReport) {
    console.log('Navigating to IndustryReport component, showIndustryReport:', showIndustryReport);
    return <IndustryReport />;
  }

  if (loading) {
    return (
      <div className={styles.industryAgenticContainer}>
        <div className={styles.industryAgenticLoadingContainer}>
          <div className={styles.industryAgenticLoadingSpinner}></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.industryAgenticContainer}>
        <div className={styles.industryAgenticErrorContainer}>
          <p className={styles.industryAgenticErrorMessage}>{error}</p>
          <button 
            className={styles.industryAgenticSaveBtn} 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no questions are loaded, show a message
  if (!loading && questions.length === 0) {
    return (
      <div className={styles.industryAgenticContainer}>
        <div className={styles.industryAgenticErrorContainer}>
          <p>No questions available.</p>
          <button 
            className={styles.industryAgenticSaveBtn} 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.industryAgenticWrapper}>
      {/* <div className={styles.industryAgenticBreadcrumbRow}>
        <div className={styles.industryAgenticBreadcrumb}>
          <span className={styles.industryAgenticBreadcrumbLink}>Home</span> &gt;{' '}
          <span className={styles.industryAgenticBreadcrumbLink}>Digital Wayfinder</span> &gt;{' '}
          <span className={styles.industryAgenticBreadcrumbCurrent}>Questionnaire</span>
        </div>
      </div> */}
      <div className={styles.industryAgenticContainer}>
        <div className={styles.industryAgenticSidebar}>
          <div className={styles.industryAgenticSidebarTitle}>Questionnaire</div>
          <div className={styles.industryAgenticSidebarDesc}>
            Structured framework for selecting functional requirements, prioritising them based on different measures for informed decision-making.
          </div>
          <div className={styles.industryAgenticSteps}>
            {steps.map((step, idx) => (
              <div key={step.label} className={styles.industryAgenticStepItem}>
                <div className={
                  step.status === 'completed' ? styles.industryAgenticStepCircleCompleted :
                  step.status === 'active' ? styles.industryAgenticStepCircleActive :
                  styles.industryAgenticStepCircleInactive
                }>
                  {step.status === 'completed' ? <span>&#10003;</span> : idx + 1}
                </div>
                <span className={
                  step.status === 'active' ? styles.industryAgenticStepTextActive :
                  step.status === 'completed' ? styles.industryAgenticStepTextCompleted :
                  styles.industryAgenticStepTextInactive
                }>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.industryAgenticMainContent}>
          <div className={styles.industryAgenticTitle}>Agentic AI</div>
          <div className={styles.industryAgenticProgressRow}>
            <span className={styles.industryAgenticProgressLabel}>Completed question {completedCount}/{questions.length}</span>
            <div className={styles.industryAgenticProgressBarBg}>
              <div className={styles.industryAgenticProgressBarFill} style={{ width: `${questions.length > 0 ? (completedCount / questions.length) * 100 : 0}%` }} />
            </div>
          </div>
          <div className={styles.industryAgenticQuestionsList}>
            {questions.map((q, idx) => {
              const questionOptions = questionAnswerTypes[idx] || answerOptions;
              return (
                <div key={idx} className={styles.industryAgenticQuestionBlock}>
                  <div className={styles.industryAgenticQuestionText}>{idx + 1}. {q}</div>
                  <div className={styles.industryAgenticOptionsRow}>
                    {questionOptions.map(opt => (
                      <label key={opt} className={styles.industryAgenticOptionLabel}>
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => handleAnswer(idx, opt)}
                          className={styles.industryAgenticRadio}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.industryAgenticButtonRow}>
            <button 
              className={styles.industryAgenticPrevBtn} 
              disabled={saving || navigatingBack}
              onClick={handlePrevious}
            >
              {navigatingBack ? 'Saving...' : 'Previous'}
            </button>
            <button 
              className={styles.industryAgenticSaveBtn} 
              disabled={!allQuestionsAnswered || saving || navigatingBack}
              onClick={handleSaveAndProceed}
            >
              {saving ? 'Saving...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryAgenticAI;