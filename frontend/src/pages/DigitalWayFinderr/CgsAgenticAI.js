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

const CgsAgenticAI = ({ onNavigateBack }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [questionAnswerTypes, setQuestionAnswerTypes] = useState([]);
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

  // Function to determine answer options from API response
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
      const hasYesNo = existingAnswers.some(answer => 
        ['yes', 'no'].includes(answer)
      );
      const hasHighMediumLow = existingAnswers.some(answer => 
        ['high', 'medium', 'low'].includes(answer)
      );
      
      if (hasYesNo) {
        return ['Yes', 'No'];
      } else if (hasHighMediumLow) {
        return ['High', 'Medium', 'Low'];
      }
    }
    
    return ['High', 'Medium', 'Low'];
  };

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching Agentic AI questions...');
        const response = await apiGet(`api/digital-wayfinder/questionnaire/genai/get-questions?functionalSubArea=${encodeURIComponent('Warehouse Management System')}`);

        console.log('Agentic AI API Response:', response);

        if (response.questions && Array.isArray(response.questions)) {
          const questionTexts = response.questions.map(q => q.question);
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
          console.log('Determined answer options for AgenticAI:', options);
          
          const initialAnswers = Array(questionTexts.length).fill(null);
          
          if (response.answers && Array.isArray(response.answers)) {
            console.log('Loading existing AgenticAI answers:', response.answers);
            response.answers.forEach(answerObj => {
              const questionIndex = questionTexts.findIndex(q => q === answerObj.question);
              if (questionIndex !== -1) {
                const answerValue = answerObj.answer.charAt(0).toUpperCase() + answerObj.answer.slice(1);
                initialAnswers[questionIndex] = answerValue;
                console.log(`Loaded answer for question ${questionIndex}: ${answerValue}`);
              } else {
                console.warn('Could not find matching question for answer:', answerObj);
              }
            });
          } else {
            console.log('No existing answers found in response');
            
            try {
              console.log('Attempting to fetch existing answers separately...');
              const answersResponse = await apiGet(`api/digital-wayfinder/questionnaire/visibility-proactive/get-answers?functionalSubArea=${encodeURIComponent('Warehouse Management System')}`);
              
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
                    console.log(`Loaded answer from separate call for question ${questionIndex}: ${answerValue}`);
                  }
                });
              }
            } catch (separateErr) {
              console.log('Separate answers fetch failed (this is expected if endpoint doesn\'t exist):', separateErr.message);
            }
          }
          
          setAnswers(initialAnswers);
          console.log('Final AgenticAI answers array:', initialAnswers);
          
          setUserId(response.userId || '');
          setSessionId(response.sessionId || '');
          
          let area = response.functionalArea || '';
          if (!area && response.functionalSubArea) {
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
          if (!area) {
            area = 'Supply Chain Fulfillment';
          }
          setFunctionalArea(area);
          setFunctionalSubArea(response.functionalSubArea || '');
        } else {
          console.log('Using fallback structure for AgenticAI questions');
          setQuestions(response.questions || []);
          setAnswers(Array((response.questions || []).length).fill(null));
          setAnswerOptions(['High', 'Medium', 'Low']);
          setQuestionAnswerTypes(Array((response.questions || []).length).fill(['High', 'Medium', 'Low']));
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
    const hasAnswers = answers.some(answer => answer !== null);
    
    if (hasAnswers) {
      try {
        setNavigatingBack(true);
        setError(null);
        
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
        
        const answeredQuestions = questions
          .map((question, index) => ({
            question: question,
            answer: answers[index]?.toLowerCase() || ''
          }))
          .filter(item => item.answer !== '');
        
        if (answeredQuestions.length > 0) {
          const payload = {
            functionalArea: area,
            functionalSubArea: functionalSubArea || '',
            answers: answeredQuestions,
            isPartialSave: true
          };
          
          console.log('Saving partial Agentic AI progress before navigation:', payload);
          await apiPost('api/digital-wayfinder/questionnaire/genai/save-answers', payload);
          console.log('Partial progress saved successfully');
        }
        
      } catch (err) {
        console.error('Error saving progress before navigation:', err);
        console.log('Continuing with navigation despite save error');
      }
    }
    
    if (onNavigateBack && typeof onNavigateBack === 'function') {
      console.log('Navigating back using onNavigateBack callback');
      onNavigateBack();
    } else {
      console.log('Using fallback navigation method');
      
      if (window.history && window.history.length > 1) {
        window.history.back();
      } else {
        console.log('Attempting to navigate to previous step...');
        alert('Previous step navigation would be implemented here based on your routing setup.');
      }
    }
    
    setNavigatingBack(false);
  };

  const handleSaveAndProceed = async () => {
    if (!allQuestionsAnswered) {
      setError('Please answer all questions before proceeding.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
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
  const progressPercentage = questions.length > 0 ? (completedCount / questions.length) * 100 : 0;
  
  console.log('AgenticAI Progress Debug:', {
    completedCount,
    totalQuestions: questions.length,
    progressPercentage,
    answers,
    answerOptions,
    questionAnswerTypes
  });

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
      <div className={styles.mainContent} style={{ backgroundColor: 'white' }}>
        <div className={styles.title}>Agentic AI</div>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>Progress: {completedCount} of {questions.length} questions completed</span>
          <span style={{color: '#666', fontSize: '14px'}}>{Math.round(progressPercentage)}%</span>
        </div>
        <div className={styles.questionsList}>
          {questions.map((q, idx) => {
            const questionOptions = questionAnswerTypes[idx] || answerOptions;
            
            return (
              <div key={idx} style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '12px', fontSize: '16px', color: '#333', fontWeight: 'normal' }}>
                  <strong>{idx + 1}. {q}</strong>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginLeft: '0px' }}>
                  {questionOptions.map(opt => (
                    <label key={opt} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleAnswer(idx, opt)}
                        style={{
                          marginRight: '8px',
                          accentColor: '#9C27B0'
                        }}
                      />
                      <span style={{ color: '#333' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.buttonRow} style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
          <button 
            className={styles.prevBtn} 
            disabled={saving || navigatingBack}
            onClick={handlePrevious}
            style={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              color: '#333',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: (saving || navigatingBack) ? 'not-allowed' : 'pointer',
              opacity: (saving || navigatingBack) ? 0.6 : 1,
              fontSize: '14px'
            }}
          >
            {navigatingBack ? 'Saving...' : 'Previous'}
          </button>

          <button 
            className={styles.saveBtn} 
            disabled={!allQuestionsAnswered || saving || navigatingBack}
            onClick={handleSaveAndProceed}
            style={{
              backgroundColor: (!allQuestionsAnswered || saving || navigatingBack) ? '#ccc' : '#9C27B0',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: (!allQuestionsAnswered || saving || navigatingBack) ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {saving ? 'Saving...' : 'Generate Report'}
          </button>
        </div>
        {error && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '4px',
            color: '#856404',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CgsAgenticAI;