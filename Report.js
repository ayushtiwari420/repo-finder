import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve data passed from Home page
  const data = location.state?.data;
  const url = location.state?.url || '';

  // If someone tries to go to /report directly without data, send them Home
  useEffect(() => {
    if (!data) {
      navigate('/');
    }
  }, [data, navigate]);

  if (!data) return null;

  const getRepoName = (link) => {
    try {
      const parts = link.split('/');
      return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
    } catch (e) {
      return 'Repository Analysis';
    }
  };

  return (
    <div className="app-container">
      <motion.div 
        className="dashboard-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        
        {/* --- SCORE GAUGE SECTION --- */}
        <div className="score-header-container">
          <h2>Analysis Complete</h2>
          <p className="repo-name-display">{getRepoName(url)}</p>
          
          <div className="score-gauge-wrapper">
            <svg className="score-svg" width="200" height="200" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="85" fill="none" stroke="#1e293b" strokeWidth="12" />
              <circle 
                className="progress-circle"
                cx="100" cy="100" r="85" 
                fill="none" 
                stroke="url(#scoreGradient)" 
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="534" 
                strokeDashoffset={534 - (534 * data.evaluation_summary.score) / 100}
              />
            </svg>
            <div className="score-center-text">
              <span className="big-score">{data.evaluation_summary.score}</span>
              <span className="total-score">/100</span>
            </div>
          </div>
          <div className="verdict-badge">{data.evaluation_summary.verdict}</div>
        </div>

        {/* --- METRICS & DETAILS --- */}
        <div className="top-grid">
          <div className="card metrics-card">
            <div className="card-header">
              <span className="icon-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg></span>
              <h3>Performance Metrics</h3>
            </div>
            <div className="metrics-list">
              {data.score_breakdown.map((item, i) => (
                <div key={i} className="metric-item">
                  <div className="metric-info">
                    <span>{item.area}</span>
                    <span className="metric-value">{Math.round((item.score / item.max) * 100)}%</span>
                  </div>
                  <div className="progress-bg">
                    <div className={`progress-fill color-${i % 4}`} style={{ width: `${(item.score / item.max) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card details-card">
            <div className="card-header">
              <span className="icon-box"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
              <h3>Repository Details</h3>
            </div>
            <div className="details-list">
              <div className="detail-row"><span className="label">Primary Stack</span><div className="tags">{data.evaluation_summary.primary_stack.split(',').slice(0, 2).map((tech, i) => (<span key={i} className="tech-badge">{tech.trim()}</span>))}</div></div>
              <div className="detail-row"><span className="label">Total Files</span><span className="value">{data.insights.total_files}</span></div>
              <div className="detail-row"><span className="label">README</span><span className={`value status-${data.insights.readme_quality.includes('Minimal') ? 'bad' : 'good'}`}>{data.insights.readme_quality}</span></div>
              <div className="detail-row"><span className="label">Tests</span><span className="value">{data.insights.test_files}</span></div>
              <div className="detail-row"><span className="label">Commits</span><span className="value">{data.insights.commit_activity}</span></div>
            </div>
          </div>
        </div>

        {/* --- CRITICAL ISSUES & ROADMAP --- */}
        <div className="full-width-grid">
          {data.critical_issues.length > 0 && (
            <div className="card critical-card">
              <div className="card-header">
                <span className="icon-box error-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
                <h3>Critical Issues Found</h3>
              </div>
              <div className="issues-grid">
                {data.critical_issues.map((issue, i) => (
                  <div key={i} className="issue-box">
                    <h4>{issue.title}</h4>
                    <p>{issue.impact}</p>
                    <div className="fix-box">💡 <strong>Fix:</strong> {issue.recommendation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card roadmap-card">
            <div className="card-header">
              <span className="icon-box success-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>
              <h3>Personal Roadmap</h3>
            </div>
            <div className="roadmap-steps">
              {data.roadmap.map((step, i) => (
                <div key={i} className="step-item">
                  <div className="step-number">{i + 1}</div>
                  <div className="step-content">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- BACK BUTTON --- */}
        <div className="action-footer">
          <button className="reset-btn" onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            Analyze Another Repository
          </button>
        </div>

      </motion.div>
    </div>
  );
}

export default Report;