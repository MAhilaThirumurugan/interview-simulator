import { useState } from 'react';
import { interviewAPI } from '../services/api';

export function useInterview() {
  const [sessionId,   setSessionId]   = useState(null);
  const [question,    setQuestion]    = useState('');
  const [mode, setMode] = useState("");
  const [evaluation,  setEvaluation]  = useState(null);
  const [turnNumber,  setTurnNumber]  = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [completed,   setCompleted]   = useState(false);
  const [summary,     setSummary]     = useState(null);

  const startInterview = async (topic, difficulty) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await interviewAPI.start({ topic, difficulty });
      setSessionId(data.sessionId);
      setQuestion(data.question);
      setMode(data.mode);
      setTurnNumber(data.turnNumber);
      setEvaluation(null);
      setCompleted(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (answer) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await interviewAPI.submitAnswer({
        sessionId,
        answer,
      });
      
      setEvaluation(data.evaluation);
      
      if (data.completed) {
        setCompleted(true);
      
        setSummary({
          overallScore: data.overallScore,
          totalQuestions: data.totalQuestions,
        });
      
        return;
      }
      
      setQuestion(data.nextQuestion);
      setMode(data.mode);
      setTurnNumber(data.turnNumber);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    try {
      setLoading(true);
      const { data } = await interviewAPI.end(sessionId);
      setSummary(data);
      setCompleted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to end interview');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSessionId(null);
    setQuestion('');
    setMode("");
    setEvaluation(null);
    setTurnNumber(0);
    setCompleted(false);
    setSummary(null);
    setError('');
  };

  return {
    sessionId, question,  mode, evaluation,
    turnNumber, loading, error,
    completed, summary,
    startInterview, submitAnswer, endInterview, reset,
  };
}