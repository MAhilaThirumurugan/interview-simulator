
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../hooks/useInterview';

const TOPICS      = ['JavaScript','React','Node.js','MongoDB','System Design','DSA'];
const DIFFICULTIES = ['easy','medium','hard'];

export default function InterviewPage() {
  const navigate = useNavigate();
  const {
    question, evaluation, turnNumber,
    loading, error, completed, summary,
    startInterview, submitAnswer, endInterview, reset,
  } = useInterview();

  const [topic,      setTopic]      = useState('React');
  const [difficulty, setDifficulty] = useState('medium');
  const [answer,     setAnswer]     = useState('');
  const [started,    setStarted]    = useState(false);

  const handleStart = async () => {
    await startInterview(topic, difficulty);
    setStarted(true);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
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
  };

  const scoreColor = (s) => s >= 7 ? '#16a34a' : s >= 4 ? '#d97706' : '#dc2626';

  // Setup screen
  if (!started) return (
    <div style={styles.center}>
      <div style={styles.setupCard}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2 style={styles.setupTitle}>Configure Interview</h2>

        <label style={styles.label}>Topic</label>
        <select style={styles.select} value={topic} onChange={e => setTopic(e.target.value)}>
          {TOPICS.map(t => <option key={t}>{t}</option>)}
        </select>

        <label style={styles.label}>Difficulty</label>
        <select style={styles.select} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
        </select>

        <button style={styles.startBtn} onClick={handleStart} disabled={loading}>
          {loading ? 'Starting...' : '🚀 Start Interview'}
        </button>
      </div>
    </div>
  );

  // Summary screen
  if (completed && summary) return (
    <div style={styles.center}>
      <div style={styles.summaryCard}>
        <h2 style={styles.summaryTitle}>🎉 Interview Complete!</h2>
        <p style={styles.summaryScore}>
          Overall Score:
          <span style={{ color: scoreColor(summary.overallScore), fontWeight:'700', fontSize:'32px' }}>
            {' '}{summary.overallScore}/10
          </span>
        </p>
        <p style={styles.summaryMeta}>
          {summary.totalQuestions} questions answered · {topic} · {difficulty}
        </p>
        <div style={styles.summaryBtns}>
          <button style={styles.startBtn} onClick={handleReset}>Try Again</button>
          <button style={styles.outlineBtn} onClick={() => navigate('/dashboard')}>Dashboard</button>
        </div>
      </div>
    </div>
  );

  // Interview screen
  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <span style={styles.sessionInfo}>
          {topic} · {difficulty} · Question {turnNumber}
        </span>
        <button style={styles.endBtn} onClick={handleEnd} disabled={loading}>
          End Interview
        </button>
      </div>

      <div style={styles.main}>
        {error && <p style={styles.error}>{error}</p>}

        {/* Question */}
        <div style={styles.questionCard}>
          <p style={styles.qLabel}>Question {turnNumber}</p>
          <p style={styles.qText}>{question}</p>
        </div>

        {/* Feedback from previous answer */}
        {evaluation && (
          <div style={styles.feedbackCard}>
            <div style={styles.feedbackHeader}>
              <span style={styles.feedbackTitle}>Previous Answer Feedback</span>
              <span style={{ color: scoreColor(evaluation.score), fontWeight:'700', fontSize:'20px' }}>
                {evaluation.score}/10
              </span>
            </div>
            <p style={styles.feedbackText}>{evaluation.feedback}</p>
            {evaluation.strengths && (
              <p style={styles.feedbackSub}><strong>✅ Strengths:</strong> {evaluation.strengths}</p>
            )}
            {evaluation.improvements && (
              <p style={styles.feedbackSub}><strong>💡 Improve:</strong> {evaluation.improvements}</p>
            )}
          </div>
        )}

        {/* Answer input */}
        <div style={styles.answerCard}>
          <label style={styles.label}>Your Answer</label>
          <textarea
            style={styles.textarea}
            rows={6}
            placeholder="Type your answer here..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            disabled={loading}
          />
          <button
            style={{ ...styles.startBtn, opacity: (!answer.trim() || loading) ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={!answer.trim() || loading}
          >
            {loading ? 'Evaluating...' : 'Submit Answer →'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  center:         { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f4f8' },
  setupCard:      { background:'#fff', padding:'40px', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'100%', maxWidth:'420px' },
  backBtn:        { background:'none', border:'none', color:'#4f46e5', cursor:'pointer', fontSize:'14px', padding:'0 0 16px', display:'block' },
  setupTitle:     { fontSize:'22px', fontWeight:'700', marginBottom:'24px' },
  label:          { display:'block', fontSize:'13px', fontWeight:'500', color:'#555', marginBottom:'6px' },
  select:         { width:'100%', padding:'11px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', marginBottom:'16px', outline:'none' },
  startBtn:       { width:'100%', padding:'13px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'600', cursor:'pointer' },
  outlineBtn:     { width:'100%', padding:'13px', background:'#fff', color:'#4f46e5', border:'2px solid #4f46e5', borderRadius:'8px', fontSize:'15px', fontWeight:'600', cursor:'pointer', marginTop:'10px' },
  summaryCard:    { background:'#fff', padding:'48px', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'100%', maxWidth:'420px', textAlign:'center' },
  summaryTitle:   { fontSize:'26px', fontWeight:'700', marginBottom:'16px' },
  summaryScore:   { fontSize:'18px', color:'#333', marginBottom:'8px' },
  summaryMeta:    { fontSize:'14px', color:'#888', marginBottom:'32px' },
  summaryBtns:    { display:'flex', flexDirection:'column', gap:'10px' },
  page:           { minHeight:'100vh', background:'#f0f4f8' },
  topBar:         { background:'#fff', padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  sessionInfo:    { fontSize:'14px', fontWeight:'500', color:'#333' },
  endBtn:         { padding:'8px 16px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontWeight:'500' },
  main:           { maxWidth:'720px', margin:'0 auto', padding:'24px' },
  error:          { background:'#fee', color:'#c00', padding:'10px', borderRadius:'6px', marginBottom:'12px', fontSize:'14px' },
  questionCard:   { background:'#fff', borderRadius:'12px', padding:'24px', marginBottom:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  qLabel:         { fontSize:'12px', color:'#888', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'.05em' },
  qText:          { fontSize:'17px', color:'#1a1a2e', lineHeight:'1.6', fontWeight:'500' },
  feedbackCard:   { background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'20px', marginBottom:'16px' },
  feedbackHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' },
  feedbackTitle:  { fontSize:'13px', fontWeight:'600', color:'#166534' },
  feedbackText:   { fontSize:'14px', color:'#333', lineHeight:'1.6', marginBottom:'8px' },
  feedbackSub:    { fontSize:'13px', color:'#555', marginBottom:'4px' },
  answerCard:     { background:'#fff', borderRadius:'12px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  textarea:       { width:'100%', padding:'12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', lineHeight:'1.6', resize:'vertical', outline:'none', marginBottom:'12px', boxSizing:'border-box' },
};