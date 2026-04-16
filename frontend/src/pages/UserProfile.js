import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api';
import './UserProfile.css';

function UserProfile({ user, onLogout }) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSession, setExpandedSession] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfile();
      console.log('Profile Data:', response.data);
      setProfileData(response.data);
      setError('');
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      // Could call logout API here if needed
    }
    onLogout();
    navigate('/login');
  };

  const getInitial = (name) => {
    return name?.charAt(0).toUpperCase() || 'U';
  };

  const getAvatarColor = (role) => {
    const colors = {
      admin: '#667eea',
      candidate: '#764ba2',
      developer: '#f093fb',
    };
    return colors[role?.toLowerCase()] || '#667eea';
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  const user_data = profileData?.user || profileData || {};
  const interviews = profileData?.interviews || [];

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <h1>My Profile</h1>
        </div>
        <div className="header-right">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="profile-content">
        {error && <div className="error-message">{error}</div>}

        {user_data && (
          <>
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-header-info">
                <div className="profile-avatar" style={{ backgroundColor: getAvatarColor(user_data.role) }}>
                  {getInitial(user_data.name)}
                </div>
                <div className="profile-info">
                  <h2>{user_data.name}</h2>
                  <p className="profile-email">{user_data.email}</p>
                  <span className={`role-badge role-${user_data.role?.toLowerCase()}`}>
                    {user_data.role?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="profile-details">
                <div className="account-info-section">
                  <div className="info-grid">
                    <div className="info-card">
                      <div className="info-icon">👤</div>
                      <div className="info-content">
                        <label>Full Name</label>
                        <p>{user_data.name}</p>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-icon">📧</div>
                      <div className="info-content">
                        <label>Email Address</label>
                        <p>{user_data.email}</p>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-icon">🎯</div>
                      <div className="info-content">
                        <label>Role</label>
                        <p className={`role-text role-${user_data.role?.toLowerCase()}`}>
                          {user_data.role?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Actions</h3>
                  <div className="action-buttons">
                    <button 
                      className="btn-primary"
                      onClick={() => navigate('/dashboard')}
                    >
                      Start New Interview
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => navigate('/upload-resume')}
                    >
                      Update Resume
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Statistics */}
            {interviews && interviews.length > 0 && (
              <div className="stats-card">
                <h2>Interview Statistics</h2>
                <div className="stats-overview">
                  <div className="stat-box">
                    <div className="stat-value">{interviews.length}</div>
                    <div className="stat-name">Total Interviews</div>
                  </div>
                  
                  <div className="stat-box">
                    <div className="stat-value">
                      {Math.round(
                        interviews.reduce((acc, session) => {
                          const scores = session.questions
                            .filter(q => q.evaluation?.final_score)
                            .map(q => q.evaluation.final_score);
                          return acc + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
                        }, 0) / interviews.length
                      )}
                    </div>
                    <div className="stat-name">Average Score</div>
                  </div>

                  <div className="stat-box">
                    <div className="stat-value">
                      {interviews.reduce((acc, session) => {
                        return acc + session.questions.filter(q => q.answer).length;
                      }, 0)}
                    </div>
                    <div className="stat-name">Questions Answered</div>
                  </div>

                  <div className="stat-box">
                    <div className="stat-value">
                      {interviews.reduce((acc, session) => {
                        return acc + session.questions.filter(q => q.evaluation).length;
                      }, 0)}
                    </div>
                    <div className="stat-name">Evaluated</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Interviews Summary */}
            {interviews && interviews.length > 0 && (
              <div className="recent-interviews-card">
                <h2>Recent Interviews</h2>
                <div className="recent-list">
                  {interviews.slice(0, 3).map((session) => (
                    <div key={session.session_id} className="recent-item">
                      <div className="recent-left">
                        <h4>{session.role}</h4>
                        <p>Session #{session.session_id} • {session.difficulty}</p>
                      </div>
                      <div className="recent-right">
                        <span className="answered">
                          {session.questions.filter(q => q.answer).length}/{session.questions.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interviews Card */}
            {interviews && interviews.length > 0 && (
              <div className="interviews-card">
                <h2>Interview History</h2>
                <p className="interviews-count">Total Interviews: {interviews.length}</p>
                
                <div className="interviews-list">
                  {interviews.map((session, idx) => (
                    <div key={session.session_id} className="interview-session">
                      <div 
                        className="session-header"
                        onClick={() => setExpandedSession(expandedSession === session.session_id ? null : session.session_id)}
                      >
                        <div className="session-info">
                          <h4>Session #{session.session_id}</h4>
                          <span className="session-role">{session.role}</span>
                          <span className="session-difficulty">{session.difficulty}</span>
                        </div>
                        <div className="session-toggle">
                          <span>{expandedSession === session.session_id ? '▼' : '▶'}</span>
                        </div>
                      </div>

                      {expandedSession === session.session_id && (
                        <div className="session-details">
                          <div className="questions-list">
                            {session.questions && session.questions.map((q, qIdx) => (
                              <div key={qIdx} className="question-card">
                                <div className="question-header">
                                  <h5>Q{qIdx + 1}: {q.question?.substring(0, 80)}...</h5>
                                </div>

                                {q.answer && (
                                  <div className="answer-section">
                                    <label>Your Answer:</label>
                                    <p className="answer-text">{q.answer?.substring(0, 200)}...</p>
                                  </div>
                                )}

                                {q.evaluation && (
                                  <div className="evaluation-section">
                                    <div className="evaluation-score">
                                      <strong>Score: {q.evaluation.final_score}/10</strong>
                                    </div>
                                    {q.evaluation.feedback && (
                                      <div className="evaluation-feedback">
                                        <label>Feedback:</label>
                                        <ul>
                                          {Array.isArray(q.evaluation.feedback) ? (
                                            q.evaluation.feedback.map((fb, fbIdx) => (
                                              <li key={fbIdx}>{fb}</li>
                                            ))
                                          ) : (
                                            <li>{q.evaluation.feedback}</li>
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {!q.answer && !q.evaluation && (
                                  <p className="no-data">Not attempted</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!interviews || interviews.length === 0) && (
              <div className="no-interviews">
                <p>No interview history yet. Start your first interview!</p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/dashboard')}
                >
                  Take an Interview
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
