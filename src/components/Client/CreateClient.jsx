import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createClient } from '../../redux/slices/clientSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateClient = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    email: '',
    password:'',
    role:'',
    phone: '',
  });

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (formData.name === '' || formData.email === '') {
      toast.error('El nombre y el email son obligatorios', { position: "top-center" });
      return;
    }
    try{
      dispatch(createClient(formData));
      toast.success('Cliente creado con éxito', { position: "top-center" });
    }
    catch(error){
      toast.error(error, { position: "top-center" });
    }
    
    // Limpiar formulario
    setFormData({
      name: '',
      email: '',
      password: '',
      role:'',
    });
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.1)] font-sans">
      <ToastContainer />
      <h1 className="text-center text-2xl font-bold mb-6 text-brand-primary">Crear Usuario</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="mb-5">
          <label htmlFor="name" className="block text-sm mb-1 text-gray-700 font-medium">Nombre <span className="text-red-500 font-bold">*</span></label>
          <input
            type="text"
            id="name"
            placeholder="Nombre del Cliente"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md text-base transition-colors focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
          />
        </div>
        
        <div className="mb-5">
          <label htmlFor="email" className="block text-sm mb-1 text-gray-700 font-medium">Correo</label>
          <input
            type="text"
            id="email"
            placeholder="Correo Electronico"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md text-base transition-colors focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block text-sm mb-1 text-gray-700 font-medium">Contraseña</label>
          <input
            type="text"
            id="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md text-base transition-colors focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="role" className="block text-sm mb-1 text-gray-700 font-medium">Rol <span className="text-red-500 font-bold">*</span></label>
          <input
            type="text"
            id="role"
            placeholder="Rol"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md text-base transition-colors focus:border-brand-secondary focus:outline-none focus:ring-1 focus:ring-brand-secondary"
          />
        </div>

        <button type="submit" className="w-full p-3 bg-brand-secondary border-none rounded-md text-white text-base font-bold cursor-pointer transition-colors hover:bg-brand-secondary-light mt-2">Crear Cliente</button>
      </form>
    </div>
  );
};

export default CreateClient;
