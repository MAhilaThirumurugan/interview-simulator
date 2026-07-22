import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../hooks/useInterview';

const TOPICS       = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'System Design', 'DSA'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const TOTAL_QUESTIONS = 3;
const MAX_ANSWER_LENGTH = 1000;
const QUESTION_TIME_LIMIT = 120; // seconds allowed per question

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Motivational message shown on the summary screen, based on overall score
function getMotivationalMessage(score) {
  if (score >= 9) return 'Excellent Performance!';
  if (score >= 7) return 'Good Job! Keep Practicing.';
  if (score >= 5) return 'Nice Attempt. Review fundamentals.';
  return 'Keep Learning. Practice more.';
}

// Turns a raw/technical error string into a friendly, professional message
function getFriendlyError(rawError) {
  if (!rawError) return null;
  const isQuotaIssue = /quota|rate.?limit|429/i.test(rawError);
  if (isQuotaIssue) {
    return {
      title: 'AI service is temporarily unavailable.',
      message: 'Using offline interview mode.',
    };
  }
  return {
    title: '⚠ Something went wrong',
    message: 'Please try again.',
  };
}

export default function InterviewPage() {
  const navigate = useNavigate();
  const {
    question, mode, evaluation, turnNumber,
    loading, error, completed, summary,
    startInterview, submitAnswer, endInterview, reset,
  } = useInterview();

  const [topic, setTopic] = useState('React');
  const [difficulty, setDifficulty] = useState('medium');
  const [answer, setAnswer] = useState('');
  const [started, setStarted] = useState(false);
  const [validationWarning, setValidationWarning] = useState('');
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const intervalRef = useRef(null);

  const scoreColor = (s) => (s >= 7 ? '#16a34a' : s >= 4 ? '#d97706' : '#dc2626');
  const progress = Math.min((turnNumber / TOTAL_QUESTIONS) * 100, 100);

  const wordCount = answer.trim() === '' ? 0 : answer.trim().split(/\s+/).length;
  const charCount = answer.length;
  const friendlyError = getFriendlyError(error);

  // Reset the timer whenever a new question comes in
  useEffect(() => {
    if (started && !completed) setTimeLeft(QUESTION_TIME_LIMIT);
  }, [turnNumber, started, completed]);

  // Tick the timer down every second, pausing while the AI is busy
  useEffect(() => {
    if (!started || completed || loading) return undefined;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [started, completed, loading, turnNumber]);

  const isTimeLow = timeLeft <= 20;
  const isTimeUp = timeLeft === 0;

  const handleStart = async () => {
    await startInterview(topic, difficulty);
    setStarted(true);
  };

  const handleAnswerChange = (e) => {
    const value = e.target.value.slice(0, MAX_ANSWER_LENGTH);
    setAnswer(value);
    if (validationWarning && value.trim()) setValidationWarning('');
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setValidationWarning('⚠ Please enter your answer before submitting.');
      return;
    }
    setValidationWarning('');
    await submitAnswer(answer);
    setAnswer('');
  };

  const handleEnd = async () => {
    await endInterview();
  };

  const handleReset = () => {
    reset();
    setStarted(false);
    setAnswer('');
    setValidationWarning('');
    setTimeLeft(QUESTION_TIME_LIMIT);
  };

  // ---------- Setup screen ----------
  if (!started) {
    return (
      <div style={styles.center}>
        <div style={styles.setupCard}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <h2 style={styles.setupTitle}>Configure Interview</h2>

          <label style={styles.label}>Topic</label>
          <select style={styles.select} value={topic} onChange={(e) => setTopic(e.target.value)} disabled={loading}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <label style={styles.label}>Difficulty</label>
          <select
            style={styles.select}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={loading}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>

          {friendlyError && (
            <div style={styles.errorCard}>
              <p style={styles.errorTitle}>{friendlyError.title}</p>
              <p style={styles.errorMessage}>{friendlyError.message}</p>
            </div>
          )}

          <button style={styles.startBtn} onClick={handleStart} disabled={loading}>
            {loading ? '⏳ Generating AI Question...' : '🚀 Start Interview'}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Summary screen ----------
  if (completed && summary) {
    return (
      <div style={styles.center}>
        <div style={styles.summaryCard}>
          <h2 style={styles.summaryTitle}>🎉 Interview Complete</h2>

          <div style={styles.summaryScoreBlock}>
            <span style={{ color: scoreColor(summary.overallScore), fontWeight: '700', fontSize: '40px' }}>
              {summary.overallScore}/10
            </span>
            <p style={styles.summaryMotivation}>{getMotivationalMessage(summary.overallScore)}</p>
          </div>

          <div style={styles.summaryDetails}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryRowLabel}>Topic</span>
              <span style={styles.summaryRowValue}>{topic}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryRowLabel}>Difficulty</span>
              <span style={styles.summaryRowValue}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryRowLabel}>Questions Answered</span>
              <span style={styles.summaryRowValue}>{summary.totalQuestions}</span>
            </div>
          </div>

          <div style={styles.summaryBtns}>
            <button style={styles.startBtn} onClick={handleReset}>
              Try Again
            </button>
            <button style={styles.outlineBtn} onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Interview screen ----------
  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.progressContainer}>
          <div style={styles.progressInfo}>
            Question {Math.min(turnNumber, TOTAL_QUESTIONS)} of {TOTAL_QUESTIONS} ({Math.round(progress)}%)
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        </div>

        <span style={styles.sessionInfo}>
          {topic} · {difficulty} · Question {turnNumber}
        </span>

        <span style={{ ...styles.timerBadge, ...(isTimeLow ? styles.timerBadgeLow : {}) }}>
          ⏱ {isTimeUp ? "Time's up!" : formatTime(timeLeft)}
        </span>

        <button style={styles.endBtn} onClick={handleEnd} disabled={loading}>
          End Interview
        </button>
      </div>

      <div style={styles.main}>
        {friendlyError && (
          <div style={styles.errorCard}>
            <p style={styles.errorTitle}>{friendlyError.title}</p>
            <p style={styles.errorMessage}>{friendlyError.message}</p>
          </div>
        )}

        {/* AI Status Badge */}
        <div style={styles.statusBadge}>
          {mode === 'ai' ? (
            <span style={styles.aiBadge}>🟢 AI Powered</span>
          ) : (
            <span style={styles.fallbackBadge}>🟡 Offline Mode</span>
          )}
        </div>

        {/* Current Question */}
        <div style={styles.questionCard}>
          <p style={styles.qLabel}>Question {turnNumber}</p>
          <p style={styles.qText}>{question}</p>
        </div>

        {/* Previous Answer Feedback */}
        {evaluation && (
          <div style={styles.feedbackCard}>
            <div style={styles.feedbackHeader}>
              <span style={styles.feedbackTitle}>Overall Score</span>
              <span style={{ color: scoreColor(evaluation.score), fontWeight: '700', fontSize: '22px' }}>
                {evaluation.score}/10
              </span>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📝 Feedback</h3>
              <p style={styles.feedbackText}>{evaluation.feedback}</p>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>✅ Strengths</h3>
              <ul style={styles.list}>
                {(Array.isArray(evaluation.strengths) ? evaluation.strengths : [evaluation.strengths]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>

            <div style={{ ...styles.section, marginBottom: 0 }}>
              <h3 style={styles.sectionTitle}>💡 Areas to Improve</h3>
              <ul style={{ ...styles.list, marginBottom: 0 }}>
                {(Array.isArray(evaluation.improvements) ? evaluation.improvements : [evaluation.improvements]).map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Answer Input */}
        <div style={styles.answerCard}>
          <label style={styles.label}>Your Answer</label>

          <textarea
            style={styles.textarea}
            rows={6}
            placeholder="Type your answer here..."
            value={answer}
            onChange={handleAnswerChange}
            disabled={loading}
            maxLength={MAX_ANSWER_LENGTH}
          />

          <div style={styles.counterRow}>
            <span style={styles.counterText}>Words: {wordCount}</span>
            <span style={{ ...styles.counterText, color: charCount >= MAX_ANSWER_LENGTH ? '#dc2626' : '#888' }}>
              {charCount} / {MAX_ANSWER_LENGTH} characters
            </span>
          </div>

          {validationWarning && <p style={styles.validationWarning}>{validationWarning}</p>}

          <button
            style={{
              ...styles.startBtn,
              opacity: loading ? 0.6 : 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '14px',
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '⏳ AI is Evaluating...' : 'Submit Answer →'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  center:     { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8', padding: '16px' },
  setupCard:  { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' },
  backBtn:    { background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '14px', padding: '0 0 16px', display: 'block' },
  setupTitle: { fontSize: '22px', fontWeight: '700', marginBottom: '24px' },
  label:      { display: 'block', fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '6px' },
  select:     { width: '100%', padding: '11px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', outline: 'none' },
  startBtn:   { width: '100%', padding: '13px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  outlineBtn: { width: '100%', padding: '13px', background: '#fff', color: '#4f46e5', border: '2px solid #4f46e5', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },

  summaryCard:  { background: '#fff', padding: '40px', borderRadius: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '440px', textAlign: 'center' },
  summaryTitle: { fontSize: '24px', fontWeight: '700', marginBottom: '20px' },
  summaryScoreBlock: { marginBottom: '24px' },
  summaryMotivation: { fontSize: '15px', fontWeight: '600', color: '#4f46e5', marginTop: '8px' },
  summaryDetails: {
    background: '#f8fafc', borderRadius: '10px', padding: '16px 18px',
    marginBottom: '28px', textAlign: 'left',
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: '1px solid #e5e7eb', fontSize: '14px',
  },
  summaryRowLabel: { color: '#666' },
  summaryRowValue: { color: '#1a1a2e', fontWeight: '600' },
  summaryBtns:  { display: 'flex', flexDirection: 'column', gap: '10px' },

  page:    { minHeight: '100vh', background: '#f0f4f8' },
  topBar:  { background: '#fff', padding: '14px 24px', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  sessionInfo: { fontSize: '14px', fontWeight: '500', color: '#333' },
  endBtn:  { padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  timerBadge: {
    padding: '6px 14px', background: '#eef2ff', color: '#4338ca', borderRadius: '20px',
    fontSize: '13px', fontWeight: '700', fontVariantNumeric: 'tabular-nums',
  },
  timerBadgeLow: { background: '#fee2e2', color: '#dc2626' },
  main:    { maxWidth: '720px', margin: '0 auto', padding: '24px' },

  errorCard: {
    background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px',
    padding: '14px 16px', marginBottom: '16px',
  },
  errorTitle:   { fontSize: '14px', fontWeight: '700', color: '#b91c1c', margin: 0 },
  errorMessage: { fontSize: '13px', color: '#7f1d1d', margin: '4px 0 0' },

  questionCard: { background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  qLabel: { fontSize: '12px', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.05em' },
  qText:  { fontSize: '17px', color: '#1a1a2e', lineHeight: '1.6', fontWeight: '500' },

  statusBadge: { marginBottom: '16px' },
  aiBadge: {
    display: 'inline-block', background: '#dcfce7', color: '#166534',
    padding: '8px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '14px', fontFamily: "'Inter', sans-serif",
  },
  fallbackBadge: {
    display: 'inline-block', background: '#fef3c7', color: '#92400e',
    padding: '8px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '14px', fontFamily: "'Inter', sans-serif",
  },

  feedbackCard: {
    background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px',
    padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', fontFamily: "'Inter', sans-serif",
  },
  feedbackHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' },
  feedbackTitle:  { fontSize: '13px', fontWeight: '600', color: '#166534', textTransform: 'uppercase', letterSpacing: '.03em' },
  feedbackText:   { fontSize: '15px', fontWeight: '400', color: '#333', lineHeight: '1.7', margin: 0, textAlign: 'left' },

  section:      { marginTop: '18px', marginBottom: '18px' },
  sectionTitle: { fontSize: '15px', fontWeight: '600', color: '#166534', marginBottom: '8px', textAlign: 'left' },
  list: {
    marginTop: 0, marginBottom: '16px', paddingLeft: '22px', textAlign: 'left',
    color: '#333', fontSize: '15px', fontWeight: '400', lineHeight: '1.8',
  },

  answerCard: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  textarea: {
    width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px',
    fontSize: '14px', lineHeight: '1.6', resize: 'vertical', outline: 'none',
    marginBottom: '8px', boxSizing: 'border-box',
  },
  counterRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  counterText: { fontSize: '12px', color: '#888' },
  validationWarning: { fontSize: '13px', color: '#dc2626', fontWeight: '500', margin: '6px 0 0' },

  progressContainer: { marginTop: '18px', marginBottom: '22px', flex: '1 1 240px' },
  progressInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '15px', fontWeight: '600' },
  progressBar:  { width: '100%', height: '10px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#4f46e5', borderRadius: '999px', transition: 'width 0.4s ease' },
};
