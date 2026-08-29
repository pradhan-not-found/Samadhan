import React from 'react';
import { 
  Activity, 
  ChevronDown, 
  Send, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import './Dashboard.css';

export default function VisionDashboardUI() {
  return (
    <div className="dashboard-container" style={{ backgroundColor: 'white', color: '#111', width: '100%', height: '100%', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f8fafc' }}>
            <Activity size={20} color="#3b82f6" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Transparent Tracking</h3>
        </div>
        <div style={{ padding: '1.5rem', flex: 1, overflow: 'hidden' }}>
          <div className="dash-text-large" style={{ color: '#333', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Every citizen's report is transparently tracked. The community can monitor the municipal corporation's response and resolution time in real-time.
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, background: '#f1f5f9', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Resolution Rate</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>92%</div>
            </div>
            <div style={{ flex: 1, background: '#f1f5f9', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Avg. Time</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>48 Hrs</div>
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Live Action Stream</h4>
          <div className="dash-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="dash-list-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-medium)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              <div className="item-play green" style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: '#d1fae5', color: '#10b981', display: 'grid', placeItems: 'center' }}>
                <CheckCircle size={20} />
              </div>
              <div className="item-info" style={{ flex: 1, minWidth: 0 }}>
                <div className="item-title" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, marginBottom: '0.25rem' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pothole Fixed</span>
                  <span style={{ flexShrink: 0, fontSize: '0.75rem', background: '#d1fae5', color: '#065f46', padding: '0.15rem 0.5rem', borderRadius: '20px' }}>Resolved</span>
                </div>
                <div className="item-subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>PWD • Sector 4 • 2 mins ago</div>
              </div>
            </div>

            <div className="dash-list-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div className="item-play orange" style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: '#fef3c7', color: '#f59e0b', display: 'grid', placeItems: 'center' }}>
                <Clock size={20} />
              </div>
              <div className="item-info" style={{ flex: 1, minWidth: 0 }}>
                <div className="item-title" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, marginBottom: '0.25rem' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Garbage Clearance</span>
                  <span style={{ flexShrink: 0, fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '0.15rem 0.5rem', borderRadius: '20px' }}>In Progress</span>
                </div>
                <div className="item-subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sanitation • Market • 1 hr ago</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
