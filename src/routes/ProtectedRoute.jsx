import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ roles, children }) => {
  const { user } = useSelector((state) => state.auth);

  // Verificación de autenticación
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Verificación de rol
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // Renderiza el componente hijo directamente
  return children;
};

export default ProtectedRoute;
