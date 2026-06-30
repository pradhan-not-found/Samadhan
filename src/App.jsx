import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './App.css';
import FeatureCard from './FeatureCard';
import logoImg from './assets/logo.png';
import { featuresData } from './featuresData';
import JoinNow from './JoinNow';
import DashboardUI from './DashboardUI';

function App() {
  return (
    <>
      <nav className="navbar">
        <div className="container">
          <a href="#" className="logo">
            <img src={logoImg} alt="" className="nav-logo" />
            Samadhan
          </a>
          <div className="nav-links">
            <a href="#">Report Issue</a>
            <a href="#">Track Progress</a>
            <a href="#">Leaderboard</a>
            <a href="#" className="text-gradient">Sign in</a>
          </div>
        </div>
      </nav>

      <main className="main-wrapper">
        <section className="hero card-page" style={{ '--stack-index': 1 }}>
          <div className="hero-glow"></div>
          
          <div className="hero-content">
            <img src="https://assets.sarvam.ai/assets/motifs/ui/motif.svg" alt="" className="hero-motif dark-motif" />
            <div className="hero-small-text-wrapper">
              <div className="hero-line-dark"></div>
              <p className="hero-small-text-dark">Community Hero Platform</p>
              <div className="hero-line-dark"></div>
            </div>
            
            <h1 className="hero-title-centered">Samadhan for all from India</h1>
            <p className="hero-description-centered">
              Built on community collaboration. Powered by intelligent categorization.<br/>
              Delivering hyperlocal problem resolution.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <a href="#" className="btn btn-primary">Sign up</a>
              <a href="#" className="btn btn-secondary">Contact Us</a>
            </div>
          </div>
        </section>

        
        <section className="section card-page" style={{ '--stack-index': 2 }}>
          <div className="container">
            <div style={{ marginBottom: '3rem' }}>
              <h2>AI Platform Dashboard</h2>
              <p className="text-muted">Explore how intelligent automation aids problem solving.</p>
            </div>
            <DashboardUI />
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
      
        <section className="section card-page" style={{ '--stack-index': 4 }}>
          <div className="container">
            <div className="grid-section">
              <div className="grid-content">
                <h2>The vision: <br/>Transparency & Action</h2>
                <p>
                  Samadhan translates to resolution. Our platform brings citizens and authorities closer to resolve hyperlocal problems efficiently.
                </p>
                <p>
                  Fragmented reporting and untracked issues lead to public distrust. By combining gamification, predictive insights, and AI categorization, Samadhan transforms complaints into accountable community action.
                </p>
              </div>
              <div className="visual-box">
                <div className="monogram" style={{ transform: 'scale(4)' }}>
                  <div className="monogram-circle"></div>
                  <div className="monogram-circle"></div>
                  <div className="monogram-circle"></div>
                  <div className="monogram-circle"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section className="section card-page" style={{ '--stack-index': 5 }}>
          <div className="container">
            <div className="grid-section">
              <div className="visual-box">
                <div className="gateway-graphic"></div>
              </div>
              <div className="grid-content">
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
                <img src={logoImg} alt="" className="nav-logo" />
                Samadhan
              </div>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '2rem' }}>Resolution for India starts here</p>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: '#fff' }}>Products</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <li><a href="#" className="text-muted">Citizen App</a></li>
                <li><a href="#" className="text-muted">AI Dashboard</a></li>
                <li><a href="#" className="text-muted">Impact Tracker</a></li>
                <li><a href="#" className="text-muted">Gov Portal</a></li>
                <li><a href="#" className="text-muted">Data Insights</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: '#fff' }}>APIs</h4>
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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto', paddingTop: '2rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">© 2026 Samadhan. All rights reserved.</span>
              <span className="text-muted" style={{ textAlign: 'right' }}>Building a better India, block by block.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <span className="text-muted" style={{ opacity: 0.7 }}>Made by souradeep.me</span>
            </div>
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}

export default App;
