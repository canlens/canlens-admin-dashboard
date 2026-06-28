// ============================================================
// CanLens Admin — Backend Configuration
// ============================================================
// Set VITE_SCRIPT_URL in your .env file to your Google Apps
// Script Web App URL after deployment.
// ============================================================

export const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL || '';

// Items per page in the products table
export const PAGE_SIZE = 10;
