import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProjectFormContext } from './context';

export function ProjectFormProvider({ children, initialData, onSubmit, open }) {
  const [formData, setFormData] = useState(
    initialData || {
      clientId: '',
      projectName: '',
      description: '',
      status: 'Pending'
    }
  );
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    let isMounted = true;
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/clients`, {
          headers: {
            'accesstoken': localStorage.getItem('accessToken')
          }
        });
        
        if (isMounted) {
          const clientsData = response.data.clients || [];
          const formattedClients = clientsData.map(client => ({
            id: client.clientId || client.id,
            name: client.name || client.clientName || `Cliente ${client.clientId || client.id}`,
            email: client.email,
            address: client.address
          }));
          
          setClients(formattedClients);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error al cargar clientes:', err);
          setError('No se pudieron cargar los clientes. Por favor, inténtelo de nuevo.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchClients();
    return () => {
      isMounted = false;
    };
  }, [open]);

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
      await onSubmit(formData);
    } catch (err) {
      setError('Error al procesar el formulario. Por favor, inténtelo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = Boolean(formData.clientId && formData.projectName);

  const value = {
    state: {
      formData,
      clients,
      loading,
      error,
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
