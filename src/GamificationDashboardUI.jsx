import React, { useState } from 'react';
import './DashboardUI.css';
import logoImg from './assets/logo.png';

export default function GamificationDashboardUI() {
  const [activeTab, setActiveTab] = useState('leaderboard');

  return (
    <div className="dashboard-container">
      {/* Top Header / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--color-border-light)' }}>
        <img src={logoImg} alt="Samadhan" className="nav-logo themed-logo" style={{ marginRight: '10px' }} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Samadhan Gamification</span>
      </div>

      {/* Top Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`dash-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          Leaderboard
        </button>
        <button 
          className={`dash-tab ${activeTab === 'impact' ? 'active' : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          Impact Activity
        </button>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Left Column */}
        <div className="dash-left">
          <div className="dash-text-large">
            Community participation is rewarded. Through our integrated gamification engine, users earn reputation points, badges, and recognition for valid reports and successful verifications.
          </div>
          
          <div className="dash-left-bottom">
            <div className="dash-stats">
              <span>Your Points: 1,450</span>
              <span>Rank: Civic Guardian</span>
            </div>
            <div className="dash-action-row">
              <div className="dash-dropdown">
                View Rewards
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>
              <button className="dash-play-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dash-right">
          <div className="dash-right-header">
            <h3>Recent Achievements</h3>
            <button className="view-all-btn">Badges</button>
          </div>
          
          <div className="dash-list">
            <div className="dash-list-item active">
              <div className="item-play blue">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              </div>
              <div className="item-info">
                <div className="item-title">
                  Top Verifier <span className="tag blue">+500 pts</span>
                </div>
                <div className="item-subtitle">Verified 50 reports this month</div>
              </div>
            </div>

            <div className="dash-list-item">
              <div className="item-play pink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div className="item-info">
                <div className="item-title">
                  Quick Reporter <span className="tag pink">+200 pts</span>
                </div>
                <div className="item-subtitle">First to report water leak</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
