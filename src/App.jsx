import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './App.css';
import FeatureCard from './FeatureCard';
import logoImg from './assets/logo.png';
import { featuresData } from './featuresData';
import JoinNow from './JoinNow';
import DashboardUI from './DashboardUI';
import VisionDashboardUI from './VisionDashboardUI';
import GamificationDashboardUI from './GamificationDashboardUI';

function App() {

  return (
    <>
      <nav className="navbar">
        <div className="navbar-pill">
          <div className="nav-logo-container">
            <a href="#" className="logo">
              <img src={logoImg} alt="" className="nav-logo themed-logo" />
              Samadhan
            </a>
          </div>
          
          <div className="nav-links-center">
            <a href="#">Report Issue</a>
            <a href="#">Track Progress</a>
            <a href="#">Leaderboard</a>
          </div>

          <div className="nav-actions">
            <a href="/login" className="btn-primary-pill">Sign in</a>
            <a href="/dashboard" className="btn-dark-pill">View Dashboard</a>
          </div>
        </div>
      </nav>

      <main className="main-wrapper">
        <section className="hero card-page" style={{ '--stack-index': 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '0' }}>
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <div className="hero-content" style={{ padding: '0 2rem' }}>
              <img src="https://assets.sarvam.ai/assets/motifs/ui/motif.svg" alt="" className="hero-motif dark-motif" />
              <div className="hero-subtitle-box">
                <span className="hero-subtitle-text">Community Hero Platform</span>
              </div>
              
              <h1 className="hero-title-centered">Samadhan for all from India</h1>
              <p className="hero-description-centered">
                Built on community collaboration. Powered by intelligent categorization.<br/>
                Delivering hyperlocal problem resolution.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
                <a href="#" className="btn-hero-dark" style={{ padding: '0.8rem 1.8rem', borderRadius: '30px', fontSize: '1rem' }}>Sign up</a>
                <a href="/dashboard" className="btn-hero-light" style={{ padding: '0.8rem 1.8rem', borderRadius: '30px', fontSize: '1rem' }}>Contact Us</a>
              </div>
            </div>
          </div>

          <div className="logo-strip-hero" style={{ width: '100%', padding: '2rem 0', zIndex: 10, backgroundColor: 'transparent' }}>
            <div className="container" style={{ textAlign: 'center' }}>
              <h5 className="logo-strip-title" style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '2rem', fontWeight: 600 }}>
                INDIA BUILDS WITH SAMADHAN
              </h5>
              <div className="logo-marquee-container">
                <div className="logo-marquee">
                  {/* Set 1 */}
                  <img src="/logos/CPGRAMS.png" alt="CPGRAMS" className="trusted-logo" />
                  <img src="/logos/NUDM (National Urban Digital Mission).png" alt="NUDM" className="trusted-logo" />
                  <img src="/logos/jalsakthi.png" alt="Jal Sakthi" className="trusted-logo" />
                  <img src="/logos/ministry of healthcare.png" alt="Ministry of Healthcare" className="trusted-logo" />
                  <img src="/logos/ministry of houssing .png" alt="Ministry of Housing" className="trusted-logo" />
                  <img src="/logos/powermisnister.png" alt="Power Minister" className="trusted-logo" />
                  
                  {/* Set 2 (Duplicate for infinite scroll) */}
                  <img src="/logos/CPGRAMS.png" alt="CPGRAMS" className="trusted-logo" />
                  <img src="/logos/NUDM (National Urban Digital Mission).png" alt="NUDM" className="trusted-logo" />
                  <img src="/logos/jalsakthi.png" alt="Jal Sakthi" className="trusted-logo" />
                  <img src="/logos/ministry of healthcare.png" alt="Ministry of Healthcare" className="trusted-logo" />
                  <img src="/logos/ministry of houssing .png" alt="Ministry of Housing" className="trusted-logo" />
                  <img src="/logos/powermisnister.png" alt="Power Minister" className="trusted-logo" />
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section className="section card-page" style={{ '--stack-index': 2 }}>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: '3rem' }}>
              <h2>AI Platform Dashboard</h2>
              <p className="text-muted">Explore how intelligent automation aids problem solving.</p>
            </div>
            
            {/* Dashboard Container with Edge Glows */}
            <div style={{ position: 'relative' }}>
              {/* Blue glow behind the left side of the dashboard */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '-15%',
                width: '50%',
                height: '150%',
                background: 'radial-gradient(ellipse at center, rgba(140, 165, 255, 0.8) 0%, transparent 70%)',
                transform: 'translateY(-50%)',
                zIndex: -1,
                pointerEvents: 'none',
                filter: 'blur(40px)'
              }} />
              
              {/* Blue glow behind the right side of the dashboard */}
              <div style={{
                position: 'absolute',
                top: '50%',
                right: '-15%',
                width: '50%',
                height: '150%',
                background: 'radial-gradient(ellipse at center, rgba(140, 165, 255, 0.8) 0%, transparent 70%)',
                transform: 'translateY(-50%)',
                zIndex: -1,
                pointerEvents: 'none',
                filter: 'blur(40px)'
              }} />

              <DashboardUI />
            </div>
          </div>
        </section>


        <section className="section card-page" style={{ '--stack-index': 3 }}>
          <div className="container">
            <div style={{ marginBottom: '3rem' }}>
              <h2>Core Features</h2>
              <p className="text-muted">Discover our community-driven tools.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {featuresData.map((feature, idx) => (
                <FeatureCard 
                  key={idx} 
                  title={feature.title} 
                  subtitle={feature.subtitle} 
                  svgString={feature.svg} 
                />
              ))}
            </div>
          </div>
        </section>
      
        <section className="section card-page" style={{ '--stack-index': 4, overflow: 'hidden', position: 'relative' }}>
          <div className="container">
            <div className="grid-section">
              <div className="grid-content">
                <span className="section-number">01</span>
                <h2>The vision: <br/>Transparency & Action</h2>
                <p>
                  Samadhan translates to resolution. Our platform brings citizens and authorities closer to resolve hyperlocal problems efficiently.
                </p>
                <p>
                  Fragmented reporting and untracked issues lead to public distrust. By combining gamification, predictive insights, and AI categorization, Samadhan transforms complaints into accountable community action.
                </p>
              </div>
              <div className="visual-box">
                {/* Empty visual box for layout space and glow */}
              </div>
            </div>
          </div>
          <div className="dash-insert-right">
            <VisionDashboardUI />
          </div>
        </section>

        
        <section className="section card-page" style={{ '--stack-index': 5, overflow: 'hidden', position: 'relative' }}>
          <div className="dash-insert-left">
            <GamificationDashboardUI />
          </div>
          <div className="container">
            <div className="grid-section">
              <div className="visual-box">
                {/* Empty visual box */}
              </div>
              <div className="grid-content">
                <span className="section-number">02</span>
                <h2>Gamification & Tracking</h2>
                <p>
                  Community participation shouldn't be a chore. Through an integrated impact dashboard, users earn reputation points for valid reports and successful verifications.
                </p>
                <p>
                  Real-time tracking provides a transparent window into issue resolution, connecting the digital report with real-world public infrastructure repair.
                </p>
              </div>
            </div>
          </div>
        </section>

        
        
        <section className="section card-page join-now-page" style={{ '--stack-index': 6 }}>
          <div className="container" style={{ height: "100%" }}>
            <JoinNow />
          </div>
        </section>
      
      <footer className="footer card-page" style={{ '--stack-index': 7 }}>
        <div className="footer-glow"></div>
        <div className="container" style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '2rem' }}>
          <div className="footer-grid" style={{ gridTemplateColumns: '2fr repeat(5, 1fr)', gap: '2rem' }}>
            <div className="footer-col">
              <div className="logo" style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                <img src={logoImg} alt="" className="nav-logo themed-logo" />
                Samadhan
              </div>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '2rem' }}>Resolution for India starts here</p>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--color-text)' }}>Products</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <li><a href="#" className="text-muted">Citizen App</a></li>
                <li><a href="#" className="text-muted">AI Dashboard</a></li>
                <li><a href="#" className="text-muted">Impact Tracker</a></li>
                <li><a href="#" className="text-muted">Gov Portal</a></li>
                <li><a href="#" className="text-muted">Data Insights</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--color-text)' }}>APIs</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <li><a href="#" className="text-muted">Issue Detection</a></li>
                <li><a href="#" className="text-muted">Auto-Routing</a></li>
                <li><a href="#" className="text-muted">Image Analysis</a></li>
                <li><a href="#" className="text-muted">Predictive Model</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: '#fff' }}>Developers</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <li><a href="#" className="text-muted">Documentation</a></li>
                <li><a href="#" className="text-muted">API Pricing</a></li>
                <li><a href="#" className="text-muted">Integrations</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: '#fff' }}>Company</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <li><a href="#" className="text-muted">About Us</a></li>
                <li><a href="#" className="text-muted">Careers</a></li>
                <li><a href="#" className="text-muted">Contact Us</a></li>
                <li><a href="#" className="text-muted">Blogs</a></li>
                <li><a href="#" className="text-muted">Trust Center</a></li>
                <li><a href="#" className="text-muted">Terms of Service</a></li>
                <li><a href="#" className="text-muted">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: '#fff' }}>Socials</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <li><a href="#" className="text-muted">LinkedIn</a></li>
                <li><a href="#" className="text-muted">X</a></li>
                <li><a href="#" className="text-muted">YouTube</a></li>
                <li><a href="#" className="text-muted">GitHub</a></li>
                <li><a href="#" className="text-muted">Discord</a></li>
              </ul>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '4rem', paddingTop: '2rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span className="text-muted">© 2026 Samadhan.</span>
              <span className="text-muted">Made by souradeep.me</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span className="text-muted" style={{ opacity: 0.6 }}>GitHub</span>
              <a href="https://github.com/pradhan-not-found/Samadhan" target="_blank" rel="noopener noreferrer" className="text-muted" style={{ textDecoration: 'none' }}>@pradhan-not-found</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span className="text-muted" style={{ opacity: 0.6 }}>License</span>
              <span className="text-muted">All rights reserved.</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span className="text-muted" style={{ opacity: 0.6 }}>Vision</span>
              <span className="text-muted">Building a better India, block by block.</span>
            </div>
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}

export default App;
