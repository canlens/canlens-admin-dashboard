export default function GlobalProductTable({ products, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <div className="table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Store</th>
              <th className="hide-on-mobile">URL</th>
              <th className="hide-on-mobile">Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="table-skeleton-row">
                <td><div className="skeleton skeleton--wide" /></td>
                <td><div className="skeleton skeleton--medium" /></td>
                <td className="hide-on-mobile"><div className="skeleton skeleton--medium" /></td>
                <td className="hide-on-mobile"><div className="skeleton skeleton--short" /></td>
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
            <th>Product</th>
            <th>Store</th>
            <th className="hide-on-mobile">URL</th>
            <th className="hide-on-mobile">Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="product-table-row">
              <td>
                <div className="product-table-name-cell">
                  {product.imageUrl ? (
                    <img
                      className="product-table-thumb"
                      src={product.imageUrl}
                      alt={product.name}
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
                    <p className="product-table-name">{product.name}</p>
                    {product.description && (
                      <p className="product-table-desc">{String(product.description).slice(0, 60)}{String(product.description).length > 60 ? '…' : ''}</p>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <span className="badge">{product.storeName}</span>
              </td>
              <td className="hide-on-mobile">
                <a href={product.productUrl} target="_blank" rel="noopener noreferrer" style={{color: '#3FAFF8'}}>Link</a>
              </td>
              <td className="hide-on-mobile">
                {product.featured ? (
                  <span className="badge badge--featured">⭐ Featured</span>
                ) : (
                  <span className="badge badge--muted">—</span>
                )}
              </td>
              <td>
                <div className="product-table-actions">
                  <button
                    className="action-btn action-btn--edit"
                    onClick={() => onEdit(product)}
                    id={`edit-product-${product.id}`}
                    aria-label={`Edit ${product.name}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    className="action-btn action-btn--delete"
                    onClick={() => onDelete(product)}
                    id={`delete-product-${product.id}`}
                    aria-label={`Delete ${product.name}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                    Delete
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
