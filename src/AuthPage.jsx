import React, { useState } from 'react';
import './AuthPage.css';
import logoImg from './assets/logo.png';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('citizen');
  const [stateRegion, setStateRegion] = useState('');
  const [ward, setWard] = useState('');

  const handleSubmit = () => {
    localStorage.setItem('samadhan_role', role);
    if (!isLogin && role === 'citizen') {
      localStorage.setItem('samadhan_state', stateRegion || 'West Bengal');
      localStorage.setItem('samadhan_ward', ward || 'Sector 4');
    }
    window.location.href = '/dashboard';
  };

  return (
    <div className="auth-split-layout">
      {/* LEFT VISUAL PANE */}
      <div className="auth-split-visual">
        <div className="auth-visual-content">
          <div className="auth-visual-logo">
            <img src={logoImg} alt="Samadhan Logo" style={{ height: '32px', width: 'auto' }} />
            Samadhan
          </div>
          <h2>Building a better India, block by block.</h2>
          <p>Join the movement to transform public infrastructure through crowdsourced civic reporting and transparent AI tracking.</p>
        </div>
      </div>

      {/* RIGHT FORM PANE */}
      <div className="auth-split-form-container">
        <div className="auth-card">
          <a href="/" className="auth-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to home
          </a>
          
          <h1 className="auth-title">
            {isLogin ? "Sign in to Samadhan" : "Create your account"}
          </h1>
          <p className="auth-subtitle">
            {isLogin ? "Welcome back! Please enter your details." : "Enter your details below to create your account and get started."}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#f3f4f6', padding: '0.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <button 
              type="button" 
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: role === 'citizen' ? '#F9730C' : 'transparent', color: role === 'citizen' ? 'white' : '#4b5563', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: role === 'citizen' ? '0 2px 4px rgba(249, 115, 12, 0.2)' : 'none' }}
              onClick={() => setRole('citizen')}
            >
              Citizen
            </button>
            <button 
              type="button" 
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none', background: role === 'admin' ? '#3a3f5c' : 'transparent', color: role === 'admin' ? 'white' : '#4b5563', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: role === 'admin' ? '0 2px 4px rgba(58, 63, 92, 0.2)' : 'none' }}
              onClick={() => setRole('admin')}
            >
              Department Admin
            </button>
          </div>

          <form className="auth-form">
            {!isLogin && (
              <div className="auth-input-group">
                <input type="text" className="auth-input" placeholder="Full Name" />
              </div>
            )}
            {!isLogin && role === 'citizen' && (
              <>
                <div className="auth-input-group" style={{ paddingRight: '1rem' }}>
                  <select 
                    className="auth-input" 
                    value={stateRegion} 
                    onChange={(e) => setStateRegion(e.target.value)}
                    style={{ color: stateRegion ? '#111827' : '#9ca3af', cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select State</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>
                <div className="auth-input-group">
                  <input 
                    type="text" 
                    className="auth-input" 
                    placeholder="Ward / Sector (e.g. Sector 4)" 
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="auth-input-group">
              <input type="email" className="auth-input" placeholder="Email address" />
            </div>
            <div className="auth-input-group">
              <input type="password" className="auth-input" placeholder="Password" />
            </div>
            {isLogin && <div className="auth-forgot-wrapper"><a href="#" className="auth-forgot">Forgot password?</a></div>}
            
            <button type="button" className="auth-submit-btn" onClick={handleSubmit}>
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="auth-footer-link">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setIsLogin(!isLogin)} className="auth-toggle-link">
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
