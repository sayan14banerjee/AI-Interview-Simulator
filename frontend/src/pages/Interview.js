import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../api';
import './Interview.css';

function Interview() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState({});
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent double API call in development mode
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadQuestions = async () => {
      setLoading(true);
      try {
        const response = await interviewAPI.generateQuestions(sessionId);
        const questionsData = Array.isArray(response.data.questions) 
          ? response.data.questions 
          : response.data;
        setQuestions(Array.isArray(questionsData) ? questionsData : []);
        setStartTime(Date.now());
        setError('');
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [sessionId]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: e.target.value,
    });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitAnswer = async () => {
    const answer = answers[currentQuestionIndex];
    if (!answer || answer.trim() === '') {
      setError('Please provide an answer before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const responseTime = Math.floor((Date.now() - (startTime[currentQuestionIndex] || startTime)) / 1000);
      await interviewAPI.submitAnswer(
        currentQuestion.id,
        answer,
        responseTime
      );
      setError('');

      if (currentQuestionIndex < questions.length - 1) {
        setStartTime({
          ...startTime,
          [currentQuestionIndex + 1]: Date.now(),
        });
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions answered, go to results
        navigate(`/results/${sessionId}`);
      }
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (loading) {
    return <div className="interview-loading">Loading interview questions...</div>;
  }

  if (!currentQuestion) {
    return <div className="interview-error">No questions available</div>;
  }

  return (
    <div className="interview-container">
      <div className="interview-header">
        <h1>Interview Session</h1>
        <div className="progress-info">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="interview-content">
        <div className="question-panel">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="question-section">
            <h2>Question {currentQuestionIndex + 1}</h2>
            <p className="question-text">
              {currentQuestion?.question || currentQuestion?.question_text || 'Loading...'}
            </p>
            
            {currentQuestion?.difficulty && (
              <span className={`difficulty difficulty-${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty}
              </span>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="answer-section">
            <label>Your Answer:</label>
            <textarea
              value={answers[currentQuestionIndex] || ''}
              onChange={handleAnswerChange}
              placeholder="Type your answer here..."
              rows="8"
              disabled={submitting}
            />
            <div className="char-count">
              {(answers[currentQuestionIndex] || '').length} characters
            </div>
          </div>

          <div className="button-group">
            <button
              className="btn-secondary"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || submitting}
            >
              ← Previous
            </button>

            <button
              className="btn-secondary"
              onClick={handleSkipQuestion}
              disabled={currentQuestionIndex === questions.length - 1 || submitting}
            >
              Skip →
            </button>

            <button
              className="btn-success"
              onClick={handleSubmitAnswer}
              disabled={submitting || !answers[currentQuestionIndex]?.trim()}
            >
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </button>

            {currentQuestionIndex === questions.length - 1 && (
              <button
                className="btn-primary"
                onClick={() => navigate(`/results/${sessionId}`)}
              >
                View Results
              </button>
            )}
          </div>
        </div>

        <div className="sidebar">
          <h3>Questions Overview</h3>
          <div className="questions-list">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className={`question-item ${idx === currentQuestionIndex ? 'active' : ''} ${answers[idx] ? 'answered' : ''}`}
                onClick={() => setCurrentQuestionIndex(idx)}
              >
                <div className="question-num">Q{idx + 1}</div>
                <div className="question-preview">
                  {(q.question || q.question_text || 'Question').substring(0, 50)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
