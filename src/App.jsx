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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    const heroElement = document.querySelector('.hero');
    if (heroElement) observer.observe(heroElement);
    
    return () => {
      if (heroElement) observer.unobserve(heroElement);
    };
  }, []);

  return (
    <>
      <nav className={`navbar-flat ${scrolled ? 'scrolled' : ''}`}>
        <div className={`navbar-inner ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="nav-logo-container">
            <a href="#" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#111', fontWeight: 'bold', fontSize: '1.6rem', textDecoration: 'none' }}>
              <img src={logoImg} alt="" className="nav-logo" style={{ height: '34px', width: 'auto', objectFit: 'contain', filter: 'brightness(0)' }} />
              samadhan
            </a>
          </div>
          
          <div className={`nav-links-center ${isMobileMenuOpen ? 'show' : ''}`}>
            <a href="#">Report Issue</a>
            <a href="#">Track Progress</a>
            <a href="#">Leaderboard</a>
          </div>

          <div className={`nav-actions desktop-only`}>
            <a href="/login" className="btn-hero-dark" style={{borderRadius: '999px', padding: '0.4rem 1.25rem', fontSize: '0.85rem', whiteSpace: 'nowrap'}}>Sign In</a>
            <a href="/dashboard" className="btn-hero-light" style={{borderRadius: '999px', padding: '0.4rem 1.25rem', fontSize: '0.85rem', background: '#f5f5f5', color: '#111', border: 'none', boxShadow: 'none', whiteSpace: 'nowrap'}}>View Dashboard</a>
          </div>

          <div className="mobile-actions">
            <a href="/login" className="btn-hero-dark" style={{borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap', textDecoration: 'none'}}>Sign In</a>
            <a href="/dashboard" className="btn-hero-light" style={{borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.8rem', background: '#f5f5f5', color: '#111', border: 'none', boxShadow: 'none', whiteSpace: 'nowrap', textDecoration: 'none'}}>View Dashboard</a>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: '#111', display: 'flex', alignItems: 'center', marginLeft: '0.25rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {isMobileMenuOpen ? (
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                )}
                {isMobileMenuOpen && <line x1="6" y1="6" x2="18" y2="18"></line>}
              </svg>
            </button>
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
              
              <h1 className="hero-title-centered" style={{ whiteSpace: 'nowrap', fontSize: 'clamp(2rem, 4vw, 4rem)' }}>Empowering the civic revolutionary</h1>
              <p className="hero-description-centered">
                Built on community collaboration. Powered by intelligent categorization. Delivering hyperlocal problem resolution.
              </p>
              
              <div className="hero-actions-wrapper">
                <a href="/login" className="btn-hero-dark" style={{ padding: '0.8rem 1.8rem', borderRadius: '30px', fontSize: '1rem' }}>Sign up</a>
                <a href="/contact" className="btn-hero-light" style={{ padding: '0.8rem 1.8rem', borderRadius: '30px', fontSize: '1rem' }}>Contact Us</a>
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
            <div className="features-grid">
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
            <div className="grid-section" style={{ alignItems: 'center', gap: '4rem' }}>
              <div className="grid-content">
                <span className="section-number">01</span>
                <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: '600' }}>The vision: <br/>Transparency & Action</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Samadhan translates to resolution. Our platform brings citizens and authorities closer to resolve hyperlocal problems efficiently.
                </p>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                  Fragmented reporting and untracked issues lead to public distrust. By combining gamification, predictive insights, and AI categorization, Samadhan transforms complaints into accountable community action.
                </p>
              </div>
              <div className="visual-box" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                aspectRatio: '1', /* Keep it a square box for the glow */
              }}>
                {/* Purple glowing background exactly like the GIF */}
                <div style={{
                  position: 'absolute',
                  width: '120%',
                  height: '120%',
                  background: 'radial-gradient(circle at center, rgba(124, 136, 255, 0.4) 0%, rgba(181, 175, 255, 0.15) 40%, transparent 70%)',
                  filter: 'blur(40px)',
                  zIndex: 0
                }}></div>
                
                {/* Scaled container to prevent text squishing */}
                <div style={{ 
                  position: 'relative', 
                  zIndex: 1, 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'center' 
                }}>
                  <div style={{ 
                    width: '150%', /* Render at 150% width (e.g. 750px instead of 500px) */
                    transform: 'scale(0.666)', /* Scale it back down visually to fit 100% */
                    transformOrigin: 'center center'
                  }}>
                    <VisionDashboardUI />
                  </div>
                </div>
              </div>
            </div>
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
        <div className="container" style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '2rem' }}>
          <div className="footer-grid">
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="logo" style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={logoImg} alt="" className="nav-logo" style={{ filter: 'brightness(0)' }} />
                Samadhan
              </div>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '2rem' }}>Resolution for India starts here</p>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Find us at</div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <a href="#" className="text-muted"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                <a href="#" className="text-muted"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg></a>
                <a href="#" className="text-muted"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
                <a href="#" className="text-muted"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <div style={{ marginBottom: '0.5rem' }}>© 2026 Samadhan.</div>
                <div style={{ marginBottom: '0.5rem' }}>
                  Built by <a href="https://github.com/pradhan-not-found/Samadhan" target="_blank" rel="noopener noreferrer" style={{color: 'var(--color-text)', fontWeight: 'bold', textDecoration: 'none'}}>@pradhan-not-found</a>
                </div>
                <div style={{ lineHeight: 1.6, opacity: 0.8 }}>
                  Civic Innovation Hub<br/>Kolkata, India
                </div>
              </div>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--color-text)', fontWeight: 600 }}>Products</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', listStyle: 'none' }}>
                <li><a href="#" className="text-muted">Citizen App</a></li>
                <li><a href="#" className="text-muted">AI Dashboard</a></li>
                <li><a href="#" className="text-muted">Impact Tracker</a></li>
                <li><a href="#" className="text-muted">Gov Portal</a></li>
                <li><a href="#" className="text-muted">Data Insights</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--color-text)', fontWeight: 600 }}>APIs</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', listStyle: 'none' }}>
                <li><a href="#" className="text-muted">Issue Detection</a></li>
                <li><a href="#" className="text-muted">Auto-Routing</a></li>
                <li><a href="#" className="text-muted">Image Analysis</a></li>
                <li><a href="#" className="text-muted">Predictive Model</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--color-text)', fontWeight: 600 }}>Resources</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', listStyle: 'none' }}>
                <li><a href="#" className="text-muted">Documentation</a></li>
                <li><a href="#" className="text-muted">API Pricing</a></li>
                <li><a href="#" className="text-muted">Integrations</a></li>
                <li><a href="#" className="text-muted">Customer Stories</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--color-text)', fontWeight: 600 }}>Company</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', listStyle: 'none' }}>
                <li><a href="/about" className="text-muted">About Us</a></li>
                <li><a href="/careers" className="text-muted">Careers</a></li>
                <li><a href="/contact" className="text-muted">Contact Us</a></li>
                <li><a href="/blogs" className="text-muted">Blogs</a></li>
                <li><a href="#" className="text-muted">Brand Guidelines</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--color-text)', fontWeight: 600 }}>Legal</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', listStyle: 'none' }}>
                <li><a href="/trust" className="text-muted">Trust Center</a></li>
                <li><a href="/terms" className="text-muted">Terms of Service</a></li>
                <li><a href="/privacy" className="text-muted">Privacy Policy</a></li>
                <li><a href="#" className="text-muted">EULA</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-massive-logo-wrapper">
            <div className="footer-massive-logo layer-1">samadhan</div>
            <div className="footer-massive-logo layer-2">samadhan</div>
            <div className="footer-massive-logo layer-3">samadhan</div>
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}

export default App;
