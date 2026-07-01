import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../hooks/useProducts.js';
import StatCard from '../components/ui/StatCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

export default function DashboardPage() {
  const { products, isLoading, error, refetch } = useProducts();
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const featured = products.filter((p) => p.featured).length;
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    const recent = products
      .filter((p) => p.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    return { total: products.length, featured, categories, recent };
  }, [products]);

  if (isLoading) return <LoadingSpinner message={t('common.loading')} />;
  if (error) return <ErrorState title={t('common.error')} message={error} onRetry={refetch} />;

  return (
    <div className="dashboard-page">
      {/* Stat cards */}
      <section className="stat-cards-grid">
        <StatCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          }
          value={stats.total}
          label={t('dashboard.totalProducts')}
          color="blue"
        />
        <StatCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
          value={stats.featured}
          label={t('products.featured')}
          color="purple"
        />
        <StatCard
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          }
          value={stats.categories.length}
          label={t('products.category')}
          color="green"
        />
      </section>

      {/* Recent Products */}
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Recent Products</h2>
          <Link to="/admin/products" className="dashboard-see-all">
            View all →
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <div className="dashboard-empty">
            <p>{t('products.noProducts')} <Link to="/admin/products" className="link">{t('products.addProduct')}</Link></p>
          </div>
        ) : (
          <div className="recent-products-list">
            {stats.recent.map((product) => (
              <div key={product.id} className="recent-product-card">
                {product.imageUrl ? (
                  <img
                    className="recent-product-img"
                    src={product.imageUrl}
                    alt={product.name}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="recent-product-img-placeholder">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
                <div className="recent-product-info">
                  <p className="recent-product-name">{product.name}</p>
                  <p className="recent-product-meta">
                    <span className="badge">{product.category}</span>
                    <span className="recent-product-price">{Number(product.price).toLocaleString()} RWF</span>
                  </p>
                </div>
                {product.featured && (
                  <span className="recent-product-featured">⭐</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      {stats.categories.length > 0 && (
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Product Categories</h2>
          </div>
          <div className="categories-grid">
            {stats.categories.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              return (
                <div key={cat} className="category-card">
                  <p className="category-card-name">{cat}</p>
                  <p className="category-card-count">{count} product{count !== 1 ? 's' : ''}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
