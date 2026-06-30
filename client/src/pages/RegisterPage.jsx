import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register }   = useAuth();
  const navigate       = useNavigate();
  const [form, setForm]     = useState({ name:'', email:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎯 AI Interview Simulator</h1>
        <h2 style={styles.subtitle}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} type="text"     name="name"     placeholder="Full Name" value={form.name}     onChange={handleChange} required />
          <input style={styles.input} type="email"    name="email"    placeholder="Email"     value={form.email}    onChange={handleChange} required />
          <input style={styles.input} type="password" name="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f4f8' },
  card:      { background:'#fff', padding:'40px', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'100%', maxWidth:'400px' },
  title:     { textAlign:'center', fontSize:'22px', marginBottom:'6px' },
  subtitle:  { textAlign:'center', color:'#555', marginBottom:'24px' },
  error:     { background:'#fee', color:'#c00', padding:'10px', borderRadius:'6px', marginBottom:'12px', fontSize:'14px' },
  form:      { display:'flex', flexDirection:'column', gap:'12px' },
  input:     { padding:'12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', outline:'none' },
  btn:       { padding:'12px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', fontSize:'15px', cursor:'pointer', fontWeight:'500' },
  link:      { textAlign:'center', marginTop:'16px', fontSize:'14px', color:'#555' },
};