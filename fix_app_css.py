import re

with open('src/App.css', 'r', encoding='utf-8') as f:
    content = f.read()

styles = r'''
/* --- Navbar Dropdown --- */
.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 200px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: dropdownSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  z-index: 100;
}
@keyframes dropdownSlide {
  from { opacity: 0; transform: translateY(-10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.nav-dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.nav-dropdown-item {
  padding: 0.8rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-main);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: background 0.2s;
}
.nav-dropdown-item:hover {
  background-color: var(--hover-bg);
}

/* --- Cookie Banner --- */
.cookie-banner {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 4rem);
  max-width: 600px;
  background-color: rgba(23, 25, 38, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
  z-index: 1000;
}
@media (min-width: 600px) {
  .cookie-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.cookie-content {
  flex: 1;
}
.cookie-title {
  display: block;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-main);
  margin-bottom: 0.4rem;
}
.cookie-content p {
  font-size: 0.8rem;
  color: var(--text-faint);
  line-height: 1.5;
  margin: 0;
}
.cookie-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.cookie-btn-outline {
  background: transparent;
  border: 1px solid var(--border-medium);
  color: var(--text-muted);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.cookie-btn-outline:hover {
  background: var(--hover-bg);
  color: var(--text-main);
}
.cookie-btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  transition: transform 0.1s;
}
.cookie-btn-primary:active {
  transform: scale(0.96);
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
'''
if '.cookie-banner' not in content:
    content += "\n" + styles

with open('src/App.css', 'w', encoding='utf-8') as f:
    f.write(content)
