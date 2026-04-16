import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../api';
import './ResumeUpload.css';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedData, setUploadedData] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.docx')) {
        setError('Please upload a PDF or DOCX file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await resumeAPI.upload(file);
      setUploadedData(response.data);
      setSuccess('Resume uploaded and processed successfully!');
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-container">
      <div className="resume-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Upload Your Resume</h1>
      </div>

      <div className="resume-content">
        <div className="upload-card">
          <h2>Upload Resume</h2>
          <p className="upload-info">
            Upload your resume to help us personalize interview questions based on your experience.
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleUpload}>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                disabled={loading}
              />
              <label htmlFor="file-input" className="file-label">
                <span className="file-icon">📄</span>
                <span className="file-text">
                  {file ? file.name : 'Choose PDF or DOCX file'}
                </span>
              </label>
            </div>

            <p className="file-info">Supported formats: PDF, DOCX</p>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || !file}
            >
              {loading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </form>

          {uploadedData && (
            <div className="upload-success">
              <h3>✓ Resume Processed Successfully</h3>
              <div className="resume-details">
                {uploadedData.skills && (
                  <div className="detail-item">
                    <h4>Skills</h4>
                    <div className="skills-list">
                      {Array.isArray(uploadedData.skills) 
                        ? uploadedData.skills.map((skill, idx) => (
                            <span key={idx} className="skill-badge">{skill}</span>
                          ))
                        : <p>{uploadedData.skills}</p>
                      }
                    </div>
                  </div>
                )}
                {uploadedData.experience && (
                  <div className="detail-item">
                    <h4>Experience</h4>
                    <p>{uploadedData.experience} years</p>
                  </div>
                )}
                {uploadedData.summary && (
                  <div className="detail-item">
                    <h4>Summary</h4>
                    <p>{uploadedData.summary}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="info-card">
          <h3>Why Upload Your Resume?</h3>
          <ul>
            <li>Get personalized interview questions</li>
            <li>Better skill alignment matching</li>
            <li>More relevant technical questions</li>
            <li>Improved feedback and suggestions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResumeUpload;
