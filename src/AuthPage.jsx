import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './AuthPage.css';
import logoImg from './assets/logo.png';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleDemoFill = () => {
    // Just default to citizen for demo in login
    setEmail('citizen@demo.com');
    setPassword('password123');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please enter your work email to reset your password.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (error) throw error;
      setMessage('Password reset link sent to your email.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      
      const userRole = data.user.user_metadata?.role || 'citizen';
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

          {message && (
            <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500 }}>
              {message}
            </div>
          )}
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
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button 
                  type="button" 
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="auth-forgot-wrapper">
              <a href="#" className="auth-forgot" onClick={handleForgotPassword}>Forgot password?</a>
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
