import React, { useState } from 'react';
import './Dashboard.css';
import logoImg from './assets/logo.png';
import DashboardUI from './DashboardUI';

// --- Page Components ---

const MyReportsView = () => (
  <>
    <section className="dashboard-hero-section animate-fade-in">
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
  </>
);

const ImpactScoreView = () => (
  <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
    <h2 className="section-title">Your Impact Score</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
      <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '50%', background: 'conic-gradient(var(--color-primary) 70%, var(--border-medium) 0)', display: 'grid', placeItems: 'center' }}>
          <div style={{ position: 'absolute', inset: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>150</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase' }}>Points</span>
          </div>
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>Civic Hero</div>
          <div style={{ color: 'var(--text-faint)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Top 15% of contributors this month</div>
        </div>
      </div>
      
      <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { action: 'Reported Pothole in Sector 4', points: '+15', time: '2 hours ago', color: 'var(--color-primary)' },
            { action: 'Verified Broken Streetlight', points: '+5', time: 'Yesterday', color: '#10b981' },
            { action: 'Reported Water Leak', points: '+20', time: '3 days ago', color: 'var(--color-primary)' },
            { action: 'Community Upvote on Report', points: '+2', time: '1 week ago', color: '#f97316' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div>
                <div style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem' }}>{item.action}</div>
                <div style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{item.time}</div>
              </div>
              <div style={{ color: item.color, fontWeight: 'bold', backgroundColor: `${item.color}20`, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem' }}>
                {item.points}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const LeaderboardView = () => (
  <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
    <h2 className="section-title">Community Leaderboard</h2>
    <div className="dashboard-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-medium)', paddingBottom: '1rem', marginBottom: '1rem', color: 'var(--text-faint)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <div style={{ width: '60px', textAlign: 'center' }}>Rank</div>
        <div style={{ flex: 1 }}>Contributor</div>
        <div style={{ width: '150px', textAlign: 'center' }}>Verified Reports</div>
        <div style={{ width: '100px', textAlign: 'right' }}>Score</div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[
          { rank: 1, name: 'Anjali Sharma', reports: 142, score: 3250, badge: '🥇' },
          { rank: 2, name: 'Rahul Desai', reports: 128, score: 2900, badge: '🥈' },
          { rank: 3, name: 'Priya Patel', reports: 115, score: 2640, badge: '🥉' },
          { rank: 4, name: 'Vikram Singh', reports: 98, score: 2100, badge: '' },
          { rank: 5, name: 'Souradeep (You)', reports: 8, score: 150, badge: '🌟', isYou: true },
        ].map((user, i) => (
          <div key={i} style={{ 
            display: 'flex', alignItems: 'center', padding: '1rem', 
            backgroundColor: user.isYou ? 'rgba(59,130,246,0.1)' : 'var(--glass-bg)', 
            borderRadius: '12px', border: user.isYou ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
            transition: 'background-color 0.2s', cursor: 'pointer'
          }}>
            <div style={{ width: '60px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: user.rank <= 3 ? 'var(--text-main)' : 'var(--text-faint)' }}>
              {user.badge || `#${user.rank}`}
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: `hsl(${i * 60 + 200}, 70%, 30%)`, display: 'grid', placeItems: 'center', fontWeight: 'bold', color: '#fff' }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ fontWeight: 500, color: user.isYou ? '#60a5fa' : 'var(--text-main)' }}>{user.name}</div>
            </div>
            <div style={{ width: '150px', textAlign: 'center', color: 'var(--text-muted)' }}>{user.reports}</div>
            <div style={{ width: '100px', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-primary)' }}>{user.score}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AnalyticsView = () => (
  <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
    <h2 className="section-title">Platform Analytics</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
      <div className="dashboard-card" style={{ padding: '1.5rem' }}>
        <div style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Total Issues Reported</div>
        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>14,239</div>
        <div style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          +12% this week
        </div>
      </div>
      <div className="dashboard-card" style={{ padding: '1.5rem' }}>
        <div style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Average Resolution Time</div>
        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>4.2 Days</div>
        <div style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          -1.5 days improved
        </div>
      </div>
      <div className="dashboard-card" style={{ padding: '1.5rem' }}>
        <div style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>AI Auto-Routing Accuracy</div>
        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>98.4%</div>
        <div style={{ color: '#60a5fa', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
          Consistently high
        </div>
      </div>
    </div>
    
    <div className="dashboard-card" style={{ padding: '2rem', height: '300px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ color: 'var(--text-main)', fontWeight: 500, marginBottom: '1rem' }}>Resolution Trends by Category</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '1rem', borderBottom: '1px solid var(--border-medium)', borderLeft: '1px solid var(--border-medium)', padding: '1rem 0 0 1rem' }}>
        {/* Mock Chart bars */}
        {[60, 80, 45, 90, 75, 50, 85].map((height, i) => (
          <div key={i} style={{ flex: 1, height: `${height}%`, backgroundColor: `hsl(220, 80%, ${30 + (i*5)}%)`, borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 0.5s ease' }}>
            <div style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', color: 'var(--text-faint)' }}>Day {i+1}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const IssueCategorizationView = () => (
  <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
    <h2 className="section-title">Issue Categorization</h2>
    <div className="dashboard-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>Recent Report Analysis</h3>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Report Description</div>
            <div style={{ fontSize: '1rem', lineHeight: '1.5', color: 'var(--text-main)' }}>"There is a massive sinkhole developing on MG Road near the metro station. Traffic is getting heavily backed up and it looks dangerous."</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>AI Extracted Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.3)' }}>
              <span style={{ color: '#60a5fa', fontWeight: 500 }}>Primary Category</span>
              <span style={{ color: 'var(--text-main)' }}>Road Infrastructure</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)' }}>
              <span style={{ color: '#fca5a5', fontWeight: 500 }}>Severity</span>
              <span style={{ color: 'var(--text-main)' }}>High (Hazard)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Keywords</span>
              <span style={{ color: 'var(--text-main)' }}>Sinkhole, Traffic, MG Road</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AutoRoutingView = () => (
  <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
    <h2 className="section-title">Auto-Routing Log</h2>
    <div className="dashboard-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[
          { issue: 'Broken Streetlight (ID: #4092)', dept: 'Electrical Department', status: 'Routed Successfully', time: '10 mins ago', color: '#10b981' },
          { issue: 'Water Pipe Burst (ID: #4091)', dept: 'Water Board (Jal Board)', status: 'Routed Successfully', time: '25 mins ago', color: '#10b981' },
          { issue: 'Illegal Dumping (ID: #4090)', dept: 'Sanitation Department', status: 'Pending Approval', time: '1 hour ago', color: '#f97316' },
          { issue: 'Pothole on Main St (ID: #4089)', dept: 'Public Works (PWD)', status: 'Routed Successfully', time: '2 hours ago', color: '#10b981' },
        ].map((log, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', backgroundColor: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--text-main)' }}>{log.issue}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="var(--text-muted)"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Assigned to: <strong style={{ color: 'var(--text-main)' }}>{log.dept}</strong></span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: log.color, fontSize: '0.85rem', fontWeight: 500, backgroundColor: `${log.color}15`, padding: '0.25rem 0.75rem', borderRadius: '999px', display: 'inline-block' }}>{log.status}</div>
              <div style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginTop: '0.5rem' }}>{log.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ImageAnalysisView = () => (
  <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
    <h2 className="section-title">Image Analysis Engine</h2>
    <div className="dashboard-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1.5, position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-medium)', height: '350px', backgroundColor: 'var(--bg-main)', display: 'grid', placeItems: 'center' }}>
          <div style={{ color: 'var(--text-faint)', fontSize: '0.85rem' }}>[Street Camera Image Mock]</div>
          {/* Simulated bounding box */}
          <div style={{ position: 'absolute', top: '40%', left: '30%', width: '120px', height: '80px', border: '2px solid #ef4444', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '4px' }}>
            <div style={{ position: 'absolute', top: '-24px', left: '-2px', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.2rem 0.5rem', borderRadius: '4px 4px 0 0' }}>
              Pothole 98%
            </div>
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>Detection Results</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(239,68,68,0.05)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#fca5a5', fontWeight: 500 }}>Pothole Detected</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>98.2%</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(239,68,68,0.2)', borderRadius: '2px' }}>
                <div style={{ width: '98.2%', height: '100%', backgroundColor: '#ef4444', borderRadius: '2px' }}></div>
              </div>
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Water Logging</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>12.4%</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-medium)', borderRadius: '2px' }}>
                <div style={{ width: '12.4%', height: '100%', backgroundColor: 'var(--border-hover)', borderRadius: '2px' }}></div>
              </div>
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Faded Markings</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>45.1%</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-medium)', borderRadius: '2px' }}>
                <div style={{ width: '45.1%', height: '100%', backgroundColor: 'var(--border-hover)', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


// --- Main Layout ---

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('my-reports');
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderSidebarLink = (id, label, icon) => (
    <div 
      className={`sidebar-link ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {icon}
      {label}
    </div>
  );

  return (
    <div className={`dashboard-layout ${theme === 'light' ? 'theme-light' : ''}`}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-main)' }}>
            <img src={logoImg} alt="Samadhan Logo" style={{ height: '32px', filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)' }} />
            Samadhan
          </a>
        </div>

        <div className="sidebar-nav-group">
          {renderSidebarLink('home', 'Home', 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          )}
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-nav-title">
            Build
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </div>
          {renderSidebarLink('my-reports', 'My Reports',
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          )}
          {renderSidebarLink('impact-score', 'Impact Score',
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          )}
          {renderSidebarLink('leaderboard', 'Leaderboard',
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          )}
          {renderSidebarLink('analytics', 'Analytics',
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          )}
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-nav-title">
            AI Platform
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </div>
          {renderSidebarLink('issue-categorization', 'Issue Categorization',
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h4l2-9 4 18 2-9h4"></path></svg>
          )}
          {renderSidebarLink('auto-routing', 'Auto-Routing',
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
          )}
          {renderSidebarLink('image-analysis', 'Image Analysis',
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          )}
        </div>

        <div className="sidebar-bottom">
          {/* User Profile / Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '0.85rem', color: '#fff' }}>
                S
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>Souradeep</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Admin</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
                {theme === 'dark' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                )}
              </button>
              
              <a href="/" style={{ color: 'var(--text-faint)', cursor: 'pointer', display: 'flex' }} title="Sign Out">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </a>
            </div>
          </div>
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

        {/* Content Router */}
        {activeTab === 'home' && (
          <div className="animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
            <h2>Redirecting to Home...</h2>
            {setTimeout(() => { window.location.href = '/' }, 1000) && ''}
          </div>
        )}
        {activeTab === 'my-reports' && <MyReportsView />}
        {activeTab === 'impact-score' && <ImpactScoreView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        
        {activeTab === 'issue-categorization' && <IssueCategorizationView />}
        {activeTab === 'auto-routing' && <AutoRoutingView />}
        {activeTab === 'image-analysis' && <ImageAnalysisView />}

      </main>
    </div>
  );
}

export default Dashboard;
