import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css';
import App from './App.jsx'
import './apiClient.js';
import { Classic } from './Loading.jsx';

const Dashboard = lazy(() => import('./Dashboard.jsx'))
const AuthPage = lazy(() => import('./AuthPage.jsx'))
const CreateAccount = lazy(() => import('./CreateAccount.jsx'))
const ContactUs = lazy(() => import('./ContactUs.jsx'))
const TermsOfService = lazy(() => import('./TermsOfService.jsx'))
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy.jsx'))

const path = window.location.pathname;

const FullPageLoader = () => (
  <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' }}>
    <Classic style={{ color: '#111', width: '3rem', height: '3rem' }} />
    <div style={{ marginTop: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#3d3d3d', animation: 'pulse 1.5s infinite' }}>
      Loading Samadhan...
    </div>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
    `}</style>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<FullPageLoader />}>
      {path === '/dashboard' ? <Dashboard /> : path === '/login' ? <AuthPage /> : path === '/signup' ? <CreateAccount /> : path === '/contact' ? <ContactUs /> : path === '/terms' ? <TermsOfService /> : path === '/privacy' ? <PrivacyPolicy /> : <App />}
    </Suspense>
  </StrictMode>,
)
