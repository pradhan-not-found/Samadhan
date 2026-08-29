import React, { useState } from "react";
import "./Dashboard.css";
import logoImg from "./assets/logo.png";

export default function DashboardUI() {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock Citizen Data
  const mockUser = {
    name: "Venkatesh D.",
    initials: "VD",
    color: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    impactScore: 1250,
    rank: 42,
    email: "venkatesh.d@samadhan.com"
  };

  const mockReports = [
    {
      id: "REP-9021",
      title: "Broken Streetlight on 4th Cross",
      category: "Electrical",
      status: "resolved",
      date: "2 days ago",
      color: "#f59e0b",
      bg: "#fef3c715",
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
      image: "/report/brokenlamp.png"
    },
    {
      id: "REP-9088",
      title: "Large pothole blocking traffic",
      category: "Infrastructure",
      status: "in_progress",
      date: "5 hours ago",
      color: "#6366f1",
      bg: "#6366f115",
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m10.82 2.89 8.65 15.11a2 2 0 0 1-1.74 3H6.27a2 2 0 0 1-1.74-3l8.65-15.11a1.95 1.95 0 0 1 3.44 0Z"/><path d="M9 10h6"/><path d="M7 14h10"/></svg>,
      image: "/report/pothhole.png"
    },
    {
      id: "REP-9102",
      title: "Garbage pile uncollected for days",
      category: "Sanitation",
      status: "pending",
      date: "Just now",
      color: "#10b981",
      bg: "#10b98115",
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Garbage_dumping_near_a_street.jpg/640px-Garbage_dumping_near_a_street.jpg"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'pending': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'resolved': return 'Resolved';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending Review';
      default: return 'Unknown';
    }
  };

  const getCategoryIcon = (cat, color) => {
    switch (cat) {
      case 'Electrical': return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
      case 'Infrastructure': return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.82 2.89 8.65 15.11a2 2 0 0 1-1.74 3H6.27a2 2 0 0 1-1.74-3l8.65-15.11a1.95 1.95 0 0 1 3.44 0Z"/><path d="M9 10h6"/><path d="M7 14h10"/></svg>;
      case 'Sanitation': return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
      default: return null;
    }
  };

  const renderSidebarLink = (id, label, icon) => (
    <div
      className={`sidebar-link ${activeTab === id ? "active" : ""}`}
      onClick={() => {
        setActiveTab(id);
        setMobileMenuOpen(false);
      }}
    >
      {icon}
      {label}
    </div>
  );

  const renderHomeContent = () => (
    <div className="dashboard-content-scroll" style={{ padding: "2rem", overflowY: "auto", flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'nowrap', gap: '1rem' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: '#111', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Welcome back, {mockUser.name.split(' ')[0]}!</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontSize: 'clamp(0.85rem, 2vw, 1rem)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Here's the impact you're making in your community.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexShrink: 0 }}>
            <button className="btn-hero-dark" style={{
              backgroundColor: '#1e293b',
              color: 'white',
              padding: '0.8rem 1.8rem',
              borderRadius: '12px',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New Report
            </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#6366f115', display: 'grid', placeItems: 'center', fontSize: '1.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#6366f1', lineHeight: 1 }}>{mockUser.impactScore}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Impact Score</div>
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#10b98115', display: 'grid', placeItems: 'center', fontSize: '1.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981', lineHeight: 1 }}>{mockReports.filter(r => r.status === 'resolved').length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Issues Resolved</div>
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f59e0b15', display: 'grid', placeItems: 'center', fontSize: '1.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b', lineHeight: 1 }}>#{mockUser.rank}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>City Rank</div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--border-medium)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#111' }}>Recent Activity</h3>
          <span style={{ fontSize: '0.85rem', color: '#6366f1', cursor: 'pointer', fontWeight: 500 }} onClick={() => setActiveTab("my-reports")}>View All</span>
        </div>
        <div>
          {mockReports.slice(0,2).map(report => (
            <div key={report.id} style={{ display: 'flex', gap: '1rem', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                backgroundImage: report.image ? `url(${report.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: report.image ? 'transparent' : report.bg,
                border: `1.5px solid ${report.color}30`,
                position: 'relative',
                flexShrink: 0,
                display: report.image ? 'block' : 'grid',
                placeItems: report.image ? 'unset' : 'center'
              }}>
                {report.image ? (
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '-6px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    padding: '4px',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                     {React.cloneElement(report.icon, { width: 14, height: 14 })}
                  </div>
                ) : (
                  report.icon
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#111' }}>{report.title}</h4>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '20px', 
                    backgroundColor: getStatusColor(report.status) + '15', 
                    color: getStatusColor(report.status),
                    fontWeight: 600
                  }}>
                    {getStatusLabel(report.status)}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span>{report.id}</span>
                  <span>•</span>
                  <span style={{display:'flex', alignItems:'center', gap:'0.25rem'}}>{getCategoryIcon(report.category, 'var(--text-muted)')} {report.category}</span>
                  <span>•</span>
                  <span>{report.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMyReports = () => (
    <div className="dashboard-content-scroll" style={{ padding: "2rem", overflowY: "auto", flex: 1 }}>
      <h1 style={{ fontSize: '1.8rem', color: '#111', fontWeight: 600, margin: '0 0 1.5rem 0' }}>My Reports</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {mockReports.map(report => (
          <div key={report.id} style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-medium)', borderRadius: '16px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${report.bg}, ${report.color}15)`,
              border: `1.5px solid ${report.color}30`,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              boxShadow: `0 4px 16px ${report.color}25`
            }}>
              {report.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{report.id} • {report.date}</span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '20px', 
                  backgroundColor: getStatusColor(report.status) + '15', 
                  color: getStatusColor(report.status),
                  fontWeight: 600
                }}>
                  {getStatusLabel(report.status)}
                </span>
              </div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#111' }}>{report.title}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{display:'flex', alignItems:'center', gap:'0.25rem'}}>{getCategoryIcon(report.category, 'var(--text-muted)')} {report.category}</span>
              </div>
            </div>
            <div style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--border-light)' }}>
              <button style={{ backgroundColor: 'transparent', border: '1px solid var(--border-medium)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, color: '#111' }}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrackReport = () => (
    <div className="dashboard-content-scroll" style={{ padding: "2rem", overflowY: "auto", flex: 1 }}>
      <h1 style={{ fontSize: '1.8rem', color: '#111', fontWeight: 600, margin: '0 0 1.5rem 0' }}>Track Report</h1>
      <div style={{ backgroundColor: 'var(--glass-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-medium)', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" style={{ marginBottom: '1rem' }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <h3 style={{ fontSize: '1.25rem', color: '#111', margin: '0 0 0.5rem 0' }}>Track an ongoing issue</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Enter a report ID to see its current status and resolution timeline.</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
          <input type="text" placeholder="e.g. REP-9021" style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', outline: 'none' }} />
          <button style={{ background: '#111', color: '#fff', border: 'none', padding: '0 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Track</button>
        </div>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="dashboard-content-scroll" style={{ padding: "2rem", overflowY: "auto", flex: 1 }}>
      <h1 style={{ fontSize: '1.8rem', color: '#111', fontWeight: 600, margin: '0 0 1.5rem 0' }}>City Leaderboard</h1>
      <div style={{ backgroundColor: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--border-medium)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: '60px 1fr 100px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <div>RANK</div>
          <div>CITIZEN</div>
          <div style={{ textAlign: 'right' }}>SCORE</div>
        </div>
        {[
          { rank: 1, name: "Aarav K.",     score: 4500, initials: "AK", color: "linear-gradient(135deg, #f59e0b, #ef4444)" },
          { rank: 2, name: "Neha S.",      score: 4120, initials: "NS", color: "linear-gradient(135deg, #ec4899, #8b5cf6)" },
          { rank: 3, name: "Rahul M.",     score: 3890, initials: "RM", color: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
          { rank: 42, name: "Venkatesh D.", score: 1250, initials: "VD", color: "linear-gradient(135deg, #6366f1, #8b5cf6)" }
        ].map((user, i) => (
          <div key={user.rank} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: '60px 1fr 100px', alignItems: 'center', backgroundColor: user.name.includes("Venkatesh") ? '#6366f108' : 'transparent' }}>
            <div style={{ fontWeight: 700, color: user.rank <= 3 ? '#f59e0b' : '#111', fontSize: '1.1rem' }}>
              #{user.rank}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '2px solid rgba(255,255,255,0.6)' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{user.initials}</span>
              </div>
              <div style={{ fontWeight: 600, color: '#111' }}>{user.name} {user.name.includes("Venkatesh") && "(You)"}</div>
            </div>
            <div style={{ textAlign: 'right', fontWeight: 700, color: '#6366f1' }}>{user.score}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMyProfile = () => (
    <div className="dashboard-content-scroll" style={{ padding: "2rem", overflowY: "auto", flex: 1 }}>
      <h1 style={{ fontSize: '1.8rem', color: '#111', fontWeight: 600, margin: '0 0 1.5rem 0' }}>My Profile</h1>
      <div style={{ backgroundColor: 'var(--glass-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-medium)', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: mockUser.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 24px rgba(99,102,241,0.35)', border: '4px solid white' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{mockUser.initials}</span>
        </div>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#111', margin: '0 0 0.25rem 0' }}>{mockUser.name}</h2>
          <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span>{mockUser.email}</span>
            <span>{mockUser.phone}</span>
          </div>
          <button style={{ marginTop: '1rem', border: '1px solid var(--border-medium)', background: 'transparent', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Edit Profile</button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="dashboard-layout theme-light"
      style={{
        height: "700px",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid var(--border-medium)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-header"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${mobileMenuOpen ? "open" : ""}`}
        style={{
          position: "absolute",
          height: "100%",
          zIndex: 50,
          transition: "transform 0.3s ease",
          transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="sidebar-header">
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-main)' }}>
            <img src={logoImg} alt="Samadhan Logo" style={{ height: '32px', filter: 'brightness(0)' }} />
            Samadhan
          </a>
          <button 
            className="mobile-header" 
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)', marginLeft: 'auto' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="sidebar-nav-group">
          {renderSidebarLink('home', 'Home', 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          )}
        </div>

        <div className="sidebar-nav-group">
          <div className="sidebar-nav-title">
            Citizen Tools
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </div>
          {renderSidebarLink('my-reports', 'My Reports',
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          )}
          {renderSidebarLink('track-report', 'Track Report',
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="2"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="2" y1="12" x2="4" y2="12"></line></svg>
          )}
          {renderSidebarLink('impact-score', 'Impact Score',
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          )}
          {renderSidebarLink('leaderboard', 'Leaderboard',
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          )}
          {renderSidebarLink('my-profile', 'My Profile',
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          )}
        </div>
        
        <div className="sidebar-bottom">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div onClick={() => setActiveTab('my-profile')} style={{ cursor: 'pointer' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(99,102,241,0.3)', display: 'grid', placeItems: 'center', background: mockUser.color
                }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{mockUser.initials}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>{mockUser.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Citizen Account</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className="dashboard-main"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          backgroundColor: "var(--bg-main)",
          marginLeft: window.innerWidth > 768 ? "260px" : "0",
          height: "100%",
          width: window.innerWidth > 768 ? "calc(100% - 260px)" : "100%",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1rem 2rem', 
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="mobile-header"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', padding: '0.5rem' }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2 className="desktop-only" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111', margin: 0, textTransform: 'capitalize' }}>
              {activeTab.replace('-', ' ')}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: '280px' }} className="desktop-only">
              <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search reports..." style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.8rem', borderRadius: '100px', border: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-main)', fontSize: '0.9rem', outline: 'none' }} />
            </div>
            
            <div style={{ height: '28px', width: '1px', backgroundColor: 'var(--border-light)', margin: '0 0.25rem' }} className="desktop-only"></div>

            <button style={{ background: 'none', border: 'none', position: 'relative', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: mockUser.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(99,102,241,0.3)', border: '2px solid rgba(255,255,255,0.5)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{mockUser.initials}</span>
              </div>
              <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111', lineHeight: 1.2 }}>{mockUser.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Citizen</span>
              </div>
            </div>
          </div>
        </header>

        {activeTab === "home" && renderHomeContent()}
        {activeTab === "my-reports" && renderMyReports()}
        {activeTab === "track-report" && renderTrackReport()}
        {activeTab === "impact-score" && renderHomeContent()} {/* Impact score is exactly what home shows */}
        {activeTab === "leaderboard" && renderLeaderboard()}
        {activeTab === "my-profile" && renderMyProfile()}
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .mobile-only { display: none; }
        @media (min-width: 769px) {
          .dashboard-sidebar {
            transform: translateX(0) !important;
          }
          .mobile-header {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: block !important;
          }
          .dashboard-main {
            width: 100% !important;
            margin-left: 0 !important;
          }
        }
        .dashboard-content-scroll::-webkit-scrollbar {
          display: none;
        }
        .dashboard-content-scroll {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}} />
    </div>
  );
}
