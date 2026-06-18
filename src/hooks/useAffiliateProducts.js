import { useState, useEffect, useCallback } from 'react';
import {
  getAffiliateProducts,
  createAffiliateProduct,
  updateAffiliateProduct,
  deleteAffiliateProduct,
} from '../services/googleSheetsApi.js';

export function useAffiliateProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAffiliateProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (productData) => {
    const created = await createAffiliateProduct(productData);
    setProducts((prev) => [created, ...prev]);
    return created;
  }, []);

  const editProduct = useCallback(async (productData) => {
    const updated = await updateAffiliateProduct(productData);
    setProducts((prev) =>
      prev.map((p) => (p.id === productData.id ? { ...p, ...productData, ...updated } : p))
    );
  }, []);

  const removeProduct = useCallback(async (id) => {
    await deleteAffiliateProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
  };
}
