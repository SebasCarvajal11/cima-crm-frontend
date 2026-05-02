import { useState, useMemo } from 'react';
import { ProjectFormContext } from './context';
import { useGetClientsQuery } from '../../../../redux/api';
import { normalizeClient } from '../../../../utils/normalizeEntity';
import { PROJECT_STATUS } from '../../../../constants';

export function ProjectFormProvider({ children, initialData, onSubmit, open }) {
  const [formData, setFormData] = useState(
    initialData || {
      clientId: '',
      projectName: '',
      description: '',
      status: PROJECT_STATUS.PENDING
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { data: rawClients = [], isLoading, error } = useGetClientsQuery(undefined, {
    skip: !open,
  });

  const clients = useMemo(() => {
    return rawClients.map((client) => {
      const normalized = normalizeClient(client);
      return {
        id: normalized.id,
        name: normalized.name,
        email: normalized.email,
        address: normalized.address,
      };
    });
  }, [rawClients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'clientId' ? (value ? parseInt(value, 10) : '') : value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isValid) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onSubmit(formData);
    } catch {
      setSubmitError('Error al procesar el formulario. Por favor, inténtelo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = Boolean(formData.clientId && formData.projectName);

  const value = {
    state: {
      formData,
      clients,
      loading: isLoading,
      error: error ? 'No se pudieron cargar los clientes. Por favor, inténtelo de nuevo.' : submitError,
      isSubmitting,
      isValid,
    },
    actions: {
      handleChange,
      handleSubmit,
    }
  };

  return (
    <ProjectFormContext.Provider value={value}>
      {children}
    </ProjectFormContext.Provider>
  );
}
