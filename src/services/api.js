import axios from 'axios';
import { store } from '../redux/store';
import logger from '../utils/logger';
import { AUTH } from '../constants';

/**
 * Instancia centralizada de Axios con interceptores automáticos.
 * Elimina la necesidad de pasar headers de autenticación en cada llamada.
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: agrega el token automáticamente
api.interceptors.request.use(
  (config) => {
    // Prioridad: Redux store > localStorage
    const state = store.getState();
    const token = state.auth?.accessToken || localStorage.getItem(AUTH.STORAGE_KEYS.ACCESS_TOKEN);
    
    if (token) {
      config.headers[AUTH.HEADER_NAME] = token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response: maneja errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log del error
    logger.error('API Error:', error.response?.status, error.message);
    
    // Si el token expiró (401), podríamos redirigir al login
    if (error.response?.status === 401) {
      // Verificar si no estamos ya en login para evitar loops
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem(AUTH.STORAGE_KEYS.ACCESS_TOKEN);
        // El redirect al login se manejará por el ProtectedRoute
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
