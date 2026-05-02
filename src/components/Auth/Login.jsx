import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, status } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex-1 flex justify-center items-center bg-gray-50 fluid-padding">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] w-full max-w-md">
          <h2 className="fluid-text-2xl text-center text-gray-800 mb-2 font-bold tracking-tight">Sistema de gestión de CIMA</h2>
          <h3 className="fluid-text-base text-center text-brand-primary mb-6 font-medium">Inicia sesión con tus credenciales asignadas</h3>
          
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="email" className="sr-only">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 mb-4 border border-gray-200 rounded-xl text-base bg-gray-50 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 mb-6 border border-gray-200 rounded-xl text-base bg-gray-50 transition-all duration-200 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/20"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <button 
              type="submit" 
              disabled={status === 'loading'} 
              aria-busy={status === 'loading'}
              className="w-full py-3 px-4 bg-brand-primary text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-brand-primary-light hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg"
            >
              {status === 'loading' ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
            
            {error && <p className="text-red-500 text-center fluid-text-sm mt-4 font-medium">{error}</p>}
          </form>
        </div>
      </div>
      
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-brand-primary text-white flex flex-col justify-center p-10 md:p-16 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">¡Bienvenido!</h1>
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto md:mx-0">
          Este sistema te permitirá gestionar los proyectos de manera eficiente, asignar tareas,
          visualizar estados y colaborar con tu equipo en tiempo real.
        </p>
      </div>
    </div>
  );
};

export default Login;
