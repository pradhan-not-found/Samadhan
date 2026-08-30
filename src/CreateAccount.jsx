import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './CreateAccount.css';
import logoImg from './assets/logo.png';

const CreateAccount = () => {
  const [role, setRole] = useState('citizen');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [ward, setWard] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      if (!fullName) throw new Error("Name is required");

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
          impact_score: 0
        }).select();
      }

      window.location.href = '/dashboard';
    } catch (err) {
      if (err.message?.toLowerCase().includes('already registered') || err.message?.toLowerCase().includes('already exists')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (err.message?.toLowerCase().includes('rate limit')) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const totalFields = role === 'citizen' ? 6 : 4;
  let filledFields = 0;
  if (firstName.trim()) filledFields++;
  if (lastName.trim()) filledFields++;
  if (email.trim()) filledFields++;
  if (password.trim()) filledFields++;
  if (role === 'citizen') {
    if (stateRegion.trim()) filledFields++;
    if (ward.trim()) filledFields++;
  }
  
  const progressPercentage = (filledFields / totalFields) * 100;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="ca-split-layout">
      {/* LEFT VISUAL PANE */}
      <div className="ca-split-visual">
        <a href="/" className="ca-visual-logo" style={{ textDecoration: 'none' }}>
          <img src={logoImg} alt="Samadhan Logo" style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          Samadhan
        </a>
        <div className="ca-visual-content">
          <h2>Building a better India,<br/>block by block.</h2>
          <p>Join the movement to transform public infrastructure through crowdsourced civic reporting and transparent AI tracking.</p>
        </div>
      </div>

      {/* RIGHT FORM PANE */}
      <div className="ca-split-form-container" style={{ position: 'relative' }}>
        {/* PROGRESS RING */}
        <div className="ca-progress-container">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth="3" />
            <circle 
              className="ca-progress-ring-circle"
              cx="20" 
              cy="20" 
              r={radius} 
              fill="transparent" 
              stroke="#111827" 
              strokeWidth="3" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="ca-card">
          <h1 className="ca-title">Let's start with you</h1>

          {error && (
            <div style={{ padding: '0.75rem', marginBottom: '1.5rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form className="ca-form-grid" onSubmit={handleSubmit}>
            {/* ROW 1 */}
            <div className="ca-field">
              <label>First Name <span style={{color: '#ef4444'}}>*</span></label>
              <div className="ca-input-group">
                <input type="text" className="ca-input" placeholder="e.g. Arjun" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
            </div>
            <div className="ca-field">
              <label>Last Name <span style={{color: '#ef4444'}}>*</span></label>
              <div className="ca-input-group">
                <input type="text" className="ca-input" placeholder="e.g. Sharma" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>

            {/* ROW 2 */}
            <div className="ca-field">
              <label>Email <span style={{color: '#ef4444'}}>*</span></label>
              <div className="ca-input-group">
                <input type="email" className="ca-input" placeholder="arjun@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="ca-field">
              <label>Password <span style={{color: '#ef4444'}}>*</span></label>
              <div className="ca-input-group">
                <input type="password" className="ca-input" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            {/* ROW 3 */}
            <div className="ca-field">
              <label>State / Region <span style={{color: '#ef4444'}}>*</span></label>
              <div className="ca-input-group">
                <select 
                  className="ca-input" 
                  value={stateRegion} 
                  onChange={(e) => setStateRegion(e.target.value)}
                  style={{ color: stateRegion ? '#111827' : '#9ca3af', cursor: 'pointer', appearance: 'none' }}
                  required
                >
                  <option value="" disabled>Select State</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
            </div>
            <div className="ca-field">
              <label>Ward / Sector <span style={{color: '#ef4444'}}>*</span></label>
              <div className="ca-input-group">
                <input 
                  type="text" 
                  className="ca-input" 
                  placeholder="e.g. Sector 4" 
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ROW 4 */}
            <div className="ca-field ca-full-width">
              <label>Role / Title <span style={{color: '#ef4444'}}>*</span></label>
              <div style={{ display: 'flex', gap: '0.5rem', background: '#f3f4f6', padding: '0.375rem', borderRadius: '12px', height: '56px', alignItems: 'center' }}>
                <button 
                  type="button" 
                  style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem', borderRadius: '8px', border: 'none', background: role === 'citizen' ? '#ffffff' : 'transparent', color: role === 'citizen' ? '#111' : '#6b7280', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: role === 'citizen' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                  onClick={() => setRole('citizen')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <polyline points="16 11 18 13 22 9" />
                  </svg>
                  Citizen
                </button>
                <button 
                  type="button" 
                  style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem', borderRadius: '8px', border: 'none', background: role === 'admin' ? '#ffffff' : 'transparent', color: role === 'admin' ? '#111' : '#6b7280', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: role === 'admin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                  onClick={() => setRole('admin')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18"></path>
                    <path d="M9 8h1"></path>
                    <path d="M9 12h1"></path>
                    <path d="M9 16h1"></path>
                    <path d="M14 8h1"></path>
                    <path d="M14 12h1"></path>
                    <path d="M14 16h1"></path>
                    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                  </svg>
                  Department Admin
                </button>
              </div>
            </div>

            <div className="ca-full-width" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="ca-submit-btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1, padding: '0.8rem 2rem', margin: 0, width: 'auto', whiteSpace: 'nowrap' }}>
                {loading ? "Processing..." : "Continue >"}
              </button>
            </div>

          </form>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', marginTop: '1rem' }}>
            Already have an account? <a href="/login" style={{ color: '#111', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '2px' }}>Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
