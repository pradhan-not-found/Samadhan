import re

with open('src/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Context export at the top (after imports)
if 'export const UserContext' not in content:
    content = content.replace('// --- Page Components ---', 'export const UserContext = React.createContext(null);\n\n// --- Page Components ---')

# Fix MyReportsView
content = re.sub(
    r"const state = localStorage\.getItem\('samadhan_state'\) \|\| 'West Bengal';\s*const ward = localStorage\.getItem\('samadhan_ward'\) \|\| 'Sector 4';",
    "const { userProfile } = React.useContext(UserContext) || { userProfile: {} };\n  const state = userProfile?.state_region || 'West Bengal';\n  const ward = userProfile?.ward || 'Sector 4';",
    content
)

# Fix ImpactScoreView
content = re.sub(
    r"const ward = localStorage\.getItem\('samadhan_ward'\) \|\| 'Sector 4';",
    "const { userProfile } = React.useContext(UserContext) || { userProfile: {} };\n  const ward = userProfile?.ward || 'Sector 4';",
    content
)

# Make Impact Score real in ImpactScoreView
content = re.sub(
    r"const basePoints = 150;\s*const earnedPoints = reports\.length \* 15;\s*const totalPoints = basePoints \+ earnedPoints;",
    "const totalPoints = userProfile?.impact_score || 0;",
    content
)

# Fix ProfileView
profile_view_start = r"const ProfileView = \(\) => \{"
profile_view_replacement = r'''const ProfileView = () => {
  const { userProfile, setUserProfile } = React.useContext(UserContext) || { userProfile: {} };
  const [profile, setProfile] = useState({
    email: userProfile.email || '',
    name: userProfile.name || '',
    role: userProfile.role || 'citizen',
    ward: userProfile.ward || '',
    state_region: userProfile.state_region || '',
    bio: userProfile.bio || '',
    avatar_url: userProfile.avatar_url || null,
  });'''
content = re.sub(r"const ProfileView = \(\) => \{[\s\S]*?avatar_url: null,\n  \}\);", profile_view_replacement, content)

# Remove the initial useEffect from ProfileView that fetches profile (since Dashboard now handles it)
content = re.sub(r"React\.useEffect\(\(\) => \{\n    const email = localStorage\.getItem\('samadhan_email'\);[\s\S]*?\}, \[\]\);\n", "", content)

# Remove the phone number field from ProfileView
content = re.sub(r"<Field label=\"Phone Number\" field=\"phone\".*?/>\n\s*", "", content)

# Fix ProfileView handleSave to sync with context
content = content.replace("localStorage.setItem('samadhan_email', profile.email);", "setUserProfile(p => ({ ...p, ...profile }));")
content = re.sub(r"localStorage\.setItem\('samadhan_name'.*?\n", "", content)
content = re.sub(r"localStorage\.setItem\('samadhan_ward'.*?\n", "", content)
content = re.sub(r"localStorage\.setItem\('samadhan_state'.*?\n", "", content)

# Remove GemmaStatusBadge component entirely
content = re.sub(r"// --- Gemma Engine Status ---[\s\S]*?const Dashboard = \(\) => \{", "// --- Main Layout ---\n\nconst Dashboard = () => {", content)
# Remove GemmaStatusBadge usage
content = content.replace("<GemmaStatusBadge />", "")

# Fix Dashboard main layout
dashboard_start = r'''const Dashboard = () => {
  const userRole = localStorage.getItem('samadhan_role') || 'citizen';
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'analytics' : 'my-reports');
  const [theme, setTheme] = useState('dark');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [impactScore, setImpactScore] = useState(150);
  const [displayName, setDisplayName] = useState(
    localStorage.getItem('samadhan_name') || (userRole === 'admin' ? 'Administrator' : 'Souradeep')
  );

  // Load profile from Supabase so avatar & name are always fresh
  React.useEffect(() => {
    const email = localStorage.getItem('samadhan_email');
    if (!email || email === 'demo@samadhan.gov.in') return;
    
    supabase.from('profiles').select('avatar_url, full_name, impact_score').eq('email', email).single()
      .then(({ data, error }) => {
        if (!data || error) return;
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
        if (data.full_name) setDisplayName(data.full_name);
        if (data.impact_score !== undefined) setImpactScore(data.impact_score);
      });
  }, []);

  // Re-read avatar when profile tab is saved (listen for storage events)
  React.useEffect(() => {
    const onStorage = () => {
      const name = localStorage.getItem('samadhan_name');
      if (name) setDisplayName(name);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);'''

dashboard_replacement = r'''const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  
  React.useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await import('./supabaseClient').then(m => m.supabase).auth.getSession();
      if (!session) {
        window.location.href = '/login';
        return;
      }
      const { data: profile } = await import('./supabaseClient').then(m => m.supabase).from('profiles').select('*').eq('email', session.user.email).single();
      if (profile) {
        setUserProfile({ ...profile, name: profile.full_name });
      } else {
        setUserProfile({ email: session.user.email, role: 'citizen', name: 'User', ward: 'Sector 4', state_region: 'West Bengal', impact_score: 0 });
      }
      setLoadingSession(false);
    };
    fetchSession();
  }, []);

  const userRole = userProfile?.role || 'citizen';
  const [activeTab, setActiveTab] = useState('analytics'); // Handled by useEffect below
  
  React.useEffect(() => {
    if (userProfile) {
      setActiveTab(userProfile.role === 'admin' ? 'analytics' : 'my-reports');
    }
  }, [userProfile]);

  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const avatarUrl = userProfile?.avatar_url;
  const impactScore = userProfile?.impact_score || 0;
  const displayName = userProfile?.name || (userRole === 'admin' ? 'Administrator' : 'User');
'''

content = content.replace(dashboard_start, dashboard_replacement)

# Wrap return with Provider
content = content.replace(
    'return (\n    <div className={dashboard-layout }>',
    'if (loadingSession) return <div style={{ height: \'100vh\', display: \'flex\', alignItems: \'center\', justifyContent: \'center\', backgroundColor: \'var(--bg-main)\', color: \'var(--text-main)\' }}>Loading Dashboard...</div>;\n\n  return (\n    <UserContext.Provider value={{ userProfile, setUserProfile }}>\n    <div className={dashboard-layout }>'
)

# Close Provider at the bottom
content = content.replace(
    '    </div>\n  );\n}\n\nexport default Dashboard;',
    '    </div>\n    </UserContext.Provider>\n  );\n}\n\nexport default Dashboard;'
)

with open('src/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement script executed successfully!")
