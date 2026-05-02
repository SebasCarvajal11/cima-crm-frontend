import { toast } from 'react-toastify';

const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Hook centralizado para notificaciones toast.
 * Estandariza posición, duración y formato de mensajes.
 *
 * @example
 * const notify = useNotification();
 * notify.success('Cliente creado exitosamente');
 * notify.error('Error al cargar clientes', err);
 */
export function useNotification() {
  const success = (message, options = {}) => {
    return toast.success(message, { ...defaultOptions, ...options });
  };

  const error = (message, err = null, options = {}) => {
    const detail = err?.userMessage || err?.response?.data?.message || err?.message;
    const fullMessage = detail ? `${message}: ${detail}` : message;
    return toast.error(fullMessage, { ...defaultOptions, autoClose: 5000, ...options });
  };

  const warning = (message, options = {}) => {
    return toast.warning(message, { ...defaultOptions, ...options });
  };

  const info = (message, options = {}) => {
    return toast.info(message, { ...defaultOptions, ...options });
  };

  const loading = (message = 'Cargando...') => {
    return toast.loading(message, { ...defaultOptions, autoClose: false });
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  const update = (toastId, message, type = 'success') => {
    toast.update(toastId, {
      render: message,
      type,
      isLoading: false,
      autoClose: 3000,
    });
  };

  return { success, error, warning, info, loading, dismiss, update };
}
