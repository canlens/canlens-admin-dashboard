import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import imageCompression from 'browser-image-compression';
import { uploadImage } from '../../services/storageService';

const EMPTY_FORM = {
  name: '',
  category: '',
  description: '',
  price: '',
  previewImages: [],
  featured: false,
};

export default function ProductModal({ isOpen, product, onSave, onClose, isSaving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const firstInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  const isEditing = Boolean(product);

  useEffect(() => {
    if (isOpen) {
      setForm(product ? {
        name: product.name || '',
        category: product.category || '',
        description: product.description || '',
        price: product.price !== undefined ? String(product.price) : '',
        previewImages: (product.imageUrl || '').split(',').filter(Boolean).map(url => ({ url, file: null })),
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
    if (!form.name.trim()) e.name = t('common.error');
    if (!form.category.trim()) e.category = t('common.error');
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = t('common.error');
    return e;
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (files.some(file => file.size > 10 * 1024 * 1024)) {
      setErrors(prev => ({ ...prev, image: 'One or more files too large (max 10MB)' }));
      return;
    }

    try {
      setIsCompressing(true);
      setErrors(prev => ({ ...prev, image: undefined }));
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1920, useWebWorker: true };
      
      const compressedFiles = await Promise.all(files.map(file => imageCompression(file, options)));
      const newImages = compressedFiles.map(f => ({
        url: URL.createObjectURL(f),
        file: f
      }));
      
      setForm(prev => ({ 
        ...prev, 
        previewImages: [...(prev.previewImages || []), ...newImages]
      }));
      setIsCompressing(false);
    } catch (error) {
      console.error('Image compression error:', error);
      setErrors(prev => ({ ...prev, image: 'Image compression failed' }));
      setIsCompressing(false);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeImage(index) {
    setForm(prev => ({
      ...prev,
      previewImages: prev.previewImages.filter((_, i) => i !== index)
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    try {
      setIsUploading(true);
      const finalUrls = await Promise.all(form.previewImages.map(async (img) => {
        if (img.file) {
          return await uploadImage(img.file);
        }
        return img.url;
      }));
      
      const { previewImages, ...formToSave } = form;
      
      onSave({
        ...(isEditing ? { id: product.id, createdAt: product.createdAt } : {}),
        ...formToSave,
        imageUrl: finalUrls.join(','),
        price: Number(form.price),
      });
      setIsUploading(false);
    } catch (err) {
      setIsUploading(false);
      setErrors(prev => ({ ...prev, image: 'Failed to upload images' }));
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditing ? t('common.edit') : t('products.addProduct')}
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
          {form.previewImages && form.previewImages.length > 0 && (
            <div className="modal-image-preview" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', alignItems: 'center' }}>
              {form.previewImages.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={img.url} alt={`Preview ${idx + 1}`} onError={(e) => e.target.style.display = 'none'} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>×</button>
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: '80px', height: '80px', borderRadius: '4px', border: '1px dashed rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>
                <span style={{ fontSize: '24px', marginBottom: '4px' }}>+</span>
                Add More
              </button>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="modal-name">{t('products.name')} *</label>
              <input
                ref={firstInputRef}
                id="modal-name"
                className={`form-input${errors.name ? ' form-input--error' : ''}`}
                type="text"
                placeholder=""
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="modal-category">{t('products.category')} *</label>
              <input
                id="modal-category"
                className={`form-input${errors.category ? ' form-input--error' : ''}`}
                type="text"
                placeholder=""
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              />
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="modal-description">{t('products.desc')}</label>
            <textarea
              id="modal-description"
              className="form-textarea"
              placeholder=""
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="modal-price">{t('products.price')} *</label>
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
              <label className="form-label" htmlFor="modal-image-file">{t('products.image')}</label>
              <input
                ref={fileInputRef}
                id="modal-image-file"
                className={`form-input${errors.image ? ' form-input--error' : ''}`}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
                disabled={isCompressing || isSaving || isUploading}
                style={{ display: form.previewImages.length > 0 ? 'none' : 'block' }}
              />
              {errors.image && <span className="form-error">{errors.image}</span>}
              {isCompressing && <span className="form-hint" style={{ color: '#0ea5e9', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>Compressing image...</span>}
              {!isCompressing && !errors.image && form.previewImages.length === 0 && <span className="form-hint" style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px', display: 'block' }}>Max 10MB (JPG, PNG, WEBP)</span>}
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
              <span className="form-toggle-label">{t('products.featured')}</span>
            </label>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={isSaving || isCompressing || isUploading}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSaving || isCompressing || isUploading} id="modal-submit-btn">
              {isUploading ? 'Uploading...' : isSaving ? (isEditing ? 'Saving…' : 'Adding…') : (isEditing ? t('common.save') : t('products.addProduct'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
