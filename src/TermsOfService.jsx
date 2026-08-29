import React from 'react';
import logoImg from './assets/logo.png';

const TermsOfService = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f6f2', padding: '4rem 2rem', fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#111', fontWeight: 600, fontSize: '1.25rem', marginBottom: '2rem' }}>
          <img src={logoImg} alt="Samadhan" style={{ height: '28px' }} />
          Samadhan
        </a>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', color: '#111' }}>Terms of Service</h1>
        <div style={{ color: '#4b5563', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 style={{ fontSize: '1.5rem', color: '#111', marginTop: '2rem', marginBottom: '1rem' }}>1. Agreement to Terms</h2>
          <p style={{ marginBottom: '1rem' }}>By accessing or using the Samadhan platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          
          <h2 style={{ fontSize: '1.5rem', color: '#111', marginTop: '2rem', marginBottom: '1rem' }}>2. Use of Platform</h2>
          <p style={{ marginBottom: '1rem' }}>You agree to use the Samadhan platform only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the platform. You are responsible for ensuring that any reports or data you submit are accurate and truthful to the best of your knowledge.</p>

          <h2 style={{ fontSize: '1.5rem', color: '#111', marginTop: '2rem', marginBottom: '1rem' }}>3. User Accounts</h2>
          <p style={{ marginBottom: '1rem' }}>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <a href="javascript:history.back()" style={{ color: '#111', fontWeight: 500, textDecoration: 'underline' }}>Go back</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
