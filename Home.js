import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', { url });
      navigate('/report', { state: { data: response.data, url: url } });
    } catch (err) {
      setError('Analysis failed. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container home-centered">
      
      {/* --- HERO SECTION --- */}
      <header className="hero-section">
        {/* Changed Text, Removed Emoji/Logo */}
        <div className="badge-pill">Repository Analyzer</div>
        
        <h1>
          Turn Your Code Into <br />
          <span className="text-gradient">Actionable Insights</span>
        </h1>
        <p className="hero-subtitle">
          Get an instant score, detailed analysis, and personalized roadmap to 
          improve your GitHub repositories like a pro.
        </p>

        <div className="input-wrapper">
          <div className="input-group">
            {/* Link Icon Removed Here */}
            <input 
              type="text" 
              placeholder="https://github.com/username/repository" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ paddingLeft: '20px' }} /* Added extra padding since icon is gone */
            />
            <button onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze →'}
            </button>
          </div>
        </div>
        {error && <p className="error-msg">{error}</p>}
      </header>

      {/* --- LOADING SPINNER --- */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Scanning Repository...</p>
        </div>
      )}

    </div>
  );
}

export default Home;