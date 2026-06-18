import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const PAGE_TITLES = {
  '/admin': { title: 'Dashboard', subtitle: 'Overview & quick stats' },
  '/admin/products': { title: 'Products', subtitle: 'Manage your product catalog' },
};

export default function Topbar({ onMenuToggle }) {
  const location = useLocation();
  const { token } = useAuth();

  const page = PAGE_TITLES[location.pathname] || { title: 'Admin', subtitle: '' };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          id="topbar-menu-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="topbar-page-info">
          <h1 className="topbar-title">{page.title}</h1>
          {page.subtitle && <p className="topbar-subtitle">{page.subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-status">
          <span className="topbar-status-dot" />
          <span className="topbar-status-label">Connected</span>
        </div>
        <div className="topbar-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}
