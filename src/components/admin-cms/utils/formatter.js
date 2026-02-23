// src/components/admin-cms/utils/formatter.js

/**
 * Formats a date string into YYYY-MM-DD.
 * @param {string} dateStr - The date string to format.
 * @returns {string} - The formatted date string.
 */
export function formatDate(dateStr) {
    if (!dateStr) return 'Sin fecha';
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
