import React, { useEffect, useRef } from 'react';
import './App.css';
import FeatureCard from './FeatureCard';
import { featuresData } from './featuresData';

function App() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.style.opacity = 1;
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      el.style.opacity = 0;
      sectionsRef.current.push(el);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <a href="#" className="logo">
            <div className="monogram">
              <div className="monogram-circle"></div>
              <div className="monogram-circle"></div>
              <div className="monogram-circle"></div>
              <div className="monogram-circle"></div>
            </div>
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

      <main>
        <section className="hero container" ref={addToRefs}>
          <img src="https://assets.sarvam.ai/assets/pages/home/hero-gradient.svg" alt="" className="hero-gradient-bg" />
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

        <section className="section container" ref={addToRefs}>
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
        </section>

        <section className="section container" ref={addToRefs}>
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
        </section>

        <section className="section container" ref={addToRefs}>
          <div style={{ marginBottom: '3rem' }}>
            <h2>Core Features</h2>
            <p className="text-muted">Explore how intelligent automation aids problem solving.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {featuresData.map((feature, idx) => (
              <FeatureCard 
                key={idx} 
                title={feature.title} 
                subtitle={feature.subtitle} 
                svgString={feature.svg} 
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="logo" style={{ marginBottom: '1.5rem' }}>
              <div className="monogram">
                <div className="monogram-circle"></div>
                <div className="monogram-circle"></div>
                <div className="monogram-circle"></div>
                <div className="monogram-circle"></div>
              </div>
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
      </footer>
    </>
  );
}

export default App;
