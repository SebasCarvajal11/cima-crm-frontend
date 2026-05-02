import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';

const ProtectedRoute = ({ roles, children }) => {
  const { user } = useSelector((state) => state.auth);

  // Verificación de autenticación
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  // Verificación de rol
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} />;
  }

  // Renderiza el componente hijo directamente
  return children;
};

export default ProtectedRoute;
