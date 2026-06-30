import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Samadhan
        </div>

        <div className="sidebar-nav-group">
          <a href="#" className="sidebar-link active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Home
          </a>
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-nav-title">
            Build
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </div>
          <a href="#" className="sidebar-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            My Reports
          </a>
          <a href="#" className="sidebar-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            Impact Score
          </a>
          <a href="#" className="sidebar-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            Leaderboard
          </a>
          <a href="#" className="sidebar-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Analytics
          </a>
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-nav-title">
            AI Platform
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </div>
          <a href="#" className="sidebar-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h4l2-9 4 18 2-9h4"></path></svg>
            Issue Categorization
          </a>
          <a href="#" className="sidebar-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
            Auto-Routing
          </a>
          <a href="#" className="sidebar-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            Image Analysis
          </a>
        </div>

        <div className="sidebar-bottom">
          <a href="#" className="sidebar-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            System Status
          </a>
          <a href="#" className="sidebar-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            Documentation
          </a>
        </div>
      </aside>

      {/* Main Area */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-welcome">Welcome back, Souradeep</div>
          <div className="credits-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            150 Impact Points
          </div>
        </header>

        {/* Hero Section */}
        <section className="dashboard-hero-section">
          <div className="hero-left">
            <div className="hero-icon"></div>
            <h1 className="hero-title">Start building with Samadhan</h1>
            <p className="hero-subtitle">
              One platform for community reporting, AI categorization, and transparent tracking.
            </p>
            <div className="hero-actions">
              <button className="btn-primary-dark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Report Issue
              </button>
              <button className="btn-secondary-light">
                Documentation 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </button>
            </div>
          </div>

          <div className="quickstart-card">
            <div className="quickstart-tabs">
              <div className="quickstart-tab active">Quickstart</div>
              <div className="quickstart-tab">Report Issue</div>
              <div className="quickstart-tab">Track Status</div>
              <div className="quickstart-tab">AI Insights</div>
            </div>
            
            <div className="quickstart-content">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-details">
                  <div className="step-title">Create Profile</div>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-details">
                  <div className="step-title">Install App</div>
                  
                  <div className="code-block-wrapper">
                    <div className="code-lang">Android</div>
                    <div className="code-block">
                      <span>$ download samadhan-apk</span>
                      <svg className="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </div>
                  </div>
                  
                  <div className="code-block-wrapper">
                    <div className="code-lang">iOS</div>
                    <div className="code-block">
                      <span>$ download samadhan-ios</span>
                      <svg className="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="step-item" style={{ marginBottom: 0 }}>
                <div className="step-number">3</div>
                <div className="step-details">
                  <div className="step-title">Start Reporting</div>
                  <div className="code-lang">Make your first report using the mobile app or web portal.</div>
                </div>
              </div>
            </div>
            
            <div className="quickstart-footer">
              Use with 
              <span className="use-with-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                Web
              </span>
              <span className="use-with-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                Mobile
              </span>
            </div>
          </div>
        </section>

        {/* Explore Section */}
        <section className="explore-section">
          <h2 className="section-title">Explore</h2>
          <div className="explore-grid">
            
            <div className="explore-card">
              <svg className="explore-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              <svg className="explore-card-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              <div className="explore-card-title">Analytics</div>
              <div className="explore-card-desc">Browse issue trends and resolution times with deep AI analytics across all regions.</div>
            </div>
            
            <div className="explore-card">
              <svg className="explore-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              <svg className="explore-card-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              <div className="explore-card-title">Leaderboard</div>
              <div className="explore-card-desc">Complete reference for top community contributors, verified reports, and civic points.</div>
            </div>
            
            <div className="explore-card">
              <svg className="explore-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              <svg className="explore-card-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              <div className="explore-card-title">Integrations</div>
              <div className="explore-card-desc">Connect Samadhan APIs with municipal portals and your favourite developer tools.</div>
            </div>
            
            <div className="explore-card">
              <svg className="explore-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              <svg className="explore-card-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              <div className="explore-card-title">AI Agents</div>
              <div className="explore-card-desc">Step-by-step cookbooks to build automated issue routing agents for Indian languages.</div>
            </div>
            
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
