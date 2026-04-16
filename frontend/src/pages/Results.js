import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../api';
import './Results.css';

function Results() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const response = await interviewAPI.getReport(sessionId);
      console.log('Full API Response:', response.data);
      setReport(response.data);
      setError('');
    } catch (err) {
      console.error('Error loading report:', err);
      setError('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadReport();
  }, [sessionId, loadReport]);

  if (loading) {
    return <div className="results-loading">Loading results...</div>;
  }

  if (error) {
    return (
      <div className="results-error">
        <div className="error-message">{error}</div>
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Safe data extraction
  const reportData = report?.report || report || {};
  const summaryText = report?.summary || '';
  
  const overallScore = Math.round(reportData.overall_score || 0);
  const confidence = reportData.confidence ? Math.round(reportData.confidence * 100) : 0;
  const strongAreas = reportData.strong_areas || [];
  const weakAreas = reportData.weak_areas || [];
  const improvementPlan = reportData.improvement_plan || [];

  console.log('Extracted Data:', {
    overallScore,
    confidence,
    strongAreas,
    weakAreas,
    improvementPlan,
    summaryText: summaryText.substring(0, 100)
  });

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Interview Results</h1>
        <p>Session ID: {sessionId}</p>
      </div>

      <div className="results-content">
        {report ? (
          <>
            {/* Overall Score Card */}
            <div className="score-card">
              <div className="overall-score">
                <div className="score-circle">
                  <div className="score-number">{overallScore}</div>
                  <div className="score-label">/10</div>
                </div>
              </div>
              <div className="score-details">
                <p><strong>Interview Status:</strong> Completed ✓</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                {confidence > 0 && (
                  <p><strong>Confidence:</strong> {confidence}%</p>
                )}
              </div>
            </div>

            {/* Summary Section */}
            {summaryText && (
              <div className="summary-card">
                <h2>Overall Assessment</h2>
                <p className="summary-text">
                  {summaryText
                    .split('\n')[0]
                    .replace(/\*\*/g, '')
                    .replace(/\|/g, '')
                    .replace(/-+/g, '')
                    .trim() || 'Your interview has been evaluated. Review the sections below for detailed feedback.'}
                </p>
              </div>
            )}

            {/* Strong Areas */}
            {strongAreas && strongAreas.length > 0 ? (
              <div className="strengths-card">
                <h3>Your Strengths</h3>
                <div className="strength-items">
                  {strongAreas.map((strength, idx) => (
                    <div key={idx} className="strength-item">
                      <span className="strength-icon">✓</span>
                      <p>{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="strengths-card">
                <h3>Your Strengths</h3>
                <div className="strength-items">
                  <div className="strength-item">
                    <span className="strength-icon">✓</span>
                    <p>Demonstrated problem-solving and communication skills</p>
                  </div>
                </div>
              </div>
            )}

            {/* Areas for Improvement */}
            {weakAreas && weakAreas.length > 0 ? (
              <div className="improvement-card">
                <h3>Areas for Improvement</h3>
                <div className="improvement-items">
                  {weakAreas.slice(0, 5).map((area, idx) => (
                    <div key={idx} className="improvement-item">
                      <span className="item-number">{idx + 1}</span>
                      <p>{area}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="improvement-card">
                <h3>Areas for Improvement</h3>
                <div className="improvement-items">
                  <div className="improvement-item">
                    <span className="item-number">1</span>
                    <p>Consider providing more detailed examples with quantifiable results</p>
                  </div>
                  <div className="improvement-item">
                    <span className="item-number">2</span>
                    <p>Focus on specific technical implementations and learnings</p>
                  </div>
                </div>
              </div>
            )}

            {/* Improvement Plan */}
            {improvementPlan && improvementPlan.length > 0 && (
              <div className="feedback-card">
                <h3>Improvement Plan</h3>
                <div className="feedback-items">
                  {improvementPlan.slice(0, 10).map((suggestion, idx) => (
                    <div key={idx} className="suggestion-item">
                      <span className="suggestion-num">{idx + 1}</span>
                      <p>{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="next-steps-card">
              <h3>Next Steps</h3>
              <div className="steps-list">
                <div className="step">
                  <span className="step-num">1</span>
                  <p>Review the feedback above and focus on the top 3 areas for improvement</p>
                </div>
                <div className="step">
                  <span className="step-num">2</span>
                  <p>Practice similar questions with the improvement suggestions in mind</p>
                </div>
                <div className="step">
                  <span className="step-num">3</span>
                  <p>Take another mock interview to track your progress</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-data">
            <p>No results available</p>
          </div>
        )}

        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
          <button 
            className="btn-secondary"
            onClick={() => window.print()}
          >
            Print Results
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            New Interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
