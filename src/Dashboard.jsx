import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Classic } from './Loading';
import './Dashboard.css';
import logoImg from './assets/logo.png';
import DashboardUI from './DashboardUI';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export const UserContext = React.createContext(null);

// --- Page Components ---

export const getAvatarStyle = (name) => {
  const colors = [
    '#3b82f6', // blue
    '#22c55e', // green
    '#ef4444', // red
    '#a855f7', // purple
    '#f59e0b', // amber
  ];
  let hash = 0;
  const str = name || 'User';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];
  return {
    background: `radial-gradient(ellipse at 50% 115%, ${color} 0%, #ffffff 70%)`,
    border: '3px solid #333'
  };
};

const MyReportsView = () => {
  const { userProfile } = React.useContext(UserContext) || { userProfile: {} };
  const state = userProfile?.state_region || 'West Bengal';
  const ward = userProfile?.ward || 'Sector 4';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportText, setReportText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [pastReports, setPastReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [manualCategory, setManualCategory] = useState('');
  const [manualPriority, setManualPriority] = useState('Low');
  const hasGemini = !!localStorage.getItem('samadhan_gemini_key');

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/reports`);
      const data = await res.json();
      setPastReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReports();
    const channel = supabase.channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
        fetchReports();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const imgRes = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/analyze-image`, {
        method: "POST",
        body: formData
      });
      const imgData = await imgRes.json();
      if (imgData.image_url) {
        setUploadedImageUrl(imgData.image_url);
      }
      let autoText = imgData.description || `[Photo Evidence: Pothole ${imgData.pothole}]`;
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const loc = `\n[Location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}]`;
          setReportText(autoText + loc);
        }, () => {
          setReportText(autoText + `\n[Location: 22.5726, 88.3639 (Default)]`);
        });
      } else {
        setReportText(autoText);
      }
    } catch (err) {
      console.error(err);
      setReportText("[Attached Photo Evidence]");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportText && !imageFile) return alert("Please enter a description or upload a photo");
    setIsSubmitting(true);
    try {

      const reqBody = { 
        text: reportText || "Photo Report", 
        ward, 
        state_region: state,
        image_url: uploadedImageUrl 
      };
      
      if (!hasGemini) {
        reqBody.category = manualCategory || 'Uncategorized';
        reqBody.priority = manualPriority || 'Low';
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody)
      });
      const data = await res.json();
      alert(`Issue reported successfully! Gemma categorized it as: ${data.category}`);
      setReportText('');
      setImageFile(null);
      setUploadedImageUrl(null);
      fetchReports();
    } catch (err) {
      console.error(err);
      alert("Failed to connect to Gemma backend. Please ensure it is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const myReports = pastReports.filter(r => r.ward === ward);
  const pendingCount = myReports.filter(r => r.status?.includes('Pending')).length;
  const routedCount = myReports.filter(r => r.status?.includes('Routed')).length;
  const resolvedCount = myReports.filter(r => r.status?.includes('Approved') || r.status?.includes('Resolved')).length;
  const getCategoryIcon = (cat, color = 'currentColor') => {
    const s = { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: '2' };
    if (!cat) return <svg {...s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    if (cat.includes('Road')) return <svg {...s}><path d="M3 17l2-8h14l2 8"/><path d="M5 17h14"/><line x1="12" y1="9" x2="12" y2="17"/></svg>;
    if (cat.includes('Water') || cat.includes('Sanitation')) return <svg {...s}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
    if (cat.includes('Electrical') || cat.includes('Street')) return <svg {...s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    if (cat.includes('Waste') || cat.includes('Garbage')) return <svg {...s}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
    if (cat.includes('Safety')) return <svg {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    if (cat.includes('Park') || cat.includes('Environ')) return <svg {...s}><path d="M17 8C8 10 5.9 16.17 3.82 22"/><path d="M9.1 17.4C11 14 14 9.9 22 4"/></svg>;
    return <svg {...s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
  };
  const getStatusCfg = (status) => { if (!status) return { color: '#64748b', bg: '#64748b15', label: 'Unknown' }; if (status.includes('Routed')) return { color: '#3b82f6', bg: '#3b82f615', label: 'Routed' }; if (status.includes('Approved') || status.includes('Resolved')) return { color: '#10b981', bg: '#10b98115', label: status.includes('Approved') ? 'Approved' : 'Resolved' }; if (status.includes('Pending')) return { color: '#f59e0b', bg: '#f59e0b15', label: 'Pending Triage' }; return { color: '#8b5cf6', bg: '#8b5cf615', label: status }; };
  const statCards = [
    { label: 'Total Submitted', value: myReports.length, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>, color: '#6366f1' },
    { label: 'Pending Triage', value: pendingCount, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, color: '#f59e0b' },
    { label: 'Auto-Routed', value: routedCount, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>, color: '#3b82f6' },
    { label: 'Resolved', value: resolvedCount, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, color: '#10b981' },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>My Reports</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>Track and manage your civic issue submissions</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {ward}, {state}
          </div>
          <button onClick={fetchReports} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border-medium)', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        </div>
      </div>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((s, i) => (
          <div key={i} className="dashboard-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: s.color + '18', display: 'grid', placeItems: 'center', fontSize: '1.35rem', flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, lineHeight: 1, fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem', alignItems: 'stretch' }}>
        {/* Form */}
        <div className="dashboard-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Issue Description</label>
                <button type="button" title="Fetch Location" onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setReportText(prev => prev + (prev ? '\n' : '') + `[Location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}]`);
                    }, () => {
                      setReportText(prev => prev + (prev ? '\n' : '') + `[Location: 22.5726, 88.3639 (Default)]`);
                    });
                  }
                }} style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-medium)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', padding: 0, transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#6366f115'; e.currentTarget.style.borderColor = '#6366f1'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--glass-bg)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </button>
              </div>
              <textarea placeholder="e.g. Large pothole on Main Street near the school..." value={reportText} onChange={(e) => setReportText(e.target.value)}
                style={{ width: '100%', height: '110px', padding: '0.9rem 1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '10px', border: '1px solid var(--border-medium)', color: 'var(--text-main)', resize: 'none', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'var(--border-medium)'} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Photo Evidence (Optional)</label>
              <label style={{ border: `2px dashed ${imageFile ? '#6366f1' : 'var(--border-medium)'}`, borderRadius: '10px', padding: '1.25rem', textAlign: 'center', backgroundColor: imageFile ? '#6366f108' : 'var(--glass-bg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                {imageFile ? (<><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><div style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 500 }}>{imageFile.name}</div></>) : (<><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-faint)' }}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Drop photo or click to upload</div></>)}
              </label>
            </div>
            
            {!hasGemini && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Category</label>
                  <select value={manualCategory} onChange={e => setManualCategory(e.target.value)} style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--glass-bg)', borderRadius: '10px', border: '1px solid var(--border-medium)', color: 'var(--text-main)', outline: 'none' }}>
                    <option value="">Select Category</option>
                    <option value="Roads/Potholes">Roads/Potholes</option>
                    <option value="Water/Leakage">Water/Leakage</option>
                    <option value="Electrical/Streetlight">Electrical/Streetlight</option>
                    <option value="Sanitation/Garbage">Sanitation/Garbage</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Priority</label>
                  <select value={manualPriority} onChange={e => setManualPriority(e.target.value)} style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--glass-bg)', borderRadius: '10px', border: '1px solid var(--border-medium)', color: 'var(--text-main)', outline: 'none' }}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            )}
            
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
              {hasGemini ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 4px 15px rgba(99,102,241,0.05)' }}>
                  <img src={logoImg} className="animate-spin" alt="AI Active" style={{ width: '22px', height: '22px', filter: 'drop-shadow(0 0 4px rgba(99,102,241,0.6))' }} />
                  <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 600, letterSpacing: '0.02em' }}>Samadhan AI is active & will auto-classify your report</span>
                </div>
              ) : null}
              <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '0.85rem', background: isSubmitting ? 'var(--border-medium)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: isSubmitting ? 'none' : '0 4px 15px #6366f140' }}>
                {isSubmitting ? (hasGemini ? 'Gemini is analyzing…' : 'Submitting...') : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
        {/* Feed */}
        <div className="dashboard-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.25rem' }}>My Submissions · {myReports.length} report{myReports.length !== 1 ? 's' : ''}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse" style={{ display: 'flex', gap: '0.9rem', padding: '1rem 1.1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '10px', backgroundColor: 'var(--border-medium)', flexShrink: 0 }}></div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
                    <div style={{ height: '14px', width: '80%', backgroundColor: 'var(--border-medium)', borderRadius: '4px' }}></div>
                    <div style={{ height: '10px', width: '40%', backgroundColor: 'var(--border-medium)', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))
            ) : myReports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg></div>
                <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>No reports yet</div>
                <div style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginTop: '0.35rem' }}>Submit your first issue using the form.</div>
              </div>
            ) : myReports.map((report, i) => {
              const sc = getStatusCfg(report.status);
              const icon = getCategoryIcon(report.category);
              return (
                <div key={i} style={{ display: 'flex', gap: '0.9rem', padding: '1rem 1.1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--border-light)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.backgroundColor = 'var(--hover-bg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.backgroundColor = 'var(--glass-bg)'; }}>
                  {report.image_url
                    ? <div style={{ width: '52px', height: '52px', borderRadius: '10px', backgroundImage: `url(${report.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border-medium)', flexShrink: 0 }} />
                    : <div style={{ width: '52px', height: '52px', borderRadius: '10px', backgroundColor: sc.color + '15', display: 'grid', placeItems: 'center', flexShrink: 0 }}>{getCategoryIcon(report.category, sc.color)}</div>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{report.text?.length > 60 ? report.text.slice(0, 60) + '…' : report.text}</div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: sc.color, backgroundColor: sc.bg, padding: '0.2rem 0.6rem', borderRadius: '999px', whiteSpace: 'nowrap', flexShrink: 0 }}>{sc.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{getCategoryIcon(report.category, 'var(--text-faint)')} {report.category || 'Uncategorized'}</span>
                      {report.priority && <span style={{ fontSize: '0.7rem', color: report.color || '#64748b', backgroundColor: (report.color || '#64748b') + '18', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 500 }}>{report.priority} Priority</span>}
                      {report.ticket_id && <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'monospace' }}>#{report.ticket_id}</span>}
                    </div>
                    {report.keywords && <div style={{ marginTop: '0.4rem', fontSize: '0.68rem', color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> {report.keywords}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ImpactScoreView = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = React.useContext(UserContext) || { userProfile: {} };
  const ward = userProfile?.ward || 'Sector 4';

  React.useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/reports`);
        const data = await res.json();
        setReports(data.filter(r => r.ward === ward));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [ward]);

  if (isLoading) {
    return (
      <div className="animate-fade-in" style={{ padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <Classic style={{ width: '2.5rem', height: '2.5rem', color: '#6366f1' }} />
        <div style={{ color: 'var(--text-muted)' }}>Calculating impact...</div>
      </div>
    );
  }

  const totalPoints = userProfile?.impact_score || 0;
  const percentage = Math.min(Math.round((totalPoints / 500) * 100), 100);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h2 className="section-title">Your Impact Score</h2>
      <div className="impact-grid">
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
          <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '50%', background: `conic-gradient(var(--color-primary) ${percentage}%, var(--border-medium) 0)`, display: 'grid', placeItems: 'center', transition: 'all 1s ease-out' }}>
            <div style={{ position: 'absolute', inset: '8px', backgroundColor: 'var(--bg-card)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>{totalPoints}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase' }}>Points</span>
            </div>
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>{totalPoints > 200 ? 'Civic Champion' : 'Civic Hero'}</div>
            <div style={{ color: 'var(--text-faint)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Top {totalPoints > 200 ? '5' : '15'}% of contributors this month</div>
          </div>
        </div>
        
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {reports.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem' }}>Reported {item.category}</div>
                  <div style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Just now</div>
                </div>
                <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', backgroundColor: `rgba(99, 102, 241, 0.1)`, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem' }}>
                  +15
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div>
                <div style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem' }}>Verified Broken Streetlight</div>
                <div style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Yesterday</div>
              </div>
              <div style={{ color: '#10b981', fontWeight: 'bold', backgroundColor: `#10b98120`, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem' }}>
                +5
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div>
                <div style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem' }}>Community Upvote on Report</div>
                <div style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginTop: '0.25rem' }}>1 week ago</div>
              </div>
              <div style={{ color: '#f97316', fontWeight: 'bold', backgroundColor: `#f9731620`, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem' }}>
                +2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MedalIcon = ({ rank }) => {
  if (rank === 1) return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" fill="#f59e0b" stroke="#d97706"/>
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">1</text>
    </svg>
  );
  if (rank === 2) return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" fill="#94a3b8" stroke="#64748b"/>
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">2</text>
    </svg>
  );
  if (rank === 3) return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" fill="#cd7c3e" stroke="#a16207"/>
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">3</text>
    </svg>
  );
  return null;
};

const StarIcon = ({ size = 14, color = '#f59e0b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
  </svg>
);

const LeaderboardView = () => {
  const state = localStorage.getItem('samadhan_state') || 'West Bengal';
  const ward  = localStorage.getItem('samadhan_ward')  || 'Sector 4';
  const userName = localStorage.getItem('samadhan_name') || 'You';

  const [leaders, setLeaders] = useState([]);
  const [liveMode, setLiveMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    supabase.from('profiles').select('full_name, impact_score, email, avatar_url').order('impact_score', { ascending: false }).limit(10)
      .then(({ data, error }) => {
        if (data && data.length > 0 && !error) {
          const myEmail = localStorage.getItem('samadhan_email');
          const mapped = data.map((d, i) => ({
            rank: i + 1,
            name: d.full_name || d.email.split('@')[0],
            reports: Math.floor((d.impact_score || 0) / 10),
            score: d.impact_score || 0,
            trend: 0,
            isYou: d.email === myEmail,
            avatar: d.avatar_url
          }));
          setLeaders(mapped);
          setLiveMode(true);
        }
        setIsLoading(false);
      });
  }, []);

  const podiumColors = ['#f59e0b', '#94a3b8', '#cd7c3e'];
  const avatarHues   = [200, 260, 320, 160, 230];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ color: '#f59e0b' }}><TrophyIcon /></span>
            Community Leaderboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>Top contributors in your ward this month</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {ward}, {state}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
          <Classic style={{ width: '2.5rem', height: '2.5rem', color: '#f59e0b' }} />
          <div style={{ color: 'var(--text-muted)' }}>Loading leaderboard...</div>
        </div>
      ) : leaders.length === 0 ? (
        <div className="dashboard-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-faint)', marginBottom: '1rem' }}>No leaders found yet. Be the first to earn impact points!</div>
        </div>
      ) : (
        <>
          {/* Podium Top-3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-end' }}>
            {[leaders[1], leaders[0], leaders[2]].map((user, idx) => {
              if (!user) return <div key={idx}></div>;
              const isCenter = idx === 1;
              const col = podiumColors[user.rank - 1];
          return (
            <div key={user.rank} className="dashboard-card" style={{ padding: '1.5rem 1rem', textAlign: 'center', border: `1px solid ${col}30`, background: isCenter ? `linear-gradient(160deg, ${col}12, transparent)` : undefined, transform: isCenter ? 'scale(1.03)' : undefined }}>
              <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: user.avatar ? 'transparent' : getAvatarStyle(user.name).background, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '1.2rem', color: '#fff', border: user.avatar ? `3px solid ${col}` : getAvatarStyle(user.name).border, boxShadow: user.avatar ? `0 0 0 3px ${col}30` : 'none', overflow: 'hidden' }}>
                  {user.avatar && <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}><MedalIcon rank={user.rank} /></div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{user.name}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: col, fontFamily: 'var(--font-display)' }}>{user.score.toLocaleString()}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '0.2rem' }}>{user.reports} reports</div>
            </div>
          );
        })}
      </div>

      {/* Full Table */}
      <div className="dashboard-card" style={{ padding: '1.5rem' }}>
        {/* Table header */}
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '0.75rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-light)', color: 'var(--text-faint)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <div style={{ width: '56px', textAlign: 'center' }}>Rank</div>
          <div style={{ flex: 1 }}>Contributor</div>
          <div style={{ width: '120px', textAlign: 'center' }}>Reports</div>
          <div style={{ width: '80px', textAlign: 'center' }}>Trend</div>
          <div style={{ width: '90px', textAlign: 'right' }}>Score</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {leaders.map((user, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', padding: '0.85rem 0',
              borderRadius: '10px',
              backgroundColor: user.isYou ? 'rgba(59,130,246,0.08)' : 'transparent',
              border: user.isYou ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
              paddingLeft: user.isYou ? '0.75rem' : '0',
              paddingRight: user.isYou ? '0.75rem' : '0',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => { if (!user.isYou) e.currentTarget.style.backgroundColor = 'var(--glass-bg)'; }}
            onMouseLeave={e => { if (!user.isYou) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {/* Rank */}
              <div style={{ width: '56px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                {user.rank <= 3
                  ? <MedalIcon rank={user.rank} />
                  : <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-faint)' }}>#{user.rank}</span>
                }
              </div>

              {/* Avatar + Name */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: user.avatar ? 'transparent' : getAvatarStyle(user.name).background, display: 'grid', placeItems: 'center', flexShrink: 0, overflow: 'hidden', border: user.avatar ? 'none' : getAvatarStyle(user.name).border }}>
                  {user.avatar && <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ fontWeight: 600, color: user.isYou ? '#60a5fa' : 'var(--text-main)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                  {user.isYou && (
                    <span style={{ marginLeft: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', backgroundColor: '#3b82f615', border: '1px solid #3b82f630', padding: '0.1rem 0.4rem', borderRadius: '999px', fontSize: '0.65rem', color: '#60a5fa', fontWeight: 600 }}>
                      <StarIcon size={10} color="#60a5fa" /> You
                    </span>
                  )}
                </div>
              </div>

              {/* Reports */}
              <div style={{ width: '120px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {user.reports}
              </div>

              {/* Trend */}
              <div style={{ width: '80px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', fontWeight: 600, color: user.trend >= 0 ? '#10b981' : '#ef4444' }}>
                {user.trend >= 0
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                }
                {Math.abs(user.trend)}
              </div>

              {/* Score */}
              <div style={{ width: '90px', textAlign: 'right', fontWeight: 700, color: user.rank <= 3 ? podiumColors[user.rank - 1] : 'var(--text-main)', fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>
                {user.score.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-faint)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Scores update weekly. Top 5% of contributors receive recognition badges.
        </div>
      </div>
      </>
      )}
    </div>
  );
};


const analyticsData = [
  { name: 'Mon', roads: 40, water: 24, electrical: 24 },
  { name: 'Tue', roads: 30, water: 13, electrical: 22 },
  { name: 'Wed', roads: 20, water: 98, electrical: 22 },
  { name: 'Thu', roads: 27, water: 39, electrical: 20 },
  { name: 'Fri', roads: 18, water: 48, electrical: 21 },
  { name: 'Sat', roads: 23, water: 38, electrical: 25 },
  { name: 'Sun', roads: 34, water: 43, electrical: 21 },
];

const categoryData = [
  { name: 'Potholes', count: 400 },
  { name: 'Water Leaks', count: 300 },
  { name: 'Streetlights', count: 300 },
  { name: 'Garbage', count: 200 },
];

const AnalyticsView = () => {
  const [stats, setStats] = useState({
    total_issues: 0,
    avg_resolution_days: 0,
    accuracy_pct: 98.4,
    category_data: [],
    analytics_data: []
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
  <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
    <h2 className="section-title">Platform Analytics</h2>
    <div className="analytics-grid">
      <div className="dashboard-card" style={{ padding: '1.5rem' }}>
        <div style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Total Issues Reported</div>
        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>{stats.total_issues.toLocaleString()}</div>
        <div style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          Live from Database
        </div>
      </div>
      <div className="dashboard-card" style={{ padding: '1.5rem' }}>
        <div style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Average Resolution Time</div>
        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>{stats.avg_resolution_days === 0 ? 'N/A' : `${stats.avg_resolution_days} Days`}</div>
        <div style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          Based on resolved tickets
        </div>
      </div>
      <div className="dashboard-card" style={{ padding: '1.5rem' }}>
        <div style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>AI Auto-Routing Accuracy</div>
        <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>{stats.accuracy_pct}%</div>
        <div style={{ color: '#60a5fa', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
          Consistently high
        </div>
      </div>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
      <div className="dashboard-card" style={{ padding: '2rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ color: 'var(--text-main)', fontWeight: 500, marginBottom: '1rem' }}>Issues Reported (Past Week)</div>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.analytics_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRoads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-faint)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-faint)" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '8px', color: 'var(--text-main)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="roads" name="Road Infrastructure" stroke="#f97316" fillOpacity={1} fill="url(#colorRoads)" />
              <Area type="monotone" dataKey="water" name="Water & Sanitation" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" />
              <Area type="monotone" dataKey="electrical" name="Electrical" stroke="#10b981" fillOpacity={1} fill="url(#colorElec)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="dashboard-card" style={{ padding: '2rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ color: 'var(--text-main)', fontWeight: 500, marginBottom: '1rem' }}>Top Categories</div>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.category_data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="var(--text-faint)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'var(--glass-bg)' }} contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
  );
};

const IncomingIssuesView = () => {
  const [reports, setReports] = useState([]);

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/reports`);
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h2 className="section-title">Incoming Triage Queue</h2>
      <div className="dashboard-card" style={{ padding: '2rem', overflowX: 'auto' }}>
        {reports.length === 0 ? (
          <div style={{ color: 'var(--text-faint)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No incoming issues right now.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Report Summary</th>
                <th>AI Category</th>
                <th>AI Priority</th>
                <th style={{ textAlign: 'right' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((ticket, i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td style={{ color: 'var(--text-muted)' }}>{ticket.ticket_id}</td>
                  <td style={{ fontWeight: 500 }}>
                    <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ticket.text}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-faint)' }}>{ticket.category}</td>
                  <td>
                    <span style={{ color: ticket.color || '#3b82f6', backgroundColor: `${ticket.color || '#3b82f6'}20`, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {ticket.priority || 'Medium'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--text-faint)', fontSize: '0.85rem' }}>
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};


const IssueCategorizationView = () => {
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [noTickets, setNoTickets] = useState(false);

  // Pull the newest pending ticket from the database and run live triage on it
  React.useEffect(() => {
    const fetchTicketAndCategorize = async () => {
      setIsThinking(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/reports`);
        const reports = await res.json();
        const pending = reports.find(r => r.status === 'Pending Triage') || reports[0];
        if (!pending) {
          setNoTickets(true);
          return;
        }
        setTicket(pending);
        setIsApproved(pending.status !== 'Pending Triage');

        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/categorize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: pending.text })
        });
        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error("Backend error:", err);
        setResult({
          category: "Road Infrastructure (Fallback)",
          severity: "High (Hazard)",
          keywords: "Sinkhole, Traffic, MG Road, Danger"
        });
      } finally {
        setIsThinking(false);
      }
    };
    fetchTicketAndCategorize();
  }, []);

  const handleApprove = async () => {
    if (!ticket) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/reports/${ticket.ticket_id}/approve`, { method: "POST" });
      setIsApproved(true);
      alert(`Triage approved. ${ticket.ticket_id} is ready for department routing.`);
    } catch (err) {
      console.error(err);
      alert("Failed to reach backend.");
    }
  };

  if (noTickets) {
    return (
      <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
        <h2 className="section-title">Issue Categorization Review</h2>
        <div className="dashboard-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-faint)' }}>
          No citizen reports in the queue yet. Submit one from the Citizen Dashboard to see live Gemma triage.
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Issue Categorization Review</h2>
        <span style={{ backgroundColor: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '0.85rem', color: 'var(--text-faint)' }}>
          Reviewing Ticket: <strong>{ticket ? ticket.ticket_id : 'Loading…'}</strong>
        </span>
      </div>
      <div className="dashboard-card" style={{ padding: '2rem' }}>
        <div className="categorization-flex" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Read-Only Citizen Report */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 500, color: 'var(--text-main)' }}>Citizen's Report Transcript</h3>
            <div style={{ width: '100%', height: '150px', padding: '1rem', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '0.95rem', overflowY: 'auto', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-faint)', fontSize: '0.8rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                Citizen Report
              </div>
              {ticket ? `"${ticket.text}"` : 'Loading report…'}
            </div>

            {ticket?.image_url && (
              <div style={{ marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-medium)' }}>
                <img src={ticket.image_url} alt="Citizen photo evidence" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', display: 'block' }} />
              </div>
            )}

            <div style={{ padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--border-medium)', display: 'grid', placeItems: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="var(--text-muted)"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>Location Data Attached</div>
                <div style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>{ticket ? `${ticket.ward}, ${ticket.state_region}` : '—'}</div>
              </div>
            </div>
          </div>
          
          {/* AI Extracted Triage */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 500, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              AI Extracted Categories
              {isThinking && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: result ? 1 : 0.4, transition: 'opacity 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.3)' }}>
                <span style={{ color: '#60a5fa', fontWeight: 500 }}>Primary Category</span>
                <span style={{ color: 'var(--text-main)' }}>{result ? result.category : 'Processing...'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)' }}>
                <span style={{ color: '#fca5a5', fontWeight: 500 }}>Severity</span>
                <span style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {result ? result.severity : 'Processing...'}
                  {result && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Keywords</span>
                <span style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{result ? result.keywords : 'Processing...'}</span>
              </div>
            </div>

            {/* Admin Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                onClick={handleApprove} 
                disabled={!result || isApproved} 
                style={{ flex: 1, padding: '0.8rem', background: isApproved ? '#10b981' : 'linear-gradient(to right, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: (!result || isApproved) ? 'not-allowed' : 'pointer', opacity: (!result) ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
              >
                {isApproved ? 'Triage Approved' : 'Approve AI Triage'}
              </button>
              <button 
                disabled={!result || isApproved}
                style={{ flex: 1, padding: '0.8rem', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-medium)', borderRadius: '8px', fontWeight: 500, cursor: (!result || isApproved) ? 'not-allowed' : 'pointer', opacity: (!result || isApproved) ? 0.5 : 1, transition: 'all 0.2s' }}
              >
                Override AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AutoRoutingView = () => {
  const [logs, setLogs] = useState([]);
  const [nextTicket, setNextTicket] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const refresh = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/reports`);
      const reports = await res.json();

      // Tickets already routed by the agent form the historical log
      const routed = reports
        .filter(r => r.status && r.status.startsWith('Routed:'))
        .map(r => ({
          issue: `${r.text.length > 60 ? r.text.slice(0, 60) + '…' : r.text} (ID: ${r.ticket_id})`,
          dept: r.status.replace('Routed: ', ''),
          status: 'Routed Successfully',
          time: new Date(r.created_at).toLocaleString(),
          color: '#10b981',
        }));
      setLogs(routed);

      // Next ticket in line for the agent: approved first, then pending
      const candidate = reports.find(r => r.status === 'Triage Approved')
        || reports.find(r => r.status === 'Pending Triage');
      setNextTicket(candidate || null);
    } catch (err) {
      console.error("Backend error:", err);
    }
  };

  React.useEffect(() => { refresh(); }, []);

  const handleRoute = async () => {
    if (!nextTicket) return alert("No tickets waiting for routing. Approve a triage first.");
    setIsProcessing(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/auto-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue_id: nextTicket.ticket_id })
      });
      const data = await response.json();

      setTimeout(() => {
        setIsProcessing(false);
        setLogs(prev => [data, ...prev]);
        refresh();
      }, 1500);
    } catch (err) {
      console.error("Backend error:", err);
      setIsProcessing(false);
      alert("Failed to reach Gemma backend.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Auto-Routing Log</h2>
        <button onClick={handleRoute} disabled={isProcessing || !nextTicket} style={{ padding: '0.6rem 1.2rem', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: (isProcessing || !nextTicket) ? 'not-allowed' : 'pointer', opacity: (isProcessing || !nextTicket) ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isProcessing ? 'Gemma Agent Executing...' : nextTicket ? `Route Ticket ${nextTicket.ticket_id}` : 'No Tickets Waiting'}
        </button>
      </div>
      <div className="dashboard-card" style={{ padding: '2rem', overflowX: 'auto' }}>
        {isProcessing && (
          <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', border: '1px dashed #cbd5e1', borderRadius: '12px', color: '#475569', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
             Gemma 4 calling function: <code>route_issue_to_dept(issue_id="{nextTicket?.ticket_id}", category="{nextTicket?.category}")</code>
          </div>
        )}
        {!isProcessing && logs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-faint)', fontSize: '0.9rem' }}>
            No routing history yet. Approve a triage, then trigger the Gemma agent to route it.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Issue Summary</th>
                <th>Assigned Department</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Routing Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>
                    <div style={{ maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.issue}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="var(--text-muted)"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      <strong style={{ color: 'var(--text-main)' }}>{log.dept}</strong>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: log.color, fontSize: '0.85rem', fontWeight: 500, backgroundColor: `${log.color}15`, padding: '0.25rem 0.75rem', borderRadius: '999px', display: 'inline-block' }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--text-faint)', fontSize: '0.85rem' }}>
                    {log.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const ImageAnalysisView = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [evidence, setEvidence] = useState([]);   // real reports that carry photos
  const [selected, setSelected] = useState(null); // full report object

  const selectEvidence = (r) => {
    setSelected(r);
    if (r.image_analysis) {
      try {
        setResults(JSON.parse(r.image_analysis));
        setIsApproved(true);
      } catch (e) {
        setResults(null);
        setIsApproved(false);
      }
    } else {
      setResults(null);
      setIsApproved(false);
    }
  };

  React.useEffect(() => {
    const loadEvidence = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/reports`);
        const reports = await res.json();
        const withImages = reports.filter(r => r.image_url);
        setEvidence(withImages);
        if (withImages.length > 0) {
          selectEvidence(withImages[0]);
        }
      } catch (err) {
        console.error("Backend error:", err);
      }
    };
    loadEvidence();
  }, []);

  const analyze = async (target) => {
    setIsAnalyzing(true);
    setResults(null);
    setIsApproved(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/analyze-report-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: target.image_url, ticket_id: target.ticket_id })
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setResults(data);
      }
    } catch (err) {
      console.error("Backend error:", err);
      alert("Failed to reach Gemma backend.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDirectUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsAnalyzing(true);
    setResults(null);
    setIsApproved(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/analyze-image`, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      setSelected({ image_url: data.image_url, ticket_id: 'Direct Upload' });
      setResults(data);
    } catch (err) {
      console.error("Backend error:", err);
      alert("Failed to reach Gemma backend.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApprove = () => {
    setIsApproved(true);
    alert(`Image evidence verified${selected?.ticket_id ? ` for ${selected.ticket_id}` : ''}.`);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Visual Evidence Engine</h2>
        <span style={{ backgroundColor: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '0.85rem', color: 'var(--text-faint)' }}>
          Reviewing Evidence for: <strong>{selected ? selected.ticket_id : 'No evidence selected'}</strong>
        </span>
      </div>
      <div className="dashboard-card" style={{ padding: '2rem' }}>
        <div className="analysis-flex" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>

          <div style={{ flex: 1.5, minWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-main)', margin: 0 }}>Attached Photo</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <label style={{ padding: '0.45rem 0.9rem', backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-medium)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleDirectUpload} />
                  Upload New
                </label>
                <button
                  onClick={() => selected && analyze(selected)}
                  disabled={!selected || isAnalyzing}
                  style={{ padding: '0.45rem 0.9rem', background: 'linear-gradient(to right, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500, cursor: (!selected || isAnalyzing) ? 'not-allowed' : 'pointer', opacity: (!selected || isAnalyzing) ? 0.6 : 1 }}
                >
                  {isAnalyzing ? 'Scanning…' : 'Scan with Gemma'}
                </button>
              </div>
            </div>

            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-medium)', height: '350px', backgroundColor: 'var(--glass-bg)', display: 'grid', placeItems: 'center', backgroundImage: selected ? `url(${selected.image_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              {!selected && (
                <div style={{ color: 'var(--text-faint)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
                  No photo evidence in the queue yet.<br />Upload an image or submit a citizen report with a photo.
                </div>
              )}
              {isAnalyzing && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '1rem' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                  Gemma is scanning the image…
                </div>
              )}
              {results && !isAnalyzing && (
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', color: '#fff' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '0.3rem' }}>Gemma 4 Vision Analysis</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{results.description}</div>
                </div>
              )}
            </div>

            {evidence.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {evidence.map((r) => (
                  <div
                    key={r.ticket_id}
                    onClick={() => selectEvidence(r)}
                    title={r.ticket_id}
                    style={{ width: '64px', height: '48px', flexShrink: 0, borderRadius: '8px', backgroundImage: `url(${r.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', border: selected?.ticket_id === r.ticket_id ? '2px solid #7c3aed' : '1px solid var(--border-medium)', position: 'relative' }}
                  >
                    {r.image_analysis && (
                      <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981', border: '2px solid var(--bg-body)' }} title="Analyzed" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 500, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Detection Results
              {isAnalyzing && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: results ? 1 : 0.4, transition: 'opacity 0.3s' }}>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(239,68,68,0.05)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#fca5a5', fontWeight: 500 }}>Pothole Detected</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{results ? results.pothole : '0%'}</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(239,68,68,0.2)', borderRadius: '3px' }}>
                  <div style={{ width: results ? results.pothole : '0%', height: '100%', backgroundColor: '#ef4444', borderRadius: '3px', transition: 'width 1s ease-out' }}></div>
                </div>
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Water Logging</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{results ? results.water : '0%'}</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-medium)', borderRadius: '3px' }}>
                  <div style={{ width: results ? results.water : '0%', height: '100%', backgroundColor: 'var(--border-hover)', borderRadius: '3px', transition: 'width 1s ease-out' }}></div>
                </div>
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Faded Markings</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{results ? results.faded : '0%'}</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-medium)', borderRadius: '3px' }}>
                  <div style={{ width: results ? results.faded : '0%', height: '100%', backgroundColor: 'var(--border-hover)', borderRadius: '3px', transition: 'width 1s ease-out' }}></div>
                </div>
              </div>
            </div>

            {/* Admin Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                onClick={handleApprove} 
                disabled={!results || isApproved} 
                style={{ flex: 1, padding: '0.8rem', background: isApproved ? '#10b981' : 'linear-gradient(to right, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: (!results || isApproved) ? 'not-allowed' : 'pointer', opacity: (!results) ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
              >
                {isApproved ? 'Evidence Verified' : 'Verify Detection'}
              </button>
              <button 
                disabled={!results || isApproved}
                style={{ flex: 1, padding: '0.8rem', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-medium)', borderRadius: '8px', fontWeight: 500, cursor: (!results || isApproved) ? 'not-allowed' : 'pointer', opacity: (!results || isApproved) ? 0.5 : 1, transition: 'all 0.2s' }}
              >
                Flag as False Positive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Track Report View ---

const TrackReportView = () => {
  const [ticketInput, setTicketInput] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    setLoading(true); setError(''); setReport(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/reports/${ticketInput.trim().toUpperCase()}`);
      if (!res.ok) { setError('Ticket not found. Check the ID and try again.'); setLoading(false); return; }
      const data = await res.json();
      setReport(data);
    } catch { setError('Could not connect to the server.'); }
    setLoading(false);
  };

  const timeline = report ? [
    { label: 'Report Submitted', done: true, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>, detail: 'Received by Samadhan system' },
    { label: 'AI Triage', done: true, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>, detail: `Categorized as: ${report.category} · ${report.severity}` },
    { label: 'Auto-Routed', done: report.status?.includes('Routed'), icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>, detail: report.routed_to ? `Sent to: ${report.routed_to}` : 'Pending routing' },
    { label: 'Department Action', done: report.status?.includes('Approved') || report.status?.includes('Resolved'), icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>, detail: 'Department reviewing issue' },
    { label: 'Resolved', done: report.status?.includes('Resolved'), icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, detail: 'Issue closed and verified' },
  ] : [];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>Track Your Report</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>Enter your ticket ID to get real-time status updates</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input
            value={ticketInput}
            onChange={e => setTicketInput(e.target.value)}
            placeholder="e.g. TICK-10294"
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', backgroundColor: '#fdfdfd', border: '1.5px solid var(--border-medium)', borderRadius: '12px', color: 'var(--text-main)', fontSize: '0.95rem', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', letterSpacing: '0.05em', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = 'var(--border-medium)'}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '0.9rem 2rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px #6366f140', whiteSpace: 'nowrap' }}>
          {loading ? <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
          Track Report
        </button>
      </form>

      {error && (
        <div style={{ padding: '1rem 1.25rem', backgroundColor: '#ef444415', border: '1px solid #ef444430', borderRadius: '12px', color: '#ef4444', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> {error}
        </div>
      )}

      {report && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>

          {/* Report Card */}
          <div className="dashboard-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Ticket</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-main)' }}>{report.ticket_id}</div>
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: report.status?.includes('Routed') ? '#3b82f6' : report.status?.includes('Resolved') ? '#10b981' : '#f59e0b', backgroundColor: (report.status?.includes('Routed') ? '#3b82f6' : report.status?.includes('Resolved') ? '#10b981' : '#f59e0b') + '15', padding: '0.4rem 0.9rem', borderRadius: '999px', border: `1px solid ${(report.status?.includes('Routed') ? '#3b82f6' : report.status?.includes('Resolved') ? '#10b981' : '#f59e0b')}30` }}>
                {report.status}
              </div>
            </div>

            {report.image_url && (
              <div style={{ marginBottom: '1.25rem', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <img src={report.image_url} alt="Report" style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
              </div>
            )}

            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.25rem', padding: '0.9rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              {report.text}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Category', value: report.category },
                { label: 'Severity', value: report.severity },
                { label: 'Priority', value: report.priority, color: report.color },
                { label: 'Ward', value: `${report.ward}, ${report.state_region}` },
              ].map((item, i) => (
                <div key={i} style={{ padding: '0.75rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: item.color || 'var(--text-main)' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {report.keywords && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> {report.keywords}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="dashboard-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.75rem' }}>Resolution Timeline</div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '19px', top: '12px', bottom: '12px', width: '2px', backgroundColor: 'var(--border-medium)' }} />
              {timeline.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem', marginBottom: i < timeline.length - 1 ? '1.75rem' : 0, position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: step.done ? '#6366f1' : 'var(--bg-card)', border: `2px solid ${step.done ? '#6366f1' : 'var(--border-medium)'}`, display: 'grid', placeItems: 'center', flexShrink: 0, transition: 'all 0.3s', boxShadow: step.done ? '0 0 0 4px #6366f120' : 'none' }}>
                    {step.done
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      : <span style={{ display: 'flex', color: 'var(--text-faint)' }}>{step.icon}</span>}
                  </div>
                  <div style={{ paddingTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: step.done ? 'var(--text-main)' : 'var(--text-faint)' }}>{step.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: '0.2rem' }}>{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {report.routed_to && (
              <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#3b82f610', borderRadius: '10px', border: '1px solid #3b82f625' }}>
                <div style={{ fontSize: '0.7rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Assigned Department</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> {report.routed_to}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {!report && !error && !loading && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
          <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Search for a ticket</div>
          <div style={{ color: 'var(--text-faint)', fontSize: '0.875rem' }}>Enter your Ticket ID (e.g. <code style={{ color: 'var(--text-muted)', backgroundColor: 'var(--glass-bg)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>TKT-A3F2</code>) above to track progress</div>
        </div>
      )}
    </div>
  );
};


// --- Profile View ---

const ProfileView = () => {
  const { userProfile, setUserProfile } = React.useContext(UserContext) || { userProfile: {} };
  const [profile, setProfile] = useState({
    email: userProfile.email || '',
    name: userProfile.name || '',
    role: userProfile.role || 'citizen',
    ward: userProfile.ward || '',
    state_region: userProfile.state_region || '',
    bio: userProfile.bio || '',
    avatar_url: userProfile.avatar_url || null,
    gemini_api_key: localStorage.getItem('samadhan_gemini_key') || '',
  });
  const [apiUsage, setApiUsage] = useState(parseInt(localStorage.getItem('samadhan_api_usage') || '0', 10));
  const API_LIMIT = 100;
  const usagePercent = Math.min(Math.round((apiUsage / API_LIMIT) * 100), 100);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  React.useEffect(() => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      setProfile(p => ({
        ...p,
        email: userProfile.email || p.email,
        name: userProfile.full_name || userProfile.name || p.name,
        role: userProfile.role || p.role,
        ward: userProfile.ward || p.ward,
        state_region: userProfile.state_region || p.state_region,
        bio: userProfile.bio || p.bio,
        avatar_url: userProfile.avatar_url || p.avatar_url,
      }));
    }
  }, [userProfile]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !profile.email) return;
    if (profile.email === 'demo@samadhan.gov.in') return alert("Avatar upload disabled for demo.");

    setAvatarLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.email.replace(/[^a-zA-Z0-9]/g, '_')}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const avatar_url = publicUrlData.publicUrl;
      
      await supabase.from('profiles').update({ avatar_url }).eq('email', profile.email);
      setProfile(p => ({ ...p, avatar_url }));
    } catch (err) { 
      console.error(err);
      alert('Failed to upload avatar.');
    }
    setAvatarLoading(false);
  };

  const handleSave = async () => {
    if (!profile.email) return alert('Email is required to save profile.');
    
    if (profile.email === 'demo@samadhan.gov.in') {
                        setSaved(true); setEditMode(false);
      setTimeout(() => setSaved(false), 3000);
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        email: profile.email,
        full_name: profile.name,
        role: profile.role,
        ward: profile.ward,
        state_region: profile.state_region,
        impact_score: profile.impact_score || 0
      }, { onConflict: 'email' });
      
      if (error) throw error;

      if (profile.gemini_api_key) {
        localStorage.setItem('samadhan_gemini_key', profile.gemini_api_key);
      } else {
        localStorage.removeItem('samadhan_gemini_key');
      }

      setUserProfile(p => ({ ...p, ...profile }));
      setSaved(true); setEditMode(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { 
      console.error(err);
      alert('Failed to save profile via Supabase.');
    }
    setSaving(false);
  };

  const Field = ({ label, field, type = 'text', placeholder, half }) => (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      {editMode ? (
        <input
          type={type}
          value={profile[field] || ''}
          placeholder={placeholder}
          onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}
          style={{ width: '100%', padding: '0.75rem 0.9rem', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-medium)', borderRadius: '9px', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = 'var(--border-medium)'}
        />
      ) : (
        <div style={{ padding: '0.75rem 0.9rem', backgroundColor: 'var(--glass-bg)', borderRadius: '9px', border: '1px solid var(--border-light)', fontSize: '0.875rem', color: profile[field] ? 'var(--text-main)' : 'var(--text-faint)', minHeight: '42px' }}>
          {profile[field] || <span style={{ opacity: 0.5 }}>Not set</span>}
        </div>
      )}
    </div>
  );

  const initials = (profile.name || profile.email || '?').slice(0, 2).toUpperCase();

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>My Profile</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>Manage your account details and preferences</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {saved && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 500 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Saved!</div>}
          {editMode ? (
            <>
              <button onClick={() => setEditMode(false)} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-medium)', borderRadius: '9px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '9px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px #6366f140' }}>
                {saving ? <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : null}
                Save Changes
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} style={{ padding: '0.6rem 1.5rem', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-medium)', borderRadius: '9px', color: 'var(--text-main)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* Avatar Card */}
        <div className="dashboard-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
            <div style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto',
              background: profile.avatar_url
                ? 'transparent'
                : getAvatarStyle(profile.name || 'User').background,
              boxShadow: profile.avatar_url
                ? '0 8px 24px rgba(0,0,0,0.12)'
                : '0 0 0 6px rgba(99,102,241,0.12), 0 8px 28px rgba(99,102,241,0.35)',
              border: profile.avatar_url ? '3px solid #6366f1' : getAvatarStyle(profile.name || 'User').border,
            }}>
              {profile.avatar_url && (
                <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <label style={{ position: 'absolute', bottom: 2, right: 2, width: '30px', height: '30px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', display: 'grid', placeItems: 'center', cursor: 'pointer', border: '2.5px solid var(--bg-card)', boxShadow: '0 4px 12px #6366f150' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
              {avatarLoading ? <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>}
            </label>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{profile.name || 'Your Name'}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginBottom: '1rem' }}>{profile.email || 'your@email.com'}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #6366f120, #8b5cf620)', border: '1px solid #6366f130', padding: '0.3rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, color: '#818cf8' }}>
            {profile.role === 'admin'
              ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Administrator</>
              : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Citizen</>}
          </div>

          {profile.ward && (
            <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, #6366f108, #8b5cf608)', borderRadius: '10px', border: '1px solid #6366f120', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <span style={{ color: '#818cf8', fontWeight: 500 }}>{profile.ward}, {profile.state_region}</span>
            </div>
          )}
        </div>

        {/* Details Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* API Key Settings */}
          <div className="dashboard-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'grid', placeItems: 'center' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
                AI Integration (BYOK)
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Google Gemini API Key</label>
                  {editMode ? (
                    <input
                      type="password"
                      value={profile.gemini_api_key}
                      placeholder="AIzaSy..."
                      onChange={e => setProfile(p => ({ ...p, gemini_api_key: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 0.9rem', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-medium)', borderRadius: '9px', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#6366f1'}
                      onBlur={e => e.target.style.borderColor = 'var(--border-medium)'}
                    />
                  ) : (
                    <div style={{ padding: '0.75rem 0.9rem', backgroundColor: 'var(--glass-bg)', borderRadius: '9px', border: '1px solid var(--border-light)', fontSize: '0.875rem', color: profile.gemini_api_key ? 'var(--text-main)' : 'var(--text-faint)', minHeight: '42px', fontFamily: 'monospace' }}>
                      {profile.gemini_api_key ? '••••••••••••••••••••••••••••••••' : <span style={{ opacity: 0.5, fontFamily: 'var(--font-sans)' }}>Not configured (AI features disabled)</span>}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', lineHeight: 1.5 }}>
                  Provide your own Gemini API key to enable auto-categorization and image analysis. Your key is securely stored in this browser only.
                </div>
              </div>

              <div style={{ width: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '50%', background: `conic-gradient(#f59e0b ${usagePercent}%, var(--border-medium) 0)`, display: 'grid', placeItems: 'center', transition: 'all 0.5s ease' }}>
                  <div style={{ position: 'absolute', inset: '6px', backgroundColor: 'var(--bg-card)', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>{usagePercent}%</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', marginTop: '0.5rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Token Limit
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'grid', placeItems: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            Personal Information
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Full Name" field="name" placeholder="Your full name" half />
            <Field label="Email Address" field="email" type="email" placeholder="you@example.com" half />
            <Field label="Role" field="role" placeholder="citizen" half />
            <Field label="Ward / Sector" field="ward" placeholder="e.g. Sector 4" half />
            <Field label="State" field="state_region" placeholder="e.g. West Bengal" half />
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bio</label>
              {editMode ? (
                <textarea
                  value={profile.bio || ''}
                  placeholder="Tell us a bit about yourself..."
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  style={{ width: '100%', height: '80px', padding: '0.75rem 0.9rem', backgroundColor: 'var(--glass-bg)', border: '1px solid var(--border-medium)', borderRadius: '9px', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-medium)'}
                />
              ) : (
                <div style={{ padding: '0.75rem 0.9rem', backgroundColor: 'var(--glass-bg)', borderRadius: '9px', border: '1px solid var(--border-light)', fontSize: '0.875rem', color: profile.bio ? 'var(--text-main)' : 'var(--text-faint)', minHeight: '80px', lineHeight: 1.5 }}>
                  {profile.bio || <span style={{ opacity: 0.5 }}>No bio added yet</span>}
                </div>
              )}
            </div>
          </div>

          {editMode && (
            <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', backgroundColor: '#6366f108', border: '1px solid #6366f120', borderRadius: '8px', fontSize: '0.775rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Changes are saved to the database and synced to localStorage automatically.
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};


// --- Main Layout ---

const Dashboard = () => {
  const userRole = localStorage.getItem('samadhan_role') || 'citizen';
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'analytics' : 'my-reports');
  const [theme, setTheme] = useState('dark');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [impactScore, setImpactScore] = useState(0);
  const [displayName, setDisplayName] = useState(
    localStorage.getItem('samadhan_name') || (userRole === 'admin' ? 'Administrator' : 'Souradeep')
  );
  const [userProfile, setUserProfile] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);

  // Load profile from Supabase so avatar & name are always fresh
  React.useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setLoadingSession(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('avatar_url, full_name, role, impact_score')
            .eq('email', session.user.email)
            .single();
            
          if (profile && !error) {
            setUserProfile({ ...profile, email: session.user.email });
            if (profile.impact_score !== undefined && profile.impact_score !== null) {
              setImpactScore(profile.impact_score);
            }
            if (profile.full_name) {
              setDisplayName(profile.full_name);
              localStorage.setItem('samadhan_name', profile.full_name);
            }
            if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
          } else {
            setUserProfile({ email: session.user.email, role: userRole });
          }
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setLoadingSession(false);
      }
    };
    
    fetchSessionAndProfile();
  }, [userRole]);
  
  // Re-read avatar when profile tab is saved (listen for storage events)
  React.useEffect(() => {
    const onStorage = () => {
      const name = localStorage.getItem('samadhan_name');
      if (name) setDisplayName(name);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const getAvatarUrl = (seed) =>
    `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${encodeURIComponent(seed || 'default')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  const AvatarCircle = ({ size = 32, fontSize = '0.85rem' }) => {
    const avatarStyle = getAvatarStyle(displayName);
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        border: avatarUrl ? '2px solid rgba(99,102,241,0.3)' : avatarStyle.border,
        display: 'grid',
        placeItems: 'center',
        background: avatarUrl ? 'transparent' : avatarStyle.background,
        boxShadow: avatarUrl ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(8px)',
        position: 'relative',
      }}>
        {avatarUrl && <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
      </div>
    );
  };

  const renderSidebarLink = (id, label, icon) => (
    <div 
      className={`sidebar-link ${activeTab === id ? 'active' : ''}`}
      onClick={() => {
        setActiveTab(id);
        setMobileMenuOpen(false);
      }}
    >
      {icon}
      {label}
    </div>
  );

  if (loadingSession) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', gap: '1rem' }}>
      <Classic style={{ color: 'var(--text-main)', width: '2.5rem', height: '2.5rem' }} />
      <div style={{ color: 'var(--text-muted)' }}>Loading Dashboard...</div>
    </div>
  );

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile }}>
    <div className={`dashboard-layout ${theme === 'light' ? 'theme-light' : ''}`}>
      
      {/* Mobile Header */}
      <div className="mobile-header" style={{ display: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-main)' }}>
          <img src={logoImg} alt="Samadhan" style={{ height: '28px', filter: 'brightness(0)' }} />
          Samadhan
        </div>
        <button onClick={() => setMobileMenuOpen(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      <div className={`sidebar-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-main)' }}>
            <img src={logoImg} alt="Samadhan Logo" style={{ height: '32px', filter: 'brightness(0)' }} />
            Samadhan
          </a>
        </div>

        <div className="sidebar-nav-group">
          {renderSidebarLink('home', 'Home', 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          )}
        </div>

        {userRole === 'citizen' && (
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
            {renderSidebarLink('profile', 'My Profile',
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            )}
          </div>
        )}

        {userRole === 'admin' && (
          <div className="sidebar-nav-group">
            <div className="sidebar-nav-title">
              Triage & Analytics
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
            </div>
            {renderSidebarLink('analytics', 'Platform Analytics',
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            )}
            {renderSidebarLink('incoming-issues', 'Incoming Issues',
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            )}
          </div>
        )}

        {userRole === 'admin' && (
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
        )}

        <div className="sidebar-bottom">
          
          {/* User Profile / Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div onClick={() => setActiveTab('profile')} style={{ cursor: 'pointer' }}>
              <AvatarCircle size={32} fontSize="0.85rem" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>{userRole === 'admin' ? 'City Dept' : displayName}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>{userRole === 'admin' ? 'Administrator' : 'Citizen'}</span>
            </div>
          </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>

              
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <AvatarCircle size={40} fontSize="1rem" />
            <div>
              <div className="dashboard-welcome" style={{ margin: 0 }}>Welcome back, {userRole === 'admin' ? 'Administrator' : displayName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.15rem' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
          </div>
          {userRole === 'citizen' && (
            <div className="credits-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {impactScore} Impact Points
            </div>
          )}
        </header>

        {/* Content Router */}
        {activeTab === 'home' && (
          <div className="animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
            <h2>Redirecting to Home...</h2>
            {setTimeout(() => { window.location.href = '/' }, 1000) && ''}
          </div>
        )}
        {activeTab === 'my-reports' && <MyReportsView />}
        {activeTab === 'track-report' && <TrackReportView />}
        {activeTab === 'impact-score' && <ImpactScoreView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'incoming-issues' && <IncomingIssuesView />}
        
        {activeTab === 'issue-categorization' && <IssueCategorizationView />}
        {activeTab === 'auto-routing' && <AutoRoutingView />}
        {activeTab === 'image-analysis' && <ImageAnalysisView />}

      </main>
    </div>
    </UserContext.Provider>
  );
}

export default Dashboard;
