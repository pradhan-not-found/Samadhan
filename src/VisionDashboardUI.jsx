import React, { useState } from 'react';
import './DashboardUI.css';
import logoImg from './assets/logo.png';
import { 
  FileText, 
  ChevronDown, 
  Send, 
  CheckCircle, 
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function VisionDashboardUI() {
  const [activeTab, setActiveTab] = useState('public-reports');

  return (
    <div className="dashboard-container dark-dashboard">
      {/* Top Header / Logo */}
      <div className="dash-main-header" style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
        <img src={logoImg} alt="Samadhan" className="nav-logo themed-logo" style={{ marginRight: '10px' }} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Samadhan Vision</span>
      </div>

      {/* Top Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`dash-tab ${activeTab === 'public-reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('public-reports')}
        >
          <FileText className="tab-icon" size={16} />
          Public Reports
        </button>
        <button 
          className={`dash-tab ${activeTab === 'authority-actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('authority-actions')}
        >
          <ShieldCheck className="tab-icon" size={16} />
          Authority Actions
        </button>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {activeTab === 'public-reports' ? (
          <>
            {/* Left Column */}
            <div className="dash-left">
              <div className="dash-text-large">
                Every citizen's report is transparently tracked. When a public issue is submitted, the community can monitor the municipal corporation's response and resolution time in real-time.
              </div>
              
              <div className="dash-left-bottom">
                <div className="dash-stats">
                  <span>Resolution Rate: 92%</span>
                  <span>Avg. Time: 48 Hrs</span>
                </div>
                <div className="dash-action-row">
                  <div className="dash-dropdown">
                    Filter by Region
                    <ChevronDown size={12} />
                  </div>
                  <button className="dash-play-btn">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="dash-right">
              <div className="dash-right-header">
                <h3>Live Action Stream</h3>
                <button className="view-all-btn">Live</button>
              </div>
              
              <div className="dash-list">
                <div className="dash-list-item active">
                  <div className="item-play green">
                    <CheckCircle size={14} />
                  </div>
                  <div className="item-info">
                    <div className="item-title">
                      Pothole Fixed <span className="tag green">Resolved</span>
                    </div>
                    <div className="item-subtitle">PWD • Sector 4 • 2 mins ago</div>
                  </div>
                </div>

                <div className="dash-list-item">
                  <div className="item-play orange">
                    <Clock size={14} />
                  </div>
                  <div className="item-info">
                    <div className="item-title">
                      Garbage Clearance <span className="tag orange">In Progress</span>
                    </div>
                    <div className="item-subtitle">Sanitation • Market • 1 hr ago</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Left Column for Authority Actions */}
            <div className="dash-left">
              <div className="dash-text-large">
                Municipal corporations are empowered with AI-driven insights to prioritize and resolve critical infrastructural problems efficiently, building a more accountable governance system.
              </div>
              
              <div className="dash-left-bottom">
                <div className="dash-stats">
                  <span>Action Rate: 88%</span>
                  <span>Resources: Optimized</span>
                </div>
                <div className="dash-action-row">
                  <div className="dash-dropdown">
                    Department View
                    <ChevronDown size={12} />
                  </div>
                  <button className="dash-play-btn" style={{ backgroundColor: '#4F46E5', color: '#fff' }}>
                    <TrendingUp size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column for Authority Actions */}
            <div className="dash-right">
              <div className="dash-right-header">
                <h3>Recent Dispatches</h3>
                <button className="view-all-btn">Active</button>
              </div>
              
              <div className="dash-list">
                <div className="dash-list-item active">
                  <div className="item-play blue">
                    <Zap size={14} />
                  </div>
                  <div className="item-info">
                    <div className="item-title">
                      Team Dispatched <span className="tag blue">Actioned</span>
                    </div>
                    <div className="item-subtitle">Water Supply • Zone 3 • 15 mins ago</div>
                  </div>
                </div>

                <div className="dash-list-item">
                  <div className="item-play red">
                    <AlertTriangle size={14} />
                  </div>
                  <div className="item-info">
                    <div className="item-title">
                      Emergency Repair <span className="tag red">High Priority</span>
                    </div>
                    <div className="item-subtitle">Traffic Dept • Main Highway • 45 mins ago</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
