import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI, authAPI } from '../api';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate');
  const [selectedType, setSelectedType] = useState('technical');

  const roles = [
    'Software Engineer',
    'Data Scientist',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Product Manager',
    'UX Designer',
  ];

  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const interviewTypes = ['technical', 'behavioral', 'system-design'];

  const handleStartInterview = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await interviewAPI.createInterview(
        selectedRole,
        selectedDifficulty,
        selectedType
      );
      navigate(`/interview/${response.data.session_id}`);
    } catch (err) {
      setError('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>AI Interview Simulator</h1>
        </div>
        <div className="header-right">
          <span className="user-info">Welcome, {user?.name}</span>
          <button 
            className="btn-profile"
            onClick={() => navigate('/profile')}
          >
            My Profile
          </button>
          {user?.role === 'admin' && (
            <button 
              className="btn-admin"
              onClick={() => navigate('/admin')}
            >
              Admin Panel
            </button>
          )}
          <button 
            className="btn-logout"
            onClick={() => {
              onLogout();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="intro-section">
          <h2>Practice Your Interview Skills</h2>
          <p>Prepare for your next interview with our AI-powered mock interview simulator.</p>
        </div>

        <div className="interview-setup">
          <div className="setup-card">
            <h3>Interview Configuration</h3>
            
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Select Job Role:</label>
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty Level:</label>
              <div className="radio-group">
                {difficulties.map((diff) => (
                  <label key={diff} className="radio-label">
                    <input
                      type="radio"
                      name="difficulty"
                      value={diff}
                      checked={selectedDifficulty === diff}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                    />
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Interview Type:</label>
              <div className="radio-group">
                {interviewTypes.map((type) => (
                  <label key={type} className="radio-label">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={selectedType === type}
                      onChange={(e) => setSelectedType(e.target.value)}
                    />
                    {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </label>
                ))}
              </div>
            </div>

            <button 
              className="btn-primary btn-large"
              onClick={handleStartInterview}
              disabled={loading}
            >
              {loading ? 'Starting Interview...' : 'Start Interview'}
            </button>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <h4>How It Works</h4>
              <ul>
                <li>Configure your interview preferences</li>
                <li>Answer AI-generated interview questions</li>
                <li>Get instant feedback and scoring</li>
                <li>View detailed performance report</li>
              </ul>
            </div>

            <div className="info-card">
              <h4>Quick Actions</h4>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/upload-resume')}
              >
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
