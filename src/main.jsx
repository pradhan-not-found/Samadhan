import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import AuthPage from './AuthPage.jsx'

const path = window.location.pathname;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {path === '/dashboard' ? <Dashboard /> : path === '/login' ? <AuthPage /> : <App />}
  </StrictMode>,
)
