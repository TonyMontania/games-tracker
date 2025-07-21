/**
 * Funciones utilitarias reutilizables
 */

// Formateo de fechas
export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Validación de año
export function isValidYear(year) {
  return /^\d{4}$/.test(year) && year >= 1991 && year <= new Date().getFullYear();
}

// Clonado profundo
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Función debounce para búsquedas
export function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}