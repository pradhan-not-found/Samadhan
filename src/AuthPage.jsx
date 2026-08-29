import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './AuthPage.css';
import logoImg from './assets/logo.png';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('citizen');
  const [stateRegion, setStateRegion] = useState('');
  const [ward, setWard] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoFill = () => {
    if (role === 'citizen') {
      setEmail('citizen@demo.com');
      setPassword('password123');
    } else {
      setEmail('admin@demo.com');
      setPassword('admin123');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        
        const userRole = data.user.user_metadata?.role || 'citizen';
        localStorage.setItem('samadhan_role', userRole);
        window.location.href = '/dashboard';
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
              stateRegion: stateRegion || 'West Bengal',
              ward: ward || 'Sector 4',
              full_name: fullName
            }
          }
        });
        if (signUpError) throw signUpError;
        
        if (data.user) {
          // Attempt to upsert profile for public leaderboard/display (fails silently if table doesn't exist yet)
          await supabase.from('user_profiles').upsert({
            id: data.user.id,
            email: email,
            name: fullName,
            role: role,
            state_region: stateRegion || 'West Bengal',
            ward: ward || 'Sector 4',
            impact_points: 0
          }).select().catch(() => {});
        }

        localStorage.setItem('samadhan_role', role);
        if (role === 'citizen') {
          localStorage.setItem('samadhan_state', stateRegion || 'West Bengal');
          localStorage.setItem('samadhan_ward', ward || 'Sector 4');
        }
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      {/* LEFT VISUAL PANE */}
      <div className="auth-split-visual">
        <div className="auth-visual-logo">
          <img src={logoImg} alt="Samadhan Logo" style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          Samadhan
        </div>
        <div className="auth-visual-content">
          <h2>Building a better India,<br/>block by block.</h2>
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

          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: '#ebeae6', padding: '0.25rem', borderRadius: '8px' }}>
            <button 
              type="button" 
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', borderRadius: '6px', border: 'none', background: role === 'citizen' ? '#ffffff' : 'transparent', color: role === 'citizen' ? '#111' : '#666', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', boxShadow: role === 'citizen' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}
              onClick={() => setRole('citizen')}
            >
              Citizen
            </button>
            <button 
              type="button" 
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', borderRadius: '6px', border: 'none', background: role === 'admin' ? '#ffffff' : 'transparent', color: role === 'admin' ? '#111' : '#666', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', boxShadow: role === 'admin' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}
              onClick={() => setRole('admin')}
            >
              Department Admin
            </button>
          </div>

          {error && (
            <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form className="auth-form">
            {!isLogin && (
              <div className="auth-field">
                <label>Full Name</label>
                <div className="auth-input-group">
                  <input type="text" className="auth-input" placeholder="Your name" value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
              </div>
            )}
            {!isLogin && role === 'citizen' && (
              <>
                <div className="auth-field">
                  <label>State / Region</label>
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
                </div>
                <div className="auth-field">
                  <label>Ward / Sector</label>
                  <div className="auth-input-group">
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder="e.g. Sector 4" 
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="auth-field">
              <label>Email address</label>
              <div className="auth-input-group">
                <input type="email" className="auth-input" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-group">
                <input type="password" className="auth-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            {isLogin && <div className="auth-forgot-wrapper"><a href="#" className="auth-forgot">Forgot password?</a></div>}
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" className="auth-submit-btn" onClick={handleSubmit} disabled={loading} style={{ flex: 1, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
              </button>
              {isLogin && (
                <button type="button" className="auth-submit-btn" onClick={handleDemoFill} disabled={loading} style={{ flex: 1, background: 'transparent', color: '#111', border: '1px solid #111', boxShadow: 'none' }}>
                  Use Demo
                </button>
              )}
            </div>
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
