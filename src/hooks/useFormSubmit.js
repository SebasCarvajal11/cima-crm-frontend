import { useState, useCallback } from 'react';
import { useNotification } from './useNotification';

export function useFormSubmit() {
  const [loading, setLoading] = useState(false);
  const notify = useNotification();

  const submit = useCallback(async (apiCall, { onSuccess, successMessage, errorMessage } = {}) => {
    try {
      setLoading(true);
      const result = await apiCall();
      if (successMessage) notify.success(successMessage);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      const msg = errorMessage || err.response?.data?.message || err.message || 'Error inesperado';
      notify.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notify]);

  return { submit, loading };
}
