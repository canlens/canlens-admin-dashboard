import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortfolio } from '../hooks/usePortfolio.js';
import { PAGE_SIZE } from '../config.js';
import PortfolioTable from '../components/ui/PortfolioTable.jsx';
import PortfolioModal from '../components/ui/PortfolioModal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import SearchBar from '../components/ui/SearchBar.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function PortfolioPage() {
  const { items, isLoading, error, refetch, addItem, editItem, removeItem } = usePortfolio();
  const { t } = useTranslation();

  // Search & Filter
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
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

  // Derived: unique categories
  const categories = useMemo(() => {
    return [...new Set(items.map((p) => p.category).filter(Boolean))].sort();
  }, [items]);

  // Filtered + searched items
  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }
    return result;
  }, [items, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearchChange(val) {
    setSearch(val);
    setCurrentPage(1);
  }
  function handleCategoryChange(val) {
    setCategoryFilter(val);
    setCurrentPage(1);
  }

  // Modal handlers
  function openAddModal() {
    setEditingItem(null);
    setSaveError(null);
    setModalOpen(true);
  }
  function openEditModal(item) {
    setEditingItem(item);
    setSaveError(null);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditingItem(null);
    setSaveError(null);
  }

  async function handleSave(formData) {
    setIsSaving(true);
    setSaveError(null);
    try {
      if (editingItem) {
        await editItem(formData);
        showToast(t('common.success'));
      } else {
        await addItem(formData);
        showToast(t('common.success'));
      }
      closeModal();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  // Delete handlers
  function handleDeleteClick(item) {
    setDeleteTarget(item);
    setDeleteError(null);
  }

  async function handleDeleteConfirm() {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await removeItem(deleteTarget.id);
      showToast(t('common.success'));
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

  if (error) return <ErrorState title={t('common.error')} message={error} onRetry={refetch} />;

  return (
    <div className="products-page">
      {toast && (
        <div className={`toast toast--${toast.type}`} role="status">
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </div>
      )}

      <div className="page-header">
        <div>
          <p className="page-header-count">
            {isLoading ? '…' : `${filtered.length}`}
          </p>
        </div>
        <button
          className="btn btn--primary"
          onClick={openAddModal}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Item
        </button>
      </div>

      <SearchBar
        search={search}
        onSearch={handleSearchChange}
        category={categoryFilter}
        onCategory={handleCategoryChange}
        categories={categories}
      />

      {saveError && (
        <div className="alert alert--error">
          <strong>{t('common.error')}:</strong> {saveError}
        </div>
      )}

      {!isLoading && filtered.length === 0 ? (
        <EmptyState
          title={search || categoryFilter ? 'No items found' : 'No items yet'}
          description=""
          action={
            !search && !categoryFilter ? (
              <button className="btn btn--primary" onClick={openAddModal}>
                Add Item
              </button>
            ) : (
              <button className="btn btn--ghost" onClick={() => { handleSearchChange(''); handleCategoryChange(''); }}>
                Clear Filters
              </button>
            )
          }
        />
      ) : (
        <PortfolioTable
          items={paginated}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={handleDeleteClick}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <PortfolioModal
        isOpen={modalOpen}
        item={editingItem}
        onSave={handleSave}
        onClose={closeModal}
        isSaving={isSaving}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title={t('common.delete')}
        message={t('common.confirmDelete')}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
