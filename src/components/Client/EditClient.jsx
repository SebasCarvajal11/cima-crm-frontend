import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetClientByIdQuery, useUpdateClientMutation } from '../../redux/api';
import { useNotification } from '../../hooks/useNotification';
import { MESSAGES } from '../../constants';
import { CircularProgress } from '@mui/material';

const EditClient = () => {
  const { id } = useParams();
  const notify = useNotification();
  const { data: client, isLoading: isLoadingClient } = useGetClientByIdQuery(id);
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        contact: client.contact || '',
        address: client.address || '',
        email: client.email || '',
        phone: client.phone || '',
      });
    }
  }, [client]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClient({ id, ...formData }).unwrap();
      notify.success(MESSAGES.SUCCESS.CLIENT.UPDATE);
    } catch (err) {
      notify.error(MESSAGES.ERROR.CLIENT.UPDATE, err);
    }
  };

  if (isLoadingClient) {
    return (
      <div className="flex justify-center p-10">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 max-w-xl mx-auto my-10 md:my-12 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] font-sans">
      <h1 className="text-center mb-6 text-2xl font-bold text-gray-800">Editar Cliente</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          placeholder="Nombre"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="block w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="block w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="block w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
        />
        <input
          type="text"
          placeholder="Dirección"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="block w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary"
        />
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full p-3 bg-green-600 text-white rounded font-bold mt-4 hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {isUpdating ? 'Actualizando...' : 'Actualizar Cliente'}
        </button>
      </form>
    </div>
  );
};

export default EditClient;
