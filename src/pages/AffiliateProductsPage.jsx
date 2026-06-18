import { useState, useMemo } from 'react';
import { useAffiliateProducts } from '../hooks/useAffiliateProducts.js';
import { PAGE_SIZE } from '../config.js';
import AffiliateProductTable from '../components/ui/AffiliateProductTable.jsx';
import AffiliateProductModal from '../components/ui/AffiliateProductModal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import SearchBar from '../components/ui/SearchBar.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function AffiliateProductsPage() {
  const { products, isLoading, error, refetch, addProduct, editProduct, removeProduct } = useAffiliateProducts();

  // Search & Filter
  const [search, setSearch] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  // Derived: unique stores
  const stores = useMemo(() => {
    return [...new Set(products.map((p) => p.storeName).filter(Boolean))].sort();
  }, [products]);

  // Filtered + searched products
  const filtered = useMemo(() => {
    let result = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.storeName?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (storeFilter) {
      result = result.filter((p) => p.storeName === storeFilter);
    }
    return result;
  }, [products, search, storeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearchChange(val) {
    setSearch(val);
    setCurrentPage(1);
  }
  function handleStoreChange(val) {
    setStoreFilter(val);
    setCurrentPage(1);
  }

  // Modal handlers
  function openAddModal() {
    setEditingProduct(null);
    setSaveError(null);
    setModalOpen(true);
  }
  function openEditModal(product) {
    setEditingProduct(product);
    setSaveError(null);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditingProduct(null);
    setSaveError(null);
  }

  async function handleSave(formData) {
    setIsSaving(true);
    setSaveError(null);
    try {
      if (editingProduct) {
        await editProduct(formData);
        showToast('Affiliate Product updated successfully');
      } else {
        await addProduct(formData);
        showToast('Affiliate Product added successfully');
      }
      closeModal();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  // Delete handlers
  function handleDeleteClick(product) {
    setDeleteTarget(product);
    setDeleteError(null);
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await removeProduct(deleteTarget.id);
      showToast('Affiliate Product deleted');
      setDeleteTarget(null);
      if (paginated.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  if (error) return <ErrorState title="Failed to load affiliate products" message={error} onRetry={refetch} />;

  return (
    <div className="products-page">
      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`} role="status">
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </div>
      )}

      {/* Page header */}
      <div className="page-header">
        <div>
          <p className="page-header-count">
            {isLoading ? '…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
            {(search || storeFilter) && ' (filtered)'}
          </p>
        </div>
        <button
          className="btn btn--primary"
          onClick={openAddModal}
          id="add-product-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Affiliate Product
        </button>
      </div>

      {/* Search & filter */}
      <SearchBar
        search={search}
        onSearch={handleSearchChange}
        category={storeFilter}
        onCategory={handleStoreChange}
        categories={stores}
      />

      {/* Error from save */}
      {saveError && (
        <div className="alert alert--error">
          <strong>Error:</strong> {saveError}
        </div>
      )}

      {/* Table / Empty */}
      {!isLoading && filtered.length === 0 ? (
        <EmptyState
          title={search || storeFilter ? 'No affiliate products match your filters' : 'No affiliate products yet'}
          description={
            search || storeFilter
              ? 'Try adjusting your search or filter.'
              : 'Get started by adding your first affiliate product to the catalog.'
          }
          action={
            !search && !storeFilter ? (
              <button className="btn btn--primary" onClick={openAddModal}>
                Add First Affiliate Product
              </button>
            ) : (
              <button className="btn btn--ghost" onClick={() => { handleSearchChange(''); handleStoreChange(''); }}>
                Clear Filters
              </button>
            )
          }
        />
      ) : (
        <AffiliateProductTable
          products={paginated}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Modal */}
      <AffiliateProductModal
        isOpen={modalOpen}
        product={editingProduct}
        onSave={handleSave}
        onClose={closeModal}
        isSaving={isSaving}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Affiliate Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
