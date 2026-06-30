import React, { useState } from 'react';
import './DashboardUI.css';

export default function DashboardUI() {
  const [activeTab, setActiveTab] = useState('categorization');

  return (
    <div className="dashboard-container">
      {/* Top Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`dash-tab ${activeTab === 'reporting' ? 'active' : ''}`}
          onClick={() => setActiveTab('reporting')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          Image & Video Reporting
        </button>
        <button 
          className={`dash-tab ${activeTab === 'categorization' ? 'active' : ''}`}
          onClick={() => setActiveTab('categorization')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10.25c.414 0 .75.336.75.75 0 4 3.246 7.25 7.25 7.25 4 0 7.25-3.246 7.25-7.25 0-.414.336-.75.75-.75s.75.336.75.75c0 4.58-3.518 8.338-8 8.718V22a.75.75 0 0 1-1.5 0v-2.282c-4.482-.38-8-4.138-8-8.718 0-.414.336-.75.75-.75z"/></svg>
          AI Categorization
        </button>
        <button 
          className={`dash-tab ${activeTab === 'geolocation' ? 'active' : ''}`}
          onClick={() => setActiveTab('geolocation')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Geo-location
        </button>
        <button 
          className={`dash-tab ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Community Verification
        </button>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        
        {/* Left Column */}
        <div className="dash-left">
          <div className="dash-text-large">
            Samadhan uses advanced AI to automatically tag, categorize, and route incoming reports. 
            A simple photo of a pothole is analyzed, tagged as "Infrastructure - Road Repair", assigned High Severity, and routed to the correct municipal department instantly.
          </div>
          
          <div className="dash-left-bottom">
            <div className="dash-stats">
              <span>Confidence Score: 98%</span>
              <span>Routing: PWD Dept</span>
            </div>
            <div className="dash-action-row">
              <div className="dash-dropdown">
                Auto-Assign
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>
              <button className="dash-play-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dash-right">
          <div className="dash-right-header">
            <h3>Recent Categorizations</h3>
            <button className="view-all-btn">View all</button>
          </div>
          
          <div className="dash-list">
            <div className="dash-list-item active">
              <div className="item-play">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 12 3a4.65 4.65 0 0 0-4.5 4.5c0 1.95 1.5 3.5 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>
              </div>
              <div className="item-info">
                <div className="item-title">
                  Broken Streetlight <span className="tag blue">Medium</span>
                </div>
                <div className="item-subtitle">Electrical • Sector 4</div>
              </div>
            </div>

            <div className="dash-list-item">
              <div className="item-play green">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              </div>
              <div className="item-info">
                <div className="item-title">
                  Water Pipe Leak <span className="tag red">High</span>
                </div>
                <div className="item-subtitle">Water Board • Main Rd</div>
              </div>
            </div>

            <div className="dash-list-item">
              <div className="item-play orange">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </div>
              <div className="item-info">
                <div className="item-title">
                  Garbage Dump <span className="tag pink">Low</span>
                </div>
                <div className="item-subtitle">Sanitation • Market Area</div>
              </div>
            </div>
          </div>

          <div className="dash-cta">
            <span>Want to use this API?</span>
            <button className="btn-dark">Get API Keys</button>
          </div>
        </div>

      </div>
    </div>
  );
}
