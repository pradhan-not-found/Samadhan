import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const Dashboard = lazy(() => import('./Dashboard.jsx'))
const AuthPage = lazy(() => import('./AuthPage.jsx'))
const ContactUs = lazy(() => import('./ContactUs.jsx'))

const path = window.location.pathname;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      {path === '/dashboard' ? <Dashboard /> : path === '/login' ? <AuthPage /> : path === '/contact' ? <ContactUs /> : <App />}
    </Suspense>
  </StrictMode>,
)
