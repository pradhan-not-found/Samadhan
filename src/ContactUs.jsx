import React from 'react';
import './AuthPage.css';
import logoImg from './assets/logo.png';

const ContactUs = () => {
  return (
    <div className="auth-split-layout">
      {/* LEFT VISUAL PANE */}
      <div className="auth-split-visual">
        <div className="auth-visual-content">
          <div className="auth-visual-logo">
            <img src={logoImg} alt="Samadhan Logo" style={{ height: '32px', width: 'auto' }} />
            Samadhan
          </div>
          <h2>Get in Touch with Us</h2>
          <p>We're here to help you resolve issues faster. Contact our support team for any queries regarding the Samadhan platform.</p>
        </div>
      </div>

      {/* RIGHT FORM PANE */}
      <div className="auth-split-form-container">
        <div className="auth-card">
          <a href="/" className="auth-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to home
          </a>
          
          <h1 className="auth-title">Contact Support</h1>
          <p className="auth-subtitle">Fill out the form below and we'll get back to you shortly.</p>

          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); window.location.href = "/"; }}>
            <div className="auth-input-group">
              <input type="text" className="auth-input" placeholder="Full Name" required />
            </div>
            <div className="auth-input-group">
              <input type="email" className="auth-input" placeholder="Email address" required />
            </div>
            <div className="auth-input-group">
              <textarea className="auth-input" placeholder="Your Message" rows="5" style={{ resize: 'none', paddingTop: '0.8rem' }} required></textarea>
            </div>
            
            <button type="submit" className="auth-submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
