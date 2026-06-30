import React from 'react';
import './JoinNow.css';

export default function JoinNow() {
  return (
    <div className="join-now-container">
      <div className="join-now-card">
        <h2 className="join-now-title">
          Build the Future of India's AI<br />with Samadhan
        </h2>
        
        <div className="join-now-center">
          <svg className="join-now-star" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
        </div>

        <div className="join-now-grid-bg"></div>

        <div className="join-now-bottom">
          <a href="/login" className="join-now-btn" style={{ textDecoration: 'none' }}>Sign Up</a>
        </div>
      </div>
    </div>
  );
}
