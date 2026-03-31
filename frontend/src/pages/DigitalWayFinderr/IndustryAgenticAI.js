import React, { useState, useEffect } from 'react';
import styles from './IndustryAgenticAI.module.css';
import { useFunctionalArea } from '../../hooks/useFunctionalArea';
import { apiGet, apiPost } from '../../api';
import IndustryReport from './IndustryReport';

// --- constants ----------------------------------------------------------------
const STEP_ITEMS = [
  { label: 'Data and Cloud', status: 'completed' },
  { label: 'Operational Innovations', status: 'completed' },
  { label: 'Visibility and Proactive', status: 'completed' },
  { label: 'Agentic AI', status: 'active' }
];

const FALLBACK_QUESTIONS = [
  'Do you use cloud services (Any cloud service provider) to augment WMS capabilities ?',
  'How would you rate existing capability in integrating real-time data to cloud for various use cases ?',
  'Do you have a unified data model as a single source of truth for analytics/AI-ML use cases ?',
  'Does the WMS systems allows seamless integration to all relevant external data such as traffic, weather, shipment tracking etc.'
];

// --- helpers ------------------------------------------------------------------
const deriveOptions = (answerTypeString = '') => {
  const at = answerTypeString.toLowerCase();
  if (at.includes('yes') && at.includes('no')) return ['Yes', 'No'];
  if (at.includes('high') && at.includes('medium') && at.includes('low')) return ['High', 'Medium', 'Low'];
  return null;
};

/**
 * Look at either a question set or an answers array to figure out a sensible
 * set of radio options. It returns a default of High/Medium/Low if it cannot
 * infer anything better.
 */
const determineAnswerOptions = ({ questions = [], answers = [] }) => {
  // first try the questions, looking only at the first one for simplicity
  if (questions.length) {
    const explicit = deriveOptions(questions[0].answerType || '');
    if (explicit) return explicit;
  }

  // fall back to whatever answers we already have saved
  if (answers.length) {
    const lowercase = answers.map(a => (a.answer || '').toLowerCase());
    if (lowercase.some(v => ['yes', 'no'].includes(v))) return ['Yes', 'No'];
    if (lowercase.some(v => ['high', 'medium', 'low'].includes(v))) return ['High', 'Medium', 'Low'];
  }

  return ['High', 'Medium', 'Low'];
};

/**
 * Build an array of user-visible answers (capitalised) from a list of
 * questions and an optional array of existing answer objects.
 */
const makeInitialAnswers = (questions, existing = []) => {
  const result = Array(questions.length).fill(null);
  existing.forEach(ans => {
    const idx = questions.findIndex(q => q.question === ans.question || q === ans.question);
    if (idx !== -1) {
      result[idx] = ans.answer ? ans.answer.charAt(0).toUpperCase() + ans.answer.slice(1) : ans.answer;
    }
  });
  return result;
};

