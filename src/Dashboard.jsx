import React, { useState } from 'react';
import './Dashboard.css';
import logoImg from './assets/logo.png';
import DashboardUI from './DashboardUI';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// --- Page Components ---

const MyReportsView = () => {
  const state = localStorage.getItem('samadhan_state') || 'West Bengal';
  const ward = localStorage.getItem('samadhan_ward') || 'Sector 4';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportText, setReportText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [pastReports, setPastReports] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/reports");
      const data = await res.json();
      setPastReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const imgRes = await fetch("http://127.0.0.1:8000/api/analyze-image", {
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
      const res = await fetch("http://127.0.0.1:8000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: reportText || "Photo Report", 
          ward, 
          state_region: state,
          image_url: uploadedImageUrl 
        })
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


  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Citizen Dashboard</h2>
        <div style={{ backgroundColor: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="var(--text-muted)"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          {ward}, {state}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      {/* Report Form */}
      <div className="dashboard-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Report a New Issue</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Issue Description (Text or Voice)</label>
            <textarea 
              placeholder="Describe the problem..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              style={{ width: '100%', height: '100px', padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-medium)', color: 'var(--text-main)', resize: 'none' }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upload Photo Evidence</label>
            <label style={{ border: '1px dashed var(--border-medium)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--glass-bg)', cursor: 'pointer', display: 'block' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-faint)', marginBottom: '0.5rem', margin: '0 auto' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{imageFile ? imageFile.name : "Click to upload an image"}</div>
            </label>
          </div>
          
          <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '0.8rem', background: '#3a3f5c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, boxShadow: '0 2px 4px rgba(58, 63, 92, 0.2)' }}>
            {isSubmitting ? 'Gemma is analyzing...' : 'Submit Report to AI Triage'}
          </button>
        </form>
      </div>

      {/* Past Reports */}
      <div className="dashboard-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>My Recent Reports</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {pastReports.filter(r => r.ward === ward).length === 0 && <div style={{ color: 'var(--text-faint)', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>No reports submitted in your ward yet.</div>}
          {pastReports.filter(r => r.ward === ward).map((report, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {report.image_url && (
                  <div style={{ width: '48px', height: '48px', borderRadius: '6px', backgroundImage: `url(${report.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border-medium)' }} />
                )}
                <div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.9rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '200px' }}>{report.text}</div>
                  <div style={{ color: 'var(--text-faint)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{report.category}</div>
                </div>
              </div>
              <div style={{ color: report.color || '#3b82f6', fontSize: '0.8rem', fontWeight: 500, backgroundColor: `${report.color || '#3b82f6'}15`, padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                {report.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

const ImpactScoreView = () => {
  const [reports, setReports] = useState([]);
  const ward = localStorage.getItem('samadhan_ward') || 'Sector 4';

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/reports");
        const data = await res.json();
        setReports(data.filter(r => r.ward === ward));
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, [ward]);

  const basePoints = 150;
  const earnedPoints = reports.length * 15;
  const totalPoints = basePoints + earnedPoints;
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

const LeaderboardView = () => {
  const state = localStorage.getItem('samadhan_state') || 'West Bengal';
  const ward = localStorage.getItem('samadhan_ward') || 'Sector 4';

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Community Leaderboard</h2>
        <div style={{ backgroundColor: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="var(--text-muted)"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          {ward}, {state}
        </div>
      </div>
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

const AnalyticsView = () => (
  <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
    <h2 className="section-title">Platform Analytics</h2>
    <div className="analytics-grid">
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
    
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
      <div className="dashboard-card" style={{ padding: '2rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ color: 'var(--text-main)', fontWeight: 500, marginBottom: '1rem' }}>Issues Reported (Past Week)</div>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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

const IncomingIssuesView = () => {
  const [reports, setReports] = useState([]);

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/reports");
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
      <div className="dashboard-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-medium)', paddingBottom: '1rem', marginBottom: '1rem', color: 'var(--text-faint)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <div style={{ width: '80px' }}>Ticket ID</div>
          <div style={{ flex: 1 }}>Report Summary</div>
          <div style={{ width: '150px', textAlign: 'center' }}>AI Category</div>
          <div style={{ width: '120px', textAlign: 'center' }}>AI Priority</div>
          <div style={{ width: '100px', textAlign: 'right' }}>Time</div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
          {reports.length === 0 && <div style={{ color: 'var(--text-faint)', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>No incoming issues right now.</div>}
          {reports.map((ticket, i) => (
            <div key={i} style={{ 
              display: 'flex', alignItems: 'center', padding: '1rem', 
              backgroundColor: 'var(--glass-bg)', 
              borderRadius: '12px', border: '1px solid var(--border-light)',
              transition: 'all 0.2s', cursor: 'pointer'
            }}>
              <div style={{ width: '80px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{ticket.ticket_id}</div>
              <div style={{ flex: 1, fontWeight: 500, color: 'var(--text-main)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '300px' }}>{ticket.text}</div>
              <div style={{ width: '150px', textAlign: 'center', color: 'var(--text-faint)', fontSize: '0.9rem' }}>{ticket.category}</div>
              <div style={{ width: '120px', textAlign: 'center' }}>
                <span style={{ color: ticket.color || '#3b82f6', backgroundColor: `${ticket.color || '#3b82f6'}20`, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {ticket.priority || 'Medium'}
                </span>
              </div>
              <div style={{ width: '100px', textAlign: 'right', color: 'var(--text-faint)', fontSize: '0.85rem' }}>Just now</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const IssueCategorizationView = () => {
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  // Load the AI results automatically from the backend when this ticket is "opened"
  React.useEffect(() => {
    const fetchCategory = async () => {
      setIsThinking(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categorize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "I am standing near the MG Road metro station and there's a huge sinkhole that just appeared. Cars are swerving and it's extremely dangerous." })
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
    fetchCategory();
  }, []);

  const handleApprove = () => {
    setIsApproved(true);
    alert("Triage approved. Ticket routed to Road Infrastructure.");
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Issue Categorization Review</h2>
        <span style={{ backgroundColor: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '0.85rem', color: 'var(--text-faint)' }}>
          Reviewing Ticket: <strong>#TKT-4093</strong>
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
                Transcribed from Voice Report
              </div>
              "I am standing near the MG Road metro station and there's a huge sinkhole that just appeared. Cars are swerving and it's extremely dangerous. Someone needs to come look at this immediately before an accident happens."
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: 'var(--glass-bg)', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--border-medium)', display: 'grid', placeItems: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="var(--text-muted)"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>Location Data Attached</div>
                <div style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>Coordinates: 22.5726° N, 88.3639° E</div>
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
  const [logs, setLogs] = useState([
    { issue: 'Broken Streetlight (ID: #4092)', dept: 'Electrical Department', status: 'Routed Successfully', time: '10 mins ago', color: '#10b981' },
    { issue: 'Water Pipe Burst (ID: #4091)', dept: 'Water Board (Jal Board)', status: 'Routed Successfully', time: '25 mins ago', color: '#10b981' },
    { issue: 'Illegal Dumping (ID: #4090)', dept: 'Sanitation Department', status: 'Pending Approval', time: '1 hour ago', color: '#f97316' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulate = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auto-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue_id: "#4093" })
      });
      const data = await response.json();
      
      setTimeout(() => {
        setIsProcessing(false);
        setLogs([data, ...logs]);
      }, 2500);
    } catch (err) {
      console.error("Backend error:", err);
      setTimeout(() => {
        setIsProcessing(false);
        setLogs([{ issue: 'Massive Sinkhole (ID: #4093)', dept: 'Emergency Response / PWD', status: 'Agent Routed', time: 'Just now', color: '#3b82f6' }, ...logs]);
      }, 2500);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Auto-Routing Log</h2>
        <button onClick={handleSimulate} disabled={isProcessing} style={{ padding: '0.6rem 1.2rem', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isProcessing ? 'Gemma Agent Executing...' : 'Trigger Gemma Agent Route'}
        </button>
      </div>
      <div className="dashboard-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isProcessing && (
            <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', border: '1px dashed #cbd5e1', borderRadius: '12px', color: '#475569', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
               Gemma 4 calling function: <code>route_issue_to_dept(issue_id="#4093", category="Hazard")</code>
            </div>
          )}
          {logs.map((log, i) => (
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
};

const ImageAnalysisView = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  // Simulating an incoming image from a citizen report
  const simulatedImage = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800";

  React.useEffect(() => {
    const fetchAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const formData = new FormData();
        formData.append("file", new Blob(["dummy content"], { type: 'text/plain' }), "dummy.txt");
        const response = await fetch("http://127.0.0.1:8000/api/analyze-image", {
          method: "POST",
          body: formData
        });
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error("Backend error:", err);
        setResults({
          pothole: '98.2% (Fallback)',
          water: '12.4%',
          faded: '4.1%'
        });
      } finally {
        setIsAnalyzing(false);
      }
    };
    fetchAnalysis();
  }, []);

  const handleApprove = () => {
    setIsApproved(true);
    alert("Image evidence verified. Attached to TKT-4093.");
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Visual Evidence Engine</h2>
        <span style={{ backgroundColor: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '0.85rem', color: 'var(--text-faint)' }}>
          Reviewing Evidence for: <strong>#TKT-4093</strong>
        </span>
      </div>
      <div className="dashboard-card" style={{ padding: '2rem' }}>
        <div className="analysis-flex" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          <div style={{ flex: 1.5, minWidth: '300px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-main)', marginBottom: '1rem' }}>Attached Photo</h3>
            
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-medium)', height: '350px', backgroundColor: 'var(--glass-bg)', display: 'grid', placeItems: 'center', backgroundImage: `url(${simulatedImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              {isAnalyzing && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '1rem' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                  Processing Image...
                </div>
              )}
              {results && (
                <div style={{ position: 'absolute', top: '40%', left: '30%', width: '150px', height: '100px', border: '3px solid #ef4444', backgroundColor: 'rgba(239,68,68,0.2)', borderRadius: '4px', boxShadow: '0 0 15px rgba(239,68,68,0.5)' }}>
                  <div style={{ position: 'absolute', top: '-28px', left: '-3px', backgroundColor: '#ef4444', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '4px 4px 0 0' }}>
                    Pothole {results.pothole}
                  </div>
                </div>
              )}
            </div>
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


// --- Main Layout ---

const Dashboard = () => {
  const userRole = localStorage.getItem('samadhan_role') || 'citizen';
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'analytics' : 'my-reports');
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            )}
            {renderSidebarLink('impact-score', 'Impact Score',
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            )}
            {renderSidebarLink('leaderboard', 'Leaderboard',
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
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
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '0.85rem', color: '#fff' }}>
                {userRole === 'admin' ? 'A' : 'S'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>{userRole === 'admin' ? 'City Dept' : 'Souradeep'}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>{userRole === 'admin' ? 'Administrator' : 'Citizen'}</span>
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
          <div className="dashboard-welcome">Welcome back, {userRole === 'admin' ? 'Administrator' : 'Souradeep'}</div>
          {userRole === 'citizen' && (
            <div className="credits-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              150 Impact Points
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
        {activeTab === 'impact-score' && <ImpactScoreView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'incoming-issues' && <IncomingIssuesView />}
        
        {activeTab === 'issue-categorization' && <IssueCategorizationView />}
        {activeTab === 'auto-routing' && <AutoRoutingView />}
        {activeTab === 'image-analysis' && <ImageAnalysisView />}

      </main>
    </div>
  );
}

export default Dashboard;
