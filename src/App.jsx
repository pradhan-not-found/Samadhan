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
      
      </main>

      <footer className="footer card-page" style={{ '--stack-index': 7 }}>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="logo" style={{ marginBottom: '1.5rem' }}>
                <img src={logoImg} alt="" className="nav-logo" />
                Samadhan
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>Community Hero Project.</p>
            </div>
            <div className="footer-col">
              <h4>Features</h4>
              <ul>
                <li><a href="#">Issue Reporting</a></li>
                <li><a href="#">AI Categorization</a></li>
                <li><a href="#">Impact Dashboards</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>About</h4>
              <ul>
                <li><a href="#">How it Works</a></li>
                <li><a href="#">Community Guidelines</a></li>
                <li><a href="#">Contact Support</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
