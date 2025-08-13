import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Operational.css';
 
const Operational = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
 
  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/digital-wayfinder/questionaire/operational-innovations/get-questions');
       
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
       
        const data = await response.json();
        setQuestions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
 
    fetchQuestions();
  }, []);
 
  const sidebarItems = [
    { id: 1, title: "Data and Cloud", completed: true },
    { id: 2, title: "Operational Innovations", active: true },
    { id: 3, title: "Visibility and Proactive" },
    { id: 4, title: "Generative AI" }
  ];
 
  // Calculate completed questions count
  const completedQuestions = Object.keys(answers).filter(key => answers[key]).length;
  const totalQuestions = questions.length;
  const progressPercentage = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
  const allQuestionsAnswered = completedQuestions === totalQuestions;
 
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
 
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
 
  const handleSaveAndProceed = async () => {
    try {
      setSaving(true);
     
      // Call API to save answers
      const response = await fetch('/api/digital-wayfinder/questionaire/operational-innovations/save-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers,
          step: 'operational-innovations'
        })
      });
 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
 
      const result = await response.json();
      console.log('Answers saved successfully:', result);
     
      // Navigate to Visibility Proactive component
      navigate('/digital-wayfinder/visibility-proactive');
     
    } catch (err) {
      console.error('Error saving answers:', err);
      setError('Failed to save answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };
 
  if (loading) {
    return (
      <div className="questionnaire-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="questionnaire-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="questionnaire-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-item">Home</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-item">Digital Wayfinder</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-item active">Questionnaire</span>
      </div>
 
      <div className="questionnaire-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>Questionnaire</h3>
            <p>Structured framework for selecting functional requirements, prioritising them based on different measures for informed decision-making.</p>
          </div>
         
          <div className="sidebar-items">
            {sidebarItems.map((item) => (
              <div
                key={item.id}
                className={`sidebar-item ${item.completed ? 'completed' : ''} ${item.active ? 'active' : ''}`}
              >
                <div className="sidebar-item-number">
                  {item.completed ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    item.id
                  )}
                </div>
                <span className="sidebar-item-title">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
 
        {/* Main Content */}
        <div className="main-content">
          <div className="content-header">
            <h1>Operational Innovations</h1>
            <div className="progress-container">
              <span className="progress-text">Completed question {completedQuestions}/{totalQuestions}</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>
 
          <div className="questions-container">
            {questions.map((question) => (
              <div key={question.id} className="question-item">
                <h3 className="question-text">
                  {question.id}. {question.text}
                </h3>
                <div className="radio-group">
                  {['High', 'Medium', 'Low'].map((option) => (
                    <label key={option} className="radio-option">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      />
                      <span className="radio-custom"></span>
                      <span className="radio-label">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
 
          <div className="action-buttons">
            <button
              className="btn-secondary"
              onClick={handlePrevious}
              disabled={currentStep === 1 || saving}
            >
              Previous
            </button>
            <button
              className="btn-primary"
              onClick={handleSaveAndProceed}
              disabled={!allQuestionsAnswered || saving}
            >
              {saving ? 'Saving...' : 'Save & Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Operational;
 