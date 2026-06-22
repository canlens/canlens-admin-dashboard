import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const PAGE_KEYS = {
  '/admin': 'dashboard',
  '/admin/products': 'products',
  '/admin/global-products': 'globalProducts',
  '/admin/portfolio': 'portfolio',
};

export default function Topbar({ onMenuToggle }) {
  const location = useLocation();
  const { token } = useAuth();
  const { t, i18n } = useTranslation();

  const pageKey = PAGE_KEYS[location.pathname] || 'dashboard';

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    if (i18n.language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [i18n.language]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

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
          <h1 className="topbar-title">{t(`nav.${pageKey}`)}</h1>
          <p className="topbar-subtitle">{t(`${pageKey}.title`)}</p>
        </div>
      </div>

      <div className="topbar-right">
        <button onClick={toggleLanguage} className="topbar-lang-btn" style={{ background: 'transparent', border: '1px solid var(--canlens-border)', color: 'var(--canlens-text)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', marginRight: '1rem' }}>
          {i18n.language === 'en' ? 'العربية' : 'English'}
        </button>
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
