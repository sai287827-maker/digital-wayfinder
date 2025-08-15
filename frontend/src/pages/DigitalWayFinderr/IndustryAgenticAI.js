import React, { useState, useEffect } from 'react';
import styles from './IndustryAgenticAI.module.css';
import { apiGet, apiPost } from '../../api';
import WmsReport from './WmsReport';

const steps = [
  { label: 'Data and Cloud', status: 'completed' },
  { label: 'Operational Innovations', status: 'completed' },
  { label: 'Visibility and Proactive', status: 'completed' },
  { label: 'Agentic AI', status: 'active' }
];

const IndustryAgenticAI = ({ onNavigateBack }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showWmsReport, setShowWmsReport] = useState(false);
  const [navigatingBack, setNavigatingBack] = useState(false);
  
  // State for API response data
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [functionalArea, setFunctionalArea] = useState('');
  const [functionalSubArea, setFunctionalSubArea] = useState('');

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
        
        const response = await apiGet(`api/digital-wayfinder/questionnaire/genai/get-questions?functionalSubArea=${encodeURIComponent('Warehouse Management System')}`);

        console.log('Agentic AI API Response:', response);

        // Map the response structure
        if (response && response.questions && Array.isArray(response.questions) && response.questions.length > 0) {
          // Extract questions from the response
          const questionTexts = response.questions.map(q => q.question || q);
          setQuestions(questionTexts);
          
          // Initialize answers array
          const initialAnswers = Array(questionTexts.length).fill(null);
          
          // If there are existing answers in the response, load them
          if (response.answers && Array.isArray(response.answers)) {
            response.answers.forEach(answerObj => {
              const questionIndex = questionTexts.findIndex(q => q === (answerObj.question || answerObj));
              if (questionIndex !== -1) {
                // Convert lowercase answer to proper case for display
                const answerValue = answerObj.answer ? answerObj.answer.charAt(0).toUpperCase() + answerObj.answer.slice(1) : answerObj;
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
          setFunctionalSubArea(response.functionalSubArea || 'Warehouse Management System');
        } else {
          // Use mock questions as fallback
          console.log('Using mock questions as fallback');
          setQuestions(mockQuestions);
          setAnswers(Array(mockQuestions.length).fill(null));
          setFunctionalArea('Supply Chain Fulfillment');
          setFunctionalSubArea('Warehouse Management System');
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
        setFunctionalArea('Supply Chain Fulfillment');
        setFunctionalSubArea('Warehouse Management System');
        
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
      
      // Handle completion - could navigate to results page or show success message
      alert('Questionnaire completed successfully!');
      
    } catch (err) {
      console.error('Error saving Agentic AI answers:', err);
      setError('Failed to save answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = answers.filter(Boolean).length;
  const allQuestionsAnswered = completedCount === questions.length && questions.length > 0;

  // Early return for navigation to WmsReport
  if (showWmsReport) {
    console.log('Navigating to WmsReport component, showWmsReport:', showWmsReport);
    return <WmsReport />;
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
      <div className={styles.industryAgenticBreadcrumbRow}>
        <div className={styles.industryAgenticBreadcrumb}>
          <span className={styles.industryAgenticBreadcrumbLink}>Home</span> &gt;{' '}
          <span className={styles.industryAgenticBreadcrumbLink}>Digital Wayfinder</span> &gt;{' '}
          <span className={styles.industryAgenticBreadcrumbCurrent}>Questionnaire</span>
        </div>
      </div>
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
            {questions.map((q, idx) => (
              <div key={idx} className={styles.industryAgenticQuestionBlock}>
                <div className={styles.industryAgenticQuestionText}>{idx + 1}. {q}</div>
                <div className={styles.industryAgenticOptionsRow}>
                  {['High', 'Medium', 'Low'].map(opt => (
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
            ))}
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
              {saving ? 'Saving...' : 'Save & Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryAgenticAI;