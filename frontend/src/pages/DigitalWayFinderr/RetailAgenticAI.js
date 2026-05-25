import React, { useState, useEffect } from 'react';
import styles from './RetailAgenticAI.module.css';
import { apiGet, apiPost } from '../../api';
import RetailReport from './RetailReport';
import { useFunctionalArea } from '../../hooks/useFunctionalArea';
import { useLocation, useNavigate } from 'react-router-dom';

const steps = [
  { label: 'Data and Cloud', status: 'completed' },
  { label: 'Operational Innovations', status: 'completed' },
  { label: 'Visibility and Proactive', status: 'completed' },
  { label: 'Agentic AI', status: 'active' }
];

const RetailAgenticAI = ({ onNavigateBack }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [questionAnswerTypes, setQuestionAnswerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showRetailReport, setShowRetailReport] = useState(false);
  const [navigatingBack, setNavigatingBack] = useState(false);
  const location = useLocation();
const navigate = useNavigate();
  
  // State for API response data
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
      console.log('RetailAgenticAI component mounted with effectiveSubArea:', effectiveSubArea);
      setLoading(true);
      setError(null);
      try {
        const response = await apiGet(`api/digital-wayfinder/questionnaire/genai/get-questions?functionalSubArea=${encodeURIComponent(location.state?.selectedSystem)}`);


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
          
          const initialAnswers = Array(questionTexts.length).fill(null);
          
          if (response.answers && Array.isArray(response.answers)) {
            response.answers.forEach(answerObj => {
              const questionIndex = questionTexts.findIndex(q => q === answerObj.question);
              if (questionIndex !== -1) {
                const answerValue = answerObj.answer.charAt(0).toUpperCase() + answerObj.answer.slice(1);
                initialAnswers[questionIndex] = answerValue;
              } else {
                console.warn('Could not find matching question for answer:', answerObj);
              }
            });
          } else {
            
            try {
              const answersResponse = await apiGet(`api/digital-wayfinder/questionnaire/visibility-proactive/get-answers?functionalSubArea=${encodeURIComponent(location.state?.selectedSystem)}`);
              
              if (answersResponse && answersResponse.answers && Array.isArray(answersResponse.answers)) {
                
                if (!response.questions || !response.questions[0]?.answerType) {
                  const separateOptions = determineAnswerOptions(answersResponse);
                  setAnswerOptions(separateOptions);
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
              console.log('Separate answers fetch failed (this is expected if endpoint doesn\'t exist):', separateErr.message);
            }
          }
          
          setAnswers(initialAnswers);
          
          setUserId(response.userId || '');
          setSessionId(response.sessionId || '');
          
          // Push API response into hook state; deriveArea effect will sync functional area
          if (response.functionalSubArea && response.functionalSubArea !== functionalSubArea) {
            setFunctionalSubArea(response.functionalSubArea);
          }
          if (response.functionalArea && response.functionalArea !== functionalArea) {
            setFunctionalArea(response.functionalArea);
          }
        } else {
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
  }, [location.state?.selectedSystem]);

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
        
        const area = deriveArea();
        
        const answeredQuestions = questions
          .map((question, index) => ({
            question: question,
            answer: answers[index]?.toLowerCase() || ''
          }))
          .filter(item => item.answer !== '');
        
        if (answeredQuestions.length > 0) {
          const payload = {
            functionalArea: area,
            functionalSubArea: location.state?.selectedSystem || '',
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
    
   navigate('/digital-wayfinder/retail-visibility-proactive', {
    state: {
      ...location.state
    }
  });
    
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
      
      const area = deriveArea();
      
      const payload = {
        functionalArea: area,
        functionalSubArea: location.state?.selectedSystem || '',
        answers: questions.map((question, index) => ({
          question: question,
          answer: answers[index]?.toLowerCase() || ''
        }))
      };
      
      console.log('Sending Agentic AI payload:', payload);
      
      const response = await apiPost('api/digital-wayfinder/questionnaire/genai/save-answers', payload);

      console.log('Agentic AI answers saved successfully:', response);
      
      setShowRetailReport(true);
      
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

  if (showRetailReport) {
    console.log('Navigating to RetailReport component, showRetailReport:', showRetailReport);
    return <RetailReport />;
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

export default RetailAgenticAI;