// components/Client/EditClient.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClientById, updateClient } from '../../redux/slices/clientSlice';
import { useParams } from 'react-router-dom';

const EditClient = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { client } = useSelector((state) => state.clients);
  
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    dispatch(getClientById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateClient({ id, ...formData }));
  };

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
        {/* Similar para otros campos, si se añaden luego */}
        <button type="submit" className="w-full p-3 bg-green-600 text-white rounded font-bold mt-4 hover:bg-green-700 transition-colors">
          Actualizar Cliente
        </button>
      </form>
    </div>
  );
};

export default EditClient;