// --- component ---------------------------------------------------------------
const IndustryAgenticAI = ({ onNavigateBack }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [answerOptions, setAnswerOptions] = useState(['High', 'Medium', 'Low']);
  const [questionAnswerTypes, setQuestionAnswerTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showIndustryReport, setShowIndustryReport] = useState(false);
  const [navigatingBack, setNavigatingBack] = useState(false);

  // response metadata
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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      console.log('IndustryAgenticAI component mounted with effectiveSubArea:', effectiveSubArea);
      try {
        const response = await apiGet(
          `api/digital-wayfinder/questionnaire/genai/get-questions?functionalSubArea=${encodeURIComponent(
            effectiveSubArea
          )}`
        );

        let questionTexts = [];
        let answerTypes = [];
        let existingAnswers = [];

        if (response && Array.isArray(response.questions) && response.questions.length > 0) {
          questionTexts = response.questions.map(q => q.question || q);
          answerTypes = response.questions.map(q => deriveOptions(q.answerType || '') || ['High', 'Medium', 'Low']);
          existingAnswers = Array.isArray(response.answers) ? response.answers : [];
        }

        // if no questions returned from primary endpoint, fall back to mock
        if (questionTexts.length === 0) {
          questionTexts = [...FALLBACK_QUESTIONS];
          answerTypes = questionTexts.map(() => ['High', 'Medium', 'Low']);
        }

        setQuestions(questionTexts);
        setQuestionAnswerTypes(answerTypes);

        const options = determineAnswerOptions({ questions: response?.questions, answers: response?.answers });
        setAnswerOptions(options);

        // attempt to merge answers from a secondary endpoint if none were
        // received in the first response
        if (existingAnswers.length === 0) {
          try {
            const alt = await apiGet(
              `api/digital-wayfinder/questionnaire/visibility-proactive/get-answers?functionalSubArea=${encodeURIComponent(
                effectiveSubArea
              )}`
            );
            if (alt && Array.isArray(alt.answers)) {
              existingAnswers = alt.answers;
              if (!response?.questions || !response.questions[0]?.answerType) {
                setAnswerOptions(determineAnswerOptions(alt));
              }
            }
          } catch (ignored) {
            // ignore; the alternate endpoint may not exist
          }
        }

        setAnswers(makeInitialAnswers(questionTexts, existingAnswers));

        setUserId(response?.userId || '');
        setSessionId(response?.sessionId || '');
        if (response?.functionalSubArea && response.functionalSubArea !== functionalSubArea) {
          setFunctionalSubArea(response.functionalSubArea);
        }
        if (response?.functionalArea && response.functionalArea !== functionalArea) {
          setFunctionalArea(response.functionalArea);
        }
      } catch (err) {
        console.error('Failed to load questions', err);
        setQuestions([...FALLBACK_QUESTIONS]);
        setAnswers(Array(FALLBACK_QUESTIONS.length).fill(null));
        setAnswerOptions(['High', 'Medium', 'Low']);
        setQuestionAnswerTypes(Array(FALLBACK_QUESTIONS.length).fill(['High', 'Medium', 'Low']));
        // do not set error; we quietly fall back
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleAnswer = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  const saveProgress = async (partial = false) => {
    const area = deriveArea();
    const answeredQuestions = questions
      .map((q, i) => ({ question: q, answer: answers[i]?.toLowerCase() || '' }))
      .filter(a => a.answer !== '');

    if (!answeredQuestions.length) return;

    const payload = {
      functionalArea: area,
      functionalSubArea: functionalSubArea || '',
      answers: answeredQuestions
    };

    if (partial) payload.isPartialSave = true;

    await apiPost('api/digital-wayfinder/questionnaire/genai/save-answers', payload);
  };

  const handlePrevious = async () => {
    if (answers.some(a => a !== null)) {
      try {
        setNavigatingBack(true);
        await saveProgress(true);
      } catch (e) {
        console.error('Error saving progress before navigation', e);
      } finally {
        setNavigatingBack(false);
      }
    }

    if (typeof onNavigateBack === 'function') {
      onNavigateBack();
    } else if (window.history && window.history.length > 1) {
      window.history.back();
    } else {
      alert('Previous step navigation would be implemented here based on your routing setup.');
    }
  };

  const handleSaveAndProceed = async () => {
    if (!allQuestionsAnswered) {
      setError('Please answer all questions before proceeding.');
      return;
    }

    try {
      setSaving(true);
      await saveProgress(false);
      setShowIndustryReport(true);
    } catch (e) {
      console.error('Error saving Agentic AI answers:', e);
      setError('Failed to save answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = answers.filter(Boolean).length;
  const allQuestionsAnswered = completedCount === questions.length && questions.length > 0;

  // render shortcuts
  if (showIndustryReport) return <IndustryReport />;
  if (loading)
    return (
      <div className={styles.industryAgenticContainer}>
        <div className={styles.industryAgenticLoadingContainer}>
          <div className={styles.industryAgenticLoadingSpinner}></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  if (error || (!loading && questions.length === 0))
    return (
      <div className={styles.industryAgenticContainer}>
        <div className={styles.industryAgenticErrorContainer}>
          <p className={styles.industryAgenticErrorMessage}>{error || 'No questions available.'}</p>
          <button className={styles.industryAgenticSaveBtn} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );

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
            {STEP_ITEMS.map((step, idx) => (
              <div key={step.label} className={styles.industryAgenticStepItem}>
                <div
                  className={
                    step.status === 'completed'
                      ? styles.industryAgenticStepCircleCompleted
                      : step.status === 'active'
                      ? styles.industryAgenticStepCircleActive
                      : styles.industryAgenticStepCircleInactive
                  }
                >
                  {step.status === 'completed' ? <span>&#10003;</span> : idx + 1}
                </div>
                <span
                  className={
                    step.status === 'active'
                      ? styles.industryAgenticStepTextActive
                      : step.status === 'completed'
                      ? styles.industryAgenticStepTextCompleted
                      : styles.industryAgenticStepTextInactive
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.industryAgenticMainContent}>
          <div className={styles.industryAgenticTitle}>Agentic AI</div>
          <div className={styles.industryAgenticProgressRow}>
            <span className={styles.industryAgenticProgressLabel}>
              Completed question {completedCount}/{questions.length}
            </span>
            <div className={styles.industryAgenticProgressBarBg}>
              <div
                className={styles.industryAgenticProgressBarFill}
                style={{ width: `${questions.length > 0 ? (completedCount / questions.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className={styles.industryAgenticQuestionsList}>
            {questions.map((q, idx) => {
              const opts = questionAnswerTypes[idx] || answerOptions;
              return (
                <div key={idx} className={styles.industryAgenticQuestionBlock}>
                  <div className={styles.industryAgenticQuestionText}>
                    {idx + 1}. {q}
                  </div>
                  <div className={styles.industryAgenticOptionsRow}>
                    {opts.map(opt => (
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
