import { useState, useEffect, useCallback } from 'react';
import {
  getPortfolioItems,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../services/googleSheetsApi.js';

export function usePortfolio() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPortfolioItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (itemData) => {
    const created = await createPortfolioItem(itemData);
    setItems((prev) => [created, ...prev]);
    return created;
  }, []);

  const editItem = useCallback(async (itemData) => {
    const updated = await updatePortfolioItem(itemData);
    setItems((prev) =>
      prev.map((p) => (p.id === itemData.id ? { ...p, ...itemData, ...updated } : p))
    );
  }, []);

  const removeItem = useCallback(async (id) => {
    await deletePortfolioItem(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    items,
    isLoading,
    error,
    refetch: fetchItems,
    addItem,
    editItem,
    removeItem,
  };
}
