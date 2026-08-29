import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const Dashboard = lazy(() => import('./Dashboard.jsx'))
const AuthPage = lazy(() => import('./AuthPage.jsx'))
const CreateAccount = lazy(() => import('./CreateAccount.jsx'))
const ContactUs = lazy(() => import('./ContactUs.jsx'))
const TermsOfService = lazy(() => import('./TermsOfService.jsx'))
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy.jsx'))

const path = window.location.pathname;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      {path === '/dashboard' ? <Dashboard /> : path === '/login' ? <AuthPage /> : path === '/signup' ? <CreateAccount /> : path === '/contact' ? <ContactUs /> : path === '/terms' ? <TermsOfService /> : path === '/privacy' ? <PrivacyPolicy /> : <App />}
    </Suspense>
  </StrictMode>,
)
