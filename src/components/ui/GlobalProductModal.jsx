import { useState, useEffect, useRef } from 'react';

const EMPTY_FORM = {
  name: '',
  storeName: '',
  productUrl: '',
  imageUrl: '',
  description: '',
  featured: false,
};

export default function GlobalProductModal({ isOpen, product, onSave, onClose, isSaving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);

  const isEditing = Boolean(product);

  useEffect(() => {
    if (isOpen) {
      setForm(product ? {
        name: product.name || '',
        storeName: product.storeName || '',
        productUrl: product.productUrl || '',
        imageUrl: product.imageUrl || '',
        description: product.description || '',
        featured: product.featured || false,
      } : EMPTY_FORM);
      setErrors({});
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.storeName.trim()) e.storeName = 'Store name is required';
    if (!form.productUrl.trim()) e.productUrl = 'Product URL is required';
    return e;
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    onSave({
      ...(isEditing ? { id: product.id, createdAt: product.createdAt } : {}),
      ...form,
    });
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditing ? 'Edit Global Product' : 'Add New Global Product'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal" id="modal-close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Image preview */}
          {form.imageUrl && (
            <div className="modal-image-preview">
              <img src={form.imageUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="modal-name">Product Name *</label>
              <input
                ref={firstInputRef}
                id="modal-name"
                className={`form-input${errors.name ? ' form-input--error' : ''}`}
                type="text"
                placeholder="e.g. Sony A7 III"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-store">Store Name *</label>
              <input
                id="modal-store"
                className={`form-input${errors.storeName ? ' form-input--error' : ''}`}
                type="text"
                placeholder="e.g. Amazon"
                value={form.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
              />
              {errors.storeName && <span className="form-error">{errors.storeName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-product-url">Product URL *</label>
            <input
              id="modal-product-url"
              className={`form-input${errors.productUrl ? ' form-input--error' : ''}`}
              type="url"
              placeholder="https://"
              value={form.productUrl}
              onChange={(e) => handleChange('productUrl', e.target.value)}
            />
            {errors.productUrl && <span className="form-error">{errors.productUrl}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-image-url">Image URL</label>
            <input
              id="modal-image-url"
              className={`form-input${errors.imageUrl ? ' form-input--error' : ''}`}
              type="url"
              placeholder="https://"
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-description">Description</label>
            <textarea
              id="modal-description"
              className="form-textarea"
              placeholder="Brief description..."
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="form-group form-group--inline">
            <label className="form-toggle" htmlFor="modal-featured">
              <input
                id="modal-featured"
                type="checkbox"
                className="form-toggle-input"
                checked={form.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
              />
              <span className="form-toggle-track">
                <span className="form-toggle-thumb" />
              </span>
              <span className="form-toggle-label">Featured Global Product</span>
            </label>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSaving}>
              {isSaving ? (isEditing ? 'Saving…' : 'Adding…') : (isEditing ? 'Save Changes' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
