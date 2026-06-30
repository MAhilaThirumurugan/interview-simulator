import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../services/api';

export default function DashboardPage() {
  const { user, logout }       = useAuth();
  const navigate               = useNavigate();
  const [history, setHistory]  = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    interviewAPI.getHistory()
      .then(({ data }) => setHistory(data.interviews))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scoreColor = (score) =>
    score >= 7 ? '#16a34a' : score >= 4 ? '#d97706' : '#dc2626';

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎯 AI Interview Simulator</h1>
        <div style={styles.headerRight}>
          <span style={styles.userName}>👋 {user?.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Start new interview */}
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>Ready to practice?</h2>
        <p style={styles.heroSub}>Start a new AI-powered interview session</p>
        <button style={styles.startBtn} onClick={() => navigate('/interview')}>
          Start New Interview
        </button>
      </div>

      {/* History */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Past Interviews</h3>
        {loading ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p style={styles.empty}>No interviews yet. Start your first one above!</p>
        ) : (
          <div style={styles.grid}>
            {history.map((item) => (
              <div key={item._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.topic}>{item.topic}</span>
                  <span style={styles.difficulty}>{item.difficulty}</span>
                </div>
                <p style={styles.cardDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p style={styles.cardQuestions}>
                  {item.turns?.length || 0} questions answered
                </p>
                <p style={{ ...styles.cardScore, color: scoreColor(item.overallScore) }}>
                  Score: {item.overallScore}/10
                </p>
                <span style={{
                  ...styles.badge,
                  background: item.status === 'completed' ? '#dcfce7' : '#fef9c3',
                  color: item.status === 'completed' ? '#16a34a' : '#854d0e',
                }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container:    { minHeight:'100vh', background:'#f0f4f8', padding:'0 0 40px' },
  header:       { background:'#fff', padding:'16px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  title:        { fontSize:'20px', fontWeight:'600' },
  headerRight:  { display:'flex', alignItems:'center', gap:'16px' },
  userName:     { fontSize:'14px', color:'#555' },
  logoutBtn:    { padding:'7px 14px', border:'1px solid #ddd', borderRadius:'6px', cursor:'pointer', fontSize:'13px', background:'#fff' },
  hero:         { background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', padding:'48px 32px', textAlign:'center' },
  heroTitle:    { fontSize:'28px', fontWeight:'700', marginBottom:'8px' },
  heroSub:      { fontSize:'15px', opacity:0.85, marginBottom:'24px' },
  startBtn:     { padding:'14px 32px', background:'#fff', color:'#4f46e5', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'600', cursor:'pointer' },
  section:      { padding:'32px' },
  sectionTitle: { fontSize:'18px', fontWeight:'600', marginBottom:'16px' },
  empty:        { color:'#888', fontSize:'14px' },
  grid:         { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'16px' },
  card:         { background:'#fff', borderRadius:'10px', padding:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  cardTop:      { display:'flex', justifyContent:'space-between', marginBottom:'8px' },
  topic:        { fontWeight:'600', fontSize:'15px' },
  difficulty:   { fontSize:'12px', color:'#888', textTransform:'capitalize' },
  cardDate:     { fontSize:'12px', color:'#aaa', marginBottom:'6px' },
  cardQuestions:{ fontSize:'13px', color:'#555', marginBottom:'4px' },
  cardScore:    { fontSize:'18px', fontWeight:'700', marginBottom:'8px' },
  badge:        { padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'500' },
};