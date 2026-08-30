import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './App.css';
import { supabase } from './supabaseClient';
import FeatureCard from './FeatureCard';
import logoImg from './assets/logo.png';
import { featuresData } from './featuresData';
import DashboardUI from './DashboardUI';
import VisionDashboardUI from './VisionDashboardUI';
import GamificationDashboardUI from './GamificationDashboardUI';
import JoinNow from './JoinNow';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      setShowCookies(true);
    }
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase.from('user_profiles').select('avatar_url, name, role').eq('email', session.user.email).single();
        if (profile) setUserProfile({ ...profile, email: session.user.email });
        else setUserProfile({ email: session.user.email, role: 'citizen', name: 'User' });
      }
    };
    fetchSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };


  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getDefaultAvatar = (str = 'User') => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const avatars = ['/avatars/grad-blue.png', '/avatars/grad-green.png', '/avatars/grad-red.png'];
    return avatars[Math.abs(hash) % avatars.length];
  };

  return (
    <>
      <nav className={`navbar-flat ${scrolled ? 'scrolled' : ''}`}>
        <div className={`navbar-inner ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="nav-logo-container">
            <a href="#" className="logo">
              <img src={logoImg} alt="" className="nav-logo" />
              Samadhan
            </a>
          </div>
          
          <div className={`nav-links-center ${isMobileMenuOpen ? 'show' : ''}`}>
            <a href="#">Report Issue</a>
            <a href="#">Track Progress</a>
            <a href="#">Leaderboard</a>
          </div>

          <div className={`nav-actions desktop-only`}>
            {userProfile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                <a href="/dashboard" className="btn-hero-dark" style={{ padding: '0.5rem 1.3rem', fontSize: '0.85rem', borderRadius: '999px', backgroundColor: '#23273b' }}>Dashboard</a>
                <div 
                  className="profile-dropdown-container" 
                  style={{ position: 'relative', cursor: 'pointer' }}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                    <img src={userProfile.avatar_url || getDefaultAvatar(userProfile.name)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  {showDropdown && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '0.5rem 0', minWidth: '150px' }}>
                      <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#111', fontWeight: 600 }}>{userProfile.name}</div>
                      <a href="/dashboard" style={{ display: 'block', padding: '0.5rem 1rem', color: '#4b5563', textDecoration: 'none', fontSize: '0.85rem' }}>Dashboard</a>
                      <div onClick={handleLogout} style={{ display: 'block', padding: '0.5rem 1rem', color: '#ef4444', textDecoration: 'none', fontSize: '0.85rem', cursor: 'pointer' }}>Logout</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <a href="/login" className="btn-hero-dark" style={{ padding: '0.5rem 1.3rem', fontSize: '0.85rem', borderRadius: '999px', backgroundColor: '#23273b' }}>Sign In</a>
                <a href="/contact" className="btn-hero-light" style={{ padding: '0.5rem 1.3rem', fontSize: '0.85rem', borderRadius: '999px' }}>Contact Us</a>
              </>
            )}
          </div>

          <div className="mobile-actions">
            {userProfile ? (
              <>
                <a href="/dashboard" className="btn-hero-dark" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '999px' }}>Dashboard</a>
                <div onClick={handleLogout} className="btn-hero-light" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '999px', cursor: 'pointer' }}>Logout</div>
              </>
            ) : (
              <>
                <a href="/login" className="btn-hero-dark" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '999px' }}>Sign In</a>
                <a href="/contact" className="btn-hero-light" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: '999px' }}>Contact Us</a>
              </>
            )}
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.05', fontWeight: '700', fontFamily: 'var(--font-display, sans-serif)', letterSpacing: '-0.03em', marginBottom: '0.5rem', color: '#111' }}>
                The AI Platform<br/>India Builds On
              </h2>
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
            <div className="grid-section" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'stretch', gap: '4rem' }}>
              
              {/* Dashboard Wrapper with exact classes provided by user, converted to inline styles */}
              <div style={{ 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                borderRadius: '24px',
                minHeight: '580px',
                overflow: 'hidden',
                background: 'linear-gradient(to bottom, #13121e 0%, #a5bbfc 116.55%)' 
              }}>
                <div style={{
                  width: '85%',
                  height: '550px',
                  background: 'white',
                  borderRadius: '16px 16px 0 0',
                  overflow: 'hidden',
                  boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <VisionDashboardUI />
                </div>
              </div>

              <div className="grid-content">
                <span className="section-number">01</span>
                <h2 style={{ fontSize: 'clamp(2.5rem, 3.5vw, 3rem)', lineHeight: '1.1', marginBottom: '2.5rem', fontWeight: '600' }}>The vision: Transparency & Action</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="sparkleGrad1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#a3e635"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
                        </defs>
                        <path d="M12 2C12 7.52 16.48 12 22 12C16.48 12 12 16.48 12 22C12 16.48 7.52 12 2 12C7.52 12 12 7.52 12 2Z" fill="url(#sparkleGrad1)"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Hyperlocal Resolution</h4>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>Our platform brings citizens and authorities closer to resolve problems efficiently.</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C12 7.52 16.48 12 22 12C16.48 12 12 16.48 12 22C12 16.48 7.52 12 2 12C7.52 12 12 7.52 12 2Z" fill="url(#sparkleGrad1)"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Rebuilding Trust</h4>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>Fragmented reporting and untracked issues lead to public distrust. We fix that.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C12 7.52 16.48 12 22 12C16.48 12 12 16.48 12 22C12 16.48 7.52 12 2 12C7.52 12 12 7.52 12 2Z" fill="url(#sparkleGrad1)"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Accountable Action</h4>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>By combining gamification and AI categorization, Samadhan transforms complaints into community action.</p>
                    </div>
                  </div>
                </div>

                <a href="/login" className="btn-hero-dark" style={{ 
                  display: 'inline-flex', 
                  width: '100%',
                  justifyContent: 'center', 
                  padding: '1rem 3rem', 
                  fontSize: '1rem', 
                  borderRadius: '12px',
                  backgroundColor: '#1e293b',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  Explore Vision
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section card-page" style={{ '--stack-index': 5, overflow: 'hidden', position: 'relative' }}>
          <div className="container">
            <div className="grid-section" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'stretch', gap: '4rem' }}>
              <div className="grid-content">
                <span className="section-number">02</span>
                <h2 style={{ fontSize: 'clamp(2.5rem, 3.5vw, 3rem)', lineHeight: '1.1', marginBottom: '2.5rem', fontWeight: '600' }}>Gamification & Tracking</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C12 7.52 16.48 12 22 12C16.48 12 12 16.48 12 22C12 16.48 7.52 12 2 12C7.52 12 12 7.52 12 2Z" fill="url(#sparkleGrad1)"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Rewarding Participation</h4>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>Earn reputation points, badges, and recognition for valid reports and successful verifications.</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C12 7.52 16.48 12 22 12C16.48 12 12 16.48 12 22C12 16.48 7.52 12 2 12C7.52 12 12 7.52 12 2Z" fill="url(#sparkleGrad1)"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Transparent Tracking</h4>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>A real-time transparent window into issue resolution progress from reporting to fixing.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C12 7.52 16.48 12 22 12C16.48 12 12 16.48 12 22C12 16.48 7.52 12 2 12C7.52 12 12 7.52 12 2Z" fill="url(#sparkleGrad1)"/>
                      </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Community Leaderboards</h4>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>Compete alongside neighbors to become a top civic guardian and track your community's overall impact.</p>
                    </div>
                  </div>
                </div>

                <a href="/login" className="btn-hero-dark" style={{ 
                  display: 'inline-flex', 
                  width: '100%',
                  justifyContent: 'center', 
                  padding: '1rem 3rem', 
                  fontSize: '1rem', 
                  borderRadius: '12px',
                  backgroundColor: '#1e293b',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  Join the Movement
                </a>
              </div>

              {/* Dashboard Wrapper with exact classes provided by user, converted to inline styles */}
              <div style={{ 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                borderRadius: '24px',
                minHeight: '580px',
                overflow: 'hidden',
                background: 'linear-gradient(to bottom, #13121e 0%, #a5bbfc 116.55%)' 
              }}>
                <div style={{
                  width: '85%',
                  height: '550px',
                  background: 'white',
                  borderRadius: '16px 16px 0 0',
                  overflow: 'hidden',
                  boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <GamificationDashboardUI />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section card-page" style={{ '--stack-index': 6, background: 'var(--color-bg)', padding: 0 }}>
          <div className="testimonials-section">
            <h2 className="testimonials-title">What citizens are saying</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-avatar" style={{ backgroundImage: 'url(https://ui-avatars.com/api/?name=Rahul+S&background=e2e8f0&color=334155&bold=true)' }}></div>
                <div className="testimonial-text">"I've been complaining about the massive pothole on EM Bypass for three months. It’s a severe safety hazard, but no one from the municipality has even acknowledged the issue."</div>
                <div className="testimonial-author">Rahul S., Kolkata</div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-avatar" style={{ backgroundImage: 'url(https://ui-avatars.com/api/?name=Priya+M&background=e2e8f0&color=334155&bold=true)' }}></div>
                <div className="testimonial-text">"The streetlights in Sector 4 have been out for weeks. I filed a report on the official portal, but it just says 'Pending' with no timeline or updates on resolution."</div>
                <div className="testimonial-author">Priya M., Delhi</div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-avatar" style={{ backgroundImage: 'url(https://ui-avatars.com/api/?name=Anil+K&background=e2e8f0&color=334155&bold=true)' }}></div>
                <div className="testimonial-text">"We have a huge garbage dump accumulating near the local school. I've tweeted, emailed, and called the authorities, but the issue hasn't been resolved yet."</div>
                <div className="testimonial-author">Anil K., Mumbai</div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-avatar" style={{ backgroundImage: 'url(https://ui-avatars.com/api/?name=Sneha+R&background=e2e8f0&color=334155&bold=true)' }}></div>
                <div className="testimonial-text">"Waterlogging during the monsoon is getting worse every year. We submit complaints, but there's absolutely no transparency on whether any action is actually being taken."</div>
                <div className="testimonial-author">Sneha R., Chennai</div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-avatar" style={{ backgroundImage: 'url(https://ui-avatars.com/api/?name=Vikram+T&background=e2e8f0&color=334155&bold=true)' }}></div>
                <div className="testimonial-text">"There's a broken water pipe wasting hundreds of liters of water in our neighborhood. I complained weeks ago, but the authorities still haven't sent anyone."</div>
                <div className="testimonial-author">Vikram T., Bangalore</div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-avatar" style={{ backgroundImage: 'url(https://ui-avatars.com/api/?name=Meera+D&background=e2e8f0&color=334155&bold=true)' }}></div>
                <div className="testimonial-text">"I feel completely unheard. I filed a grievance about illegal encroachment on the footpath, but my complaint was closed without any actual resolution on the ground."</div>
                <div className="testimonial-author">Meera D., Pune</div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section card-page join-now-page" style={{ '--stack-index': 7 }}>
          <div className="container" style={{ height: "100%" }}>
            <JoinNow />
          </div>
        </section>
      
      <footer className="footer card-page" style={{ '--stack-index': 7 }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '2rem' }}>
          <div className="footer-grid">
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="logo" style={{ marginBottom: '0.5rem', fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#111' }}>
                <img src={logoImg} alt="" className="nav-logo" style={{ filter: 'brightness(0)', height: '28px' }} />
                Samadhan
              </div>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '2rem', lineHeight: 1.5 }}>Resolution for India starts here</p>

              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', marginBottom: '0.75rem', fontWeight: 600 }}>Find us at</div>
              <div style={{ display: 'flex', gap: '0.9rem', marginBottom: '2.5rem', color: '#6b7280' }}>
                <a href="#" style={{ color: '#6b7280', transition: 'color 0.15s' }} onMouseEnter={e=>e.target.style.color='#111'} onMouseLeave={e=>e.target.style.color='#6b7280'}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                <a href="#" style={{ color: '#6b7280', transition: 'color 0.15s' }} onMouseEnter={e=>e.target.style.color='#111'} onMouseLeave={e=>e.target.style.color='#6b7280'}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l11.733 16h4.267l-11.733-16z"></path><path d="M4 20l6.768-6.768m2.46-2.46l6.772-6.772"></path></svg></a>
                <a href="#" style={{ color: '#6b7280', transition: 'color 0.15s' }} onMouseEnter={e=>e.target.style.color='#111'} onMouseLeave={e=>e.target.style.color='#6b7280'}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
                <a href="#" style={{ color: '#6b7280', transition: 'color 0.15s' }} onMouseEnter={e=>e.target.style.color='#111'} onMouseLeave={e=>e.target.style.color='#6b7280'}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#9ca3af', lineHeight: 1.7 }}>
                <div style={{ marginBottom: '0.3rem' }}>© 2026 Samadhan. All rights reserved.</div>
                <div style={{ marginBottom: '0.3rem' }}>
                  Built by <a href="https://github.com/pradhan-not-found/Samadhan" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>@pradhan-not-found</a>
                </div>
                <div>Civic Innovation Hub, Kolkata, India</div>
              </div>
            </div>
            
            <div className="footer-col">
              <h4>Products</h4>
              <ul>
                <li><a href="#">Citizen App</a></li>
                <li><a href="#">AI Dashboard</a></li>
                <li><a href="#">Impact Tracker</a></li>
                <li><a href="#">Gov Portal</a></li>
                <li><a href="#">Data Insights</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>APIs</h4>
              <ul>
                <li><a href="#">Issue Detection</a></li>
                <li><a href="#">Auto-Routing</a></li>
                <li><a href="#">Image Analysis</a></li>
                <li><a href="#">Predictive Model</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API Pricing</a></li>
                <li><a href="#">Integrations</a></li>
                <li><a href="#">Customer Stories</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/blogs">Blogs</a></li>
                <li><a href="#">Brand Guidelines</a></li>
              </ul>
            </div>
            
            <div className="footer-col legal-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="/trust">Trust Center</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="#">EULA</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-massive-logo-wrapper">
            <div className="footer-massive-logo">samadhan</div>
          </div>
        </div>
      </footer>
      
        {showCookies && (
          <div className="cookie-banner-wrapper animate-fade-in-up">
            <div className="cookie-banner">
              <div className="cookie-dot-matrix"></div>
              <div className="cookie-content">
                <p>We use cookies to keep you signed in. By continuing to use SAMADHAN, you agree to our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Services</a>.</p>
              </div>
              <div className="cookie-footer">
                <span className="cookie-brand">
                  <img src={logoImg} alt="" style={{ height: '20px', width: 'auto', filter: 'grayscale(1) opacity(0.6)' }} />
                  Samadhan
                </span>
                <button className="cookie-btn-primary" onClick={() => { localStorage.setItem('cookie_consent', 'true'); setShowCookies(false); }}>Got it</button>
              </div>
            </div>
          </div>
        )}
      </main>

    </>
  );
}

export default App;
