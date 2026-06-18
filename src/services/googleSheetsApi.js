/**
 * CanLens Admin — Google Sheets API Service
 * ============================================================
 * All communication with the Google Apps Script backend goes
 * through this file. To swap backends later, only change this
 * file — the UI layer does not need to change.
 * ============================================================
 */

import { SCRIPT_URL } from '../config.js';

// ──────────────────────────────────────────────────────────
// Internal helpers
// ──────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('canlens_admin_token');
}

async function gasPost(body) {
  if (!SCRIPT_URL) {
    throw new Error(
      'VITE_SCRIPT_URL is not configured. Add it to your .env file.'
    );
  }

  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // GAS CORS requires text/plain
    body: JSON.stringify(body),
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Unknown error from server');
  }
  return data;
}

async function gasGet(path = 'products', params = {}) {
  if (!SCRIPT_URL) {
    throw new Error(
      'VITE_SCRIPT_URL is not configured. Add it to your .env file.'
    );
  }

  const token = getToken();
  const query = new URLSearchParams({ ...params, token, path });
  const url = `${SCRIPT_URL}?${query.toString()}`;

  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Unknown error from server');
  }
  return data;
}

// ──────────────────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────────────────

/**
 * Authenticate with the Google Apps Script backend.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string }>}
 */
export async function login(email, password) {
  const data = await gasPost({ action: 'login', email, password });
  return { token: data.token };
}

// ──────────────────────────────────────────────────────────
// Products
// ──────────────────────────────────────────────────────────

/**
 * Fetch all products.
 * @returns {Promise<Array>}
 */
export async function getProducts() {
  const data = await gasGet('products');
  return data.data || [];
}

/**
 * Fetch a single product by ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getProduct(id) {
  const data = await gasGet('products', { id });
  return data.data;
}

/**
 * Create a new product.
 * @param {Object} product — { name, category, description, price, imageUrl, featured }
 * @returns {Promise<Object>} Created product with id and createdAt
 */
export async function createProduct(product) {
  const token = getToken();
  const data = await gasPost({ action: 'createProduct', token, ...product });
  return data.data;
}

/**
 * Update an existing product.
 * @param {Object} product — must include id
 * @returns {Promise<Object>}
 */
export async function updateProduct(product) {
  const token = getToken();
  const data = await gasPost({ action: 'updateProduct', token, ...product });
  return data.data;
}

/**
 * Delete a product by ID.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteProduct(id) {
  const token = getToken();
  await gasPost({ action: 'deleteProduct', token, id });
}

// ──────────────────────────────────────────────────────────
// Affiliate Products
// ──────────────────────────────────────────────────────────

export async function getAffiliateProducts() {
  const data = await gasGet('affiliate-products');
  return data.data || [];
}

export async function getAffiliateProduct(id) {
  const data = await gasGet('affiliate-products', { id });
  return data.data;
}

export async function createAffiliateProduct(product) {
  const token = getToken();
  const data = await gasPost({ action: 'createAffiliateProduct', token, ...product });
  return data.data;
}

export async function updateAffiliateProduct(product) {
  const token = getToken();
  const data = await gasPost({ action: 'updateAffiliateProduct', token, ...product });
  return data.data;
}

export async function deleteAffiliateProduct(id) {
  const token = getToken();
  await gasPost({ action: 'deleteAffiliateProduct', token, id });
}
