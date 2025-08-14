import React, { useState, useEffect } from 'react';
import styles from './AgenticAI.module.css';
import { apiGet, apiPost } from '../../api';
import WmsReport from './WmsReport';

const steps = [
  { label: 'Data and Cloud', status: 'completed' },
  { label: 'Operational Innovations', status: 'completed' },
  { label: 'Visibility and Proactive', status: 'completed' },
  { label: 'Agentic AI', status: 'active' }
];

const AgenticAI = ({ onNavigateBack }) => {
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
        const response = await apiGet(`api/digital-wayfinder/questionnaire/genai/get-questions?functionalSubArea=${encodeURIComponent('Warehouse Management System')}`);

        console.log('Agentic AI API Response:', response);

        // Map the response structure
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
          // Fallback for old response structure
          setQuestions(response.questions || []);
          setAnswers(Array((response.questions || []).length).fill(null));
        }
      } catch (err) {
        console.error('Error fetching Agentic AI questions:', err);
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
      
      // Navigate to WmsReport or next step without popup
      setShowWmsReport(true);
      
    } catch (err) {
      console.error('Error saving Agentic AI answers:', err);
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
  console.log('AgenticAI Progress Debug:', {
    completedCount,
    totalQuestions: questions.length,
    progressPercentage,
    answers
  });

  // Early return for navigation to WmsReport
  if (showWmsReport) {
    console.log('Navigating to WmsReport component, showWmsReport:', showWmsReport);
    return <WmsReport />;
  }

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
              } style={{
                backgroundColor: step.status === 'completed' ? '#4CAF50' : 
                               step.status === 'active' ? '#9C27B0' : '#e0e0e0',
                color: step.status === 'inactive' ? '#666' : 'white'
              }}>
                {step.status === 'completed' ? <span>&#10003;</span> : idx + 1}
              </div>
              <span className={
                step.status === 'active' ? styles.stepTextActive :
                step.status === 'completed' ? styles.stepTextCompleted :
                styles.stepTextInactive
              } style={{
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
      <div className={styles.mainContent}>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbLink}>Home</span> &gt;{' '}
          <span className={styles.breadcrumbLink}>Digital Wayfinder</span> &gt;{' '}
          <span className={styles.breadcrumbCurrent}>Questionnaire</span>
        </div>
        <div className={styles.title}>Agentic AI</div>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>Completed question {completedCount}/{questions.length}</span>
          <div className={styles.progressBarBg} style={{ width: '100%', maxWidth: '300px', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              className={styles.progressBarFill} 
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
        <div className={styles.questionsList}>
          {questions.map((q, idx) => (
            <div key={idx} className={styles.questionBlock} style={{ marginBottom: '24px', padding: '20px', backgroundColor: 'white', border: 'none', boxShadow: 'none', borderRadius: '8px' }}>
              <div className={styles.questionText} style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '500', color: '#333' }}>{idx + 1}. {q}</div>
              <div className={styles.optionsRow}>
                {['High', 'Medium', 'Low'].map(opt => (
                  <label key={opt} className={styles.optionLabel} style={{ display: 'flex', alignItems: 'center', marginRight: '20px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={opt}
                      checked={answers[idx] === opt}
                      onChange={() => handleAnswer(idx, opt)}
                      className={styles.radio}
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
          ))}
        </div>
        <div className={styles.buttonRow}>
         <button 
  className={styles.prevBtn} 
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
            className={styles.saveBtn} 
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
            {saving ? 'Saving...' : 'Generate Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgenticAI;