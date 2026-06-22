import { useTranslation } from 'react-i18next';

export default function PortfolioTable({ items, isLoading, onEdit, onDelete }) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th className="hide-on-mobile">Featured</th>
              <th className="hide-on-mobile">Created</th>
              <th>{t('products.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="table-skeleton-row">
                <td><div className="skeleton skeleton--wide" /></td>
                <td><div className="skeleton skeleton--medium" /></td>
                <td className="hide-on-mobile"><div className="skeleton skeleton--short" /></td>
                <td className="hide-on-mobile"><div className="skeleton skeleton--medium" /></td>
                <td><div className="skeleton skeleton--short" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th className="hide-on-mobile">Featured</th>
            <th className="hide-on-mobile">Created</th>
            <th>{t('products.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="product-table-row">
              <td>
                <div className="product-table-name-cell">
                  {item.imageUrl ? (
                    <img
                      className="product-table-thumb"
                      src={item.imageUrl}
                      alt={item.title}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="product-table-thumb-placeholder">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="product-table-name">{item.title}</p>
                    {item.description && (
                      <p className="product-table-desc">{String(item.description).slice(0, 60)}{String(item.description).length > 60 ? '…' : ''}</p>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <span className="badge">{item.category}</span>
              </td>
              <td className="hide-on-mobile">
                {item.featured ? (
                  <span className="badge badge--featured">⭐ {t('products.featured')}</span>
                ) : (
                  <span className="badge badge--muted">—</span>
                )}
              </td>
              <td className="hide-on-mobile">
                <span className="product-table-date">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                </span>
              </td>
              <td>
                <div className="product-table-actions">
                  <button
                    className="action-btn action-btn--edit"
                    onClick={() => onEdit(item)}
                    id={`edit-portfolio-${item.id}`}
                    aria-label={`${t('common.edit')} ${item.title}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    {t('common.edit')}
                  </button>
                  <button
                    className="action-btn action-btn--delete"
                    onClick={() => onDelete(item)}
                    id={`delete-portfolio-${item.id}`}
                    aria-label={`${t('common.delete')} ${item.title}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                    {t('common.delete')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
