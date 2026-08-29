import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './AuthPage.css';
import logoImg from './assets/logo.png';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoFill = () => {
    // Just default to citizen for demo in login
    setEmail('citizen@demo.com');
    setPassword('password123');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      
      const userRole = data.user.user_metadata?.role || 'citizen';
      localStorage.setItem('samadhan_role', userRole);
      window.location.href = '/dashboard';
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
        <a href="/" className="auth-visual-logo" style={{ textDecoration: 'none' }}>
          <img src={logoImg} alt="Samadhan Logo" style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          Samadhan
        </a>
        <div className="auth-visual-content">
          <h2>Building a better India,<br/>block by block.</h2>
          <p>Join the movement to transform public infrastructure through crowdsourced civic reporting and transparent AI tracking.</p>
        </div>
      </div>

      {/* RIGHT FORM PANE */}
      <div className="auth-split-form-container">
        <div className="auth-card">
          <h1 className="auth-title">Sign in to Samadhan</h1>
          <p className="auth-subtitle">Welcome back! Please enter your details.</p>

          {error && (
            <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Work Email</label>
              <div className="auth-input-group">
                <input type="email" className="auth-input" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            
            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-group">
                <input type="password" className="auth-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            
            <div className="auth-forgot-wrapper">
              <a href="#" className="auth-forgot">Forgot password?</a>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="auth-submit-btn" disabled={loading} style={{ flex: 1, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Processing..." : "Sign In"}
              </button>
              <button type="button" className="auth-submit-btn" onClick={handleDemoFill} disabled={loading} style={{ flex: 1, background: 'transparent', color: '#111', border: '1px solid #d1d5db', boxShadow: 'none' }}>
                Use Demo
              </button>
            </div>
          </form>

          <div className="auth-footer-link">
            Don't have an account? <a href="/signup" className="auth-toggle-link" style={{ textDecoration: 'none' }}>Create one</a>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#6b7280', marginTop: '1rem' }}>
            By continuing you agree to our <a href="/terms" style={{ color: '#111827', textDecoration: 'underline' }}>terms of service</a> and <a href="/privacy" style={{ color: '#111827', textDecoration: 'underline' }}>privacy policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
