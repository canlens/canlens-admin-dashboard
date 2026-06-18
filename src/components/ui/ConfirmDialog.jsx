import { useEffect, useRef } from 'react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, isLoading }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (isOpen && cancelRef.current) {
      cancelRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="dialog">
        <div className="dialog-icon dialog-icon--danger">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 id="dialog-title" className="dialog-title">{title}</h2>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button
            ref={cancelRef}
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={isLoading}
            id="dialog-cancel"
          >
            Cancel
          </button>
          <button
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={isLoading}
            id="dialog-confirm"
          >
            {isLoading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
