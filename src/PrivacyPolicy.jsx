import React from 'react';
import logoImg from './assets/logo.png';

const PrivacyPolicy = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f6f2', padding: '4rem 2rem', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#111', fontWeight: 600, fontSize: '1.25rem', marginBottom: '2rem' }}>
          <img src={logoImg} alt="Samadhan" style={{ height: '28px' }} />
          Samadhan
        </a>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', color: '#111' }}>Privacy Policy</h1>
        <div style={{ color: '#4b5563', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 style={{ fontSize: '1.5rem', color: '#111', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: '1rem' }}>We collect information you provide directly to us, such as your name, email address, role, state, and ward when you register for an account. We also collect data related to the civic reports you submit, including location data and media files.</p>
          
          <h2 style={{ fontSize: '1.5rem', color: '#111', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Information</h2>
          <p style={{ marginBottom: '1rem' }}>The information we collect is used to facilitate civic reporting, route issues to appropriate department administrators, maintain user leaderboards, and improve the overall functionality of the Samadhan platform. Your public profile may display your name and impact points.</p>

          <h2 style={{ fontSize: '1.5rem', color: '#111', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Security</h2>
          <p style={{ marginBottom: '1rem' }}>We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.</p>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <a href="javascript:history.back()" style={{ color: '#111', fontWeight: 500, textDecoration: 'underline' }}>Go back</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
