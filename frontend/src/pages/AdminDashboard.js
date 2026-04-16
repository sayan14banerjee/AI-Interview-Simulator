import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api';
import './AdminDashboard.css';

function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [expandedSession, setExpandedSession] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [user?.role, navigate]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (err) {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetails = async (userId) => {
    setSelectedUser(userId);
    setDetailsLoading(true);
    setExpandedSession(null);

    try {
      const response = await userAPI.getUserProfile(userId);
      setUserDetails(response.data || null);
      setError('');
    } catch (err) {
      setUserDetails(null);
      setError('Failed to load user details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const getInitial = (name) => {
    return name?.trim()?.charAt(0)?.toUpperCase() || 'U';
  };

  const safeText = (value, fallback = 'Not provided') => {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    return value;
  };

  const getFeedbackItems = (feedback) => {
    if (!feedback) {
      return [];
    }
    return Array.isArray(feedback) ? feedback : [feedback];
  };

  const getQuestionStats = (interviews) => {
    const questions = interviews.flatMap((session) => session.questions || []);
    const scores = questions
      .map((question) => question.evaluation?.final_score)
      .filter((score) => typeof score === 'number');

    return {
      totalInterviews: interviews.length,
      totalQuestions: questions.length,
      answeredQuestions: questions.filter((question) => Boolean(question.answer)).length,
      evaluatedQuestions: questions.filter((question) => Boolean(question.evaluation)).length,
      averageScore: scores.length
        ? scores.reduce((total, score) => total + score, 0) / scores.length
        : null,
    };
  };

  const getSessionAverage = (session) => {
    const scores = (session.questions || [])
      .map((question) => question.evaluation?.final_score)
      .filter((score) => typeof score === 'number');

    if (!scores.length) {
      return null;
    }

    return scores.reduce((total, score) => total + score, 0) / scores.length;
  };

  const truncateText = (text, maxLength = 180) => {
    if (!text) {
      return '';
    }
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  if (user?.role !== 'admin') {
    return null;
  }

  const detailsUser = userDetails?.user || userDetails || {};
  const interviews = Array.isArray(userDetails?.interviews) ? userDetails.interviews : [];
  const stats = getQuestionStats(interviews);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <h1>Admin Dashboard</h1>
        </div>
        <div className="header-right">
          <span className="admin-badge">Admin</span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-content">
        {error && <div className="error-message">{error}</div>}

        <div className="admin-main">
          <div className="users-panel">
            <h2>All Users</h2>

            {loading ? (
              <div className="loading">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="empty-state">No users found</div>
            ) : (
              <div className="users-list">
                {users.map((account) => (
                  <div
                    key={account.id}
                    className={`user-item ${selectedUser === account.id ? 'selected' : ''}`}
                    onClick={() => loadUserDetails(account.id)}
                  >
                    <div className="user-item-avatar">
                      {getInitial(account.name)}
                    </div>
                    <div className="user-item-info">
                      <div className="user-item-name">{safeText(account.name, 'Unnamed user')}</div>
                      <div className="user-item-email">{safeText(account.email, 'No email')}</div>
                      <div className="user-item-role">{safeText(account.role, 'candidate')}</div>
                    </div>
                    <div className="user-item-arrow">&gt;</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="details-panel">
            {detailsLoading ? (
              <div className="empty-details">
                <p>Loading user details...</p>
              </div>
            ) : selectedUser && userDetails ? (
              <>
                <h2>User Details</h2>
                <div className="user-details-card">
                  <div className="detail-header">
                    <div className="detail-avatar">
                      {getInitial(detailsUser.name)}
                    </div>
                    <div className="detail-header-info">
                      <h3>{safeText(detailsUser.name, 'Unnamed user')}</h3>
                      <p>{safeText(detailsUser.email, 'No email')}</p>
                      <span className={`detail-role-badge role-${detailsUser.role?.toLowerCase()}`}>
                        {safeText(detailsUser.role, 'candidate').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="details-sections">
                    <section className="account-info-section">
                      <h4>Account Information</h4>
                      <div className="info-grid">
                        <div className="info-card">
                          <div className="info-icon">User</div>
                          <div className="info-content">
                            <label>Full Name</label>
                            <p>{safeText(detailsUser.name)}</p>
                          </div>
                        </div>

                        <div className="info-card">
                          <div className="info-icon">Email</div>
                          <div className="info-content">
                            <label>Email Address</label>
                            <p>{safeText(detailsUser.email)}</p>
                          </div>
                        </div>

                        <div className="info-card">
                          <div className="info-icon">ID</div>
                          <div className="info-content">
                            <label>User ID</label>
                            <p>{safeText(detailsUser.id)}</p>
                          </div>
                        </div>

                        <div className="info-card">
                          <div className="info-icon">Role</div>
                          <div className="info-content">
                            <label>Role</label>
                            <p className={`role-text role-${detailsUser.role?.toLowerCase()}`}>
                              {safeText(detailsUser.role, 'candidate').toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="detail-section">
                      <h4>Interview Statistics</h4>
                      <div className="stats-grid admin-stats-grid">
                        <div className="stat">
                          <div className="stat-number">{stats.totalInterviews}</div>
                          <div className="stat-label">Interviews</div>
                        </div>
                        <div className="stat">
                          <div className="stat-number">{stats.totalQuestions}</div>
                          <div className="stat-label">Questions</div>
                        </div>
                        <div className="stat">
                          <div className="stat-number">{stats.answeredQuestions}</div>
                          <div className="stat-label">Answered</div>
                        </div>
                        <div className="stat">
                          <div className="stat-number">
                            {stats.averageScore === null ? 'N/A' : stats.averageScore.toFixed(1)}
                          </div>
                          <div className="stat-label">Avg Score</div>
                        </div>
                      </div>
                    </section>

                    <section className="detail-section">
                      <div className="section-title-row">
                        <h4>Interview History</h4>
                        <span>{stats.evaluatedQuestions} evaluated</span>
                      </div>

                      {interviews.length === 0 ? (
                        <div className="empty-state compact">No interview history found</div>
                      ) : (
                        <div className="admin-interviews-list">
                          {interviews.map((session) => {
                            const sessionQuestions = session.questions || [];
                            const answeredCount = sessionQuestions.filter((question) => Boolean(question.answer)).length;
                            const sessionAverage = getSessionAverage(session);
                            const isExpanded = expandedSession === session.session_id;

                            return (
                              <div key={session.session_id} className="admin-interview-session">
                                <button
                                  className="admin-session-header"
                                  onClick={() => setExpandedSession(isExpanded ? null : session.session_id)}
                                >
                                  <div>
                                    <h5>Session #{session.session_id}</h5>
                                    <p>
                                      {safeText(session.role, 'Interview')} | {safeText(session.difficulty, 'No difficulty')}
                                    </p>
                                  </div>
                                  <div className="session-meta">
                                    <span>{answeredCount}/{sessionQuestions.length} answered</span>
                                    <span>{sessionAverage === null ? 'N/A' : `${sessionAverage.toFixed(1)}/10`}</span>
                                    <strong>{isExpanded ? 'Hide' : 'View'}</strong>
                                  </div>
                                </button>

                                {isExpanded && (
                                  <div className="admin-questions-list">
                                    {sessionQuestions.length === 0 ? (
                                      <p className="no-data">No questions generated for this session.</p>
                                    ) : (
                                      sessionQuestions.map((question, questionIndex) => (
                                        <div key={`${session.session_id}-${questionIndex}`} className="admin-question-card">
                                          <h6>Q{questionIndex + 1}. {question.question}</h6>

                                          {question.answer ? (
                                            <div className="admin-answer-block">
                                              <label>Answer</label>
                                              <p>{truncateText(question.answer)}</p>
                                            </div>
                                          ) : (
                                            <p className="no-data">Not answered yet.</p>
                                          )}

                                          {question.evaluation ? (
                                            <div className="admin-evaluation-block">
                                              <strong>
                                                Score: {question.evaluation.final_score ?? 'N/A'}/10
                                              </strong>
                                              {getFeedbackItems(question.evaluation.feedback).length > 0 && (
                                                <ul>
                                                  {getFeedbackItems(question.evaluation.feedback).map((feedback, feedbackIndex) => (
                                                    <li key={feedbackIndex}>{feedback}</li>
                                                  ))}
                                                </ul>
                                              )}
                                            </div>
                                          ) : (
                                            <p className="no-data">No evaluation yet.</p>
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-details">
                <p>Select a user to view details</p>
              </div>
            )}
          </div>
        </div>

        <div className="admin-summary">
          <div className="summary-card">
            <h3>Total Users</h3>
            <div className="summary-number">{users.length}</div>
          </div>
          <div className="summary-card">
            <h3>Admins</h3>
            <div className="summary-number">
              {users.filter((account) => account.role === 'admin').length}
            </div>
          </div>
          <div className="summary-card">
            <h3>Candidates</h3>
            <div className="summary-number">
              {users.filter((account) => account.role === 'candidate').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
