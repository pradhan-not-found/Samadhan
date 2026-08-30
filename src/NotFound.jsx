import React, { useEffect, useState } from 'react';
import logoImg from './assets/logo.png';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fafafa',
      fontFamily: "'Inter', 'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', padding: '1rem 2rem',
        backgroundColor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        zIndex: 100,
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#111' }}>
          <img src={logoImg} alt="Samadhan" style={{ height: '28px', filter: 'brightness(0)' }} />
          <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Samadhan</span>
        </a>
      </nav>

      {/* Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        maxWidth: '560px',
      }}>
        {/* Big 404 number */}
        <div style={{
          fontSize: 'clamp(7rem, 20vw, 10rem)',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.05em',
          background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #e2e8f0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          userSelect: 'none',
        }}>
          404
        </div>

        {/* Icon */}
        <div style={{
          width: '64px', height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #6366f115, #8b5cf615)',
          border: '1px solid rgba(99,102,241,0.15)',
          display: 'grid', placeItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="12"/>
            <line x1="11" y1="16" x2="11.01" y2="16"/>
          </svg>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
          fontWeight: 700,
          color: '#111',
          margin: '0 0 0.75rem 0',
          letterSpacing: '-0.02em',
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: '1rem',
          color: '#64748b',
          lineHeight: 1.7,
          margin: '0 0 2rem 0',
        }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to resolving civic issues.
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#111',
            color: '#fff',
            borderRadius: '100px',
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.12)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Go Home
          </a>

          <a href="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: '#111',
            borderRadius: '100px',
            fontWeight: 600,
            fontSize: '0.9rem',
            textDecoration: 'none',
            border: '1.5px solid rgba(0,0,0,0.12)',
            transition: 'border-color 0.2s, background 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.background = 'transparent'; }}
          >
            Dashboard
          </a>
        </div>
      </div>

      {/* Bottom tag */}
      <div style={{
        position: 'fixed', bottom: '1.5rem',
        fontSize: '0.78rem', color: '#94a3b8',
        letterSpacing: '0.03em',
      }}>
        Samadhan · Civic Issue Resolution Platform
      </div>
    </div>
  );
}
