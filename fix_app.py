import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Supabase import
if 'import { supabase }' not in content:
    content = content.replace("import './App.css';", "import './App.css';\nimport { supabase } from './supabaseClient';")

# Add state variables and useEffects inside App()
app_start = r"function App\(\) \{\n  const \[isMobileMenuOpen, setIsMobileMenuOpen\] = useState\(false\);\n  const \[scrolled, setScrolled\] = useState\(false\);"
app_state_replacement = r'''function App() {
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
        const { data: profile } = await supabase.from('profiles').select('avatar_url, full_name, role').eq('email', session.user.email).single();
        if (profile) setUserProfile({ ...profile, email: session.user.email });
        else setUserProfile({ email: session.user.email, role: 'citizen', full_name: 'User' });
      }
    };
    fetchSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };
'''

content = re.sub(app_start, app_state_replacement, content)

# Replace desktop nav actions
desktop_nav_start = r'''          <div className={
av-actions desktop-only}>
            <a href="/login" className="btn-hero-dark" style={{ padding: '0.5rem 1.3rem', fontSize: '0.85rem', borderRadius: '999px', backgroundColor: '#23273b' }}>Sign In</a>
            <a href="/contact" className="btn-hero-light" style={{ padding: '0.5rem 1.3rem', fontSize: '0.85rem', borderRadius: '999px' }}>Contact Us</a>
          </div>'''

desktop_nav_replacement = r'''          <div className={
av-actions desktop-only}>
            {userProfile ? (
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', background: userProfile.avatar_url ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: '2px solid rgba(99,102,241,0.3)', display: 'grid', placeItems: 'center', cursor: 'pointer', overflow: 'hidden' }}>
                  {userProfile.avatar_url ? <img src={userProfile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{(userProfile.full_name || userProfile.email || 'U').charAt(0).toUpperCase()}</span>}
                </div>
                {showDropdown && (
                  <div className="nav-dropdown-menu">
                    <div className="nav-dropdown-header">
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{userProfile.full_name || 'User'}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>{userProfile.email}</span>
                    </div>
                    <a href="/dashboard" className="nav-dropdown-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> Dashboard</a>
                    <button onClick={handleLogout} className="nav-dropdown-item" style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a href="/login" className="btn-hero-dark" style={{ padding: '0.5rem 1.3rem', fontSize: '0.85rem', borderRadius: '999px', backgroundColor: '#23273b' }}>Sign In</a>
                <a href="/contact" className="btn-hero-light" style={{ padding: '0.5rem 1.3rem', fontSize: '0.85rem', borderRadius: '999px' }}>Contact Us</a>
              </>
            )}
          </div>'''

content = content.replace(desktop_nav_start, desktop_nav_replacement)


# Add Cookies Banner to the end of main-wrapper
cookie_banner = r'''
        {showCookies && (
          <div className="cookie-banner animate-fade-in-up">
            <div className="cookie-content">
              <span className="cookie-title">?? Cookie Preferences</span>
              <p>We use cookies to ensure you get the best experience on our civic platform. By continuing to use Samadhan, you agree to our policies.</p>
            </div>
            <div className="cookie-actions">
              <button className="cookie-btn-outline" onClick={() => { localStorage.setItem('cookie_consent', 'true'); setShowCookies(false); }}>Manage</button>
              <button className="cookie-btn-primary" onClick={() => { localStorage.setItem('cookie_consent', 'true'); setShowCookies(false); }}>Accept All</button>
            </div>
          </div>
        )}
      </main>
'''
content = content.replace("</main>", cookie_banner)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("App.jsx rewritten successfully.")
