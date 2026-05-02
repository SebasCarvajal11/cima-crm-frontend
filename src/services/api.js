import axios from 'axios';
import { store } from '../redux/store';
import logger from '../utils/logger';
import { AUTH } from '../constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
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

const HTTP_ERROR_MESSAGES = {
  400: 'Solicitud incorrecta. Verifica los datos enviados.',
  401: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no fue encontrado.',
  409: 'Conflicto con el estado actual del recurso.',
  422: 'Los datos enviados no son válidos.',
  500: 'Error interno del servidor. Intenta más tarde.',
  502: 'El servidor no está disponible. Intenta más tarde.',
  503: 'El servicio no está disponible temporalmente.',
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    logger.error(`API Error [${status}]:`, serverMessage || error.message);

    if (status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem(AUTH.STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(AUTH.STORAGE_KEYS.USER);
      }
    }

    error.userMessage = serverMessage || HTTP_ERROR_MESSAGES[status] || 'Error de conexión. Verifica tu conexión a internet.';

    return Promise.reject(error);
  }
);

export default api;
