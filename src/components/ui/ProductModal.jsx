import { useState, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { uploadImage } from '../../services/storageService';

const EMPTY_FORM = {
  name: '',
  category: '',
  description: '',
  price: '',
  imageUrl: '',
  imageFile: null,
  featured: false,
};

export default function ProductModal({ isOpen, product, onSave, onClose, isSaving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const firstInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const isEditing = Boolean(product);

  useEffect(() => {
    if (isOpen) {
      setForm(product ? {
        name: product.name || '',
        category: product.category || '',
        description: product.description || '',
        price: product.price !== undefined ? String(product.price) : '',
        imageUrl: product.imageUrl || '',
        imageFile: null,
        featured: product.featured || false,
      } : EMPTY_FORM);
      setErrors({});
      setIsCompressing(false);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.category.trim()) e.category = 'Category is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = 'Valid price is required';
    return e;
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check size before compression just in case
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'File size too large (max 10MB)' }));
      return;
    }

    try {
      setIsCompressing(true);
      setErrors(prev => ({ ...prev, image: undefined }));
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      setForm(prev => ({ 
        ...prev, 
        imageFile: compressedFile,
        imageUrl: URL.createObjectURL(compressedFile) // Local preview
      }));
      setIsCompressing(false);
    } catch (error) {
      console.error('Image compression error:', error);
      setErrors(prev => ({ ...prev, image: 'Image compression failed' }));
      setIsCompressing(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    let finalImageUrl = form.imageUrl;
    
    if (form.imageFile) {
      try {
        setIsUploading(true);
        finalImageUrl = await uploadImage(form.imageFile);
      } catch (err) {
        setIsUploading(false);
        setErrors(prev => ({ ...prev, image: 'Failed to upload image' }));
        return;
      }
    }
    
    // Copy form to omit imageFile
    const { imageFile, ...formToSave } = form;
    
    onSave({
      ...(isEditing ? { id: product.id, createdAt: product.createdAt } : {}),
      ...formToSave,
      imageUrl: finalImageUrl,
      price: Number(form.price),
    });
    
    if (form.imageFile) {
      setIsUploading(false);
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditing ? 'Edit Product' : 'Add New Product'}
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
              <img src={form.imageUrl} alt="Product preview" onError={(e) => e.target.style.display = 'none'} />
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
                placeholder="e.g. Canon EF 50mm f/1.8"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-category">Category *</label>
              <input
                id="modal-category"
                className={`form-input${errors.category ? ' form-input--error' : ''}`}
                type="text"
                placeholder="e.g. Lenses, Cameras, Accessories"
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              />
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-description">Description</label>
            <textarea
              id="modal-description"
              className="form-textarea"
              placeholder="Product description…"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="modal-price">Price (USD) *</label>
              <input
                id="modal-price"
                className={`form-input${errors.price ? ' form-input--error' : ''}`}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
              />
              {errors.price && <span className="form-error">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-image-file">Product Image</label>
              <input
                ref={fileInputRef}
                id="modal-image-file"
                className={`form-input${errors.image ? ' form-input--error' : ''}`}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
                disabled={isCompressing || isSaving || isUploading}
              />
              {errors.image && <span className="form-error">{errors.image}</span>}
              {isCompressing && <span className="form-hint" style={{ color: '#0ea5e9', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>Compressing image...</span>}
              {!isCompressing && !errors.image && <span className="form-hint" style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', display: 'block' }}>Max 10MB (JPG, PNG, WEBP)</span>}
            </div>
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
              <span className="form-toggle-label">Featured Product</span>
            </label>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={isSaving || isCompressing || isUploading}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSaving || isCompressing || isUploading} id="modal-submit-btn">
              {isUploading ? 'Uploading...' : isSaving ? (isEditing ? 'Saving…' : 'Adding…') : (isEditing ? 'Save Changes' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
