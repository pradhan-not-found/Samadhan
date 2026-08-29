import React from 'react';
import { Award } from 'lucide-react';
import './Dashboard.css';

export default function GamificationDashboardUI() {
  return (
    <div className="dashboard-container" style={{ backgroundColor: 'white', color: '#111', width: '100%', height: '100%', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f8fafc' }}>
            <Award size={20} color="#8b5cf6" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Civic Gamification</h3>
        </div>
        
        <div style={{ padding: '1.5rem', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
             <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Your Impact Score</h3>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 1.5rem 0' }}>Top 5% Civic Guardian</p>
             
             <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'conic-gradient(#059669 0% 82%, #f1f5f9 82% 100%)', boxShadow: '0 10px 25px rgba(5, 150, 105, 0.15)' }}>
                <div style={{ width: '130px', height: '130px', background: 'white', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}>
                   <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#111', lineHeight: '1.1' }}>1,450</span>
                   <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Points</span>
                </div>
             </div>
           </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Weekly Leaderboard</h4>
          <div className="dash-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="dash-list-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                 <span style={{ fontWeight: 800, color: '#f59e0b', width: '20px', textAlign: 'center' }}>1</span>
                 <div style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', display: 'grid', placeItems: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>AK</div>
                 <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Anita K.</span>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, color: '#059669', flexShrink: 0 }}>
                   2,100 <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>pts</span>
                 </div>
              </div>
              
              <div className="dash-list-item active" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border-medium)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                 <span style={{ fontWeight: 800, color: '#64748b', width: '20px', textAlign: 'center' }}>2</span>
                 <div style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', display: 'grid', placeItems: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>VD</div>
                 <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Venkatesh D. <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6366f1' }}>(You)</span></span>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, color: '#10b981', flexShrink: 0 }}>
                   1,450 <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>pts</span>
                 </div>
              </div>
          </div>
        </div>
    </div>
  );
}
