import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROUTES, ROLES } from './constants';

// Lazy loading para mejorar el rendimiento inicial (Code Splitting)
const Login = lazy(() => import('./components/Auth/Login'));
const AdminDashboard = lazy(() => import('./components/Dashboard/AdminDashboard'));
const EditClient = lazy(() => import('./components/Client/EditClient'));
const UserManagement = lazy(() => import('./components/Client/UserManagement'));
const RoleManagement = lazy(() => import('./components/Roles/RoleManagement')); // Nueva gestión de roles
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard')); // Importa el Dashboard aquí

const LoadingFallback = () => <div className="flex justify-center p-12">Cargando...</div>;
const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        {/* Ruta para el login */}
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Ruta protegida para el Dashboard del Administrador */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Ruta legacy redirigida a UserManagement */}
        <Route
          path="/create-users-register"
          element={<Navigate to={ROUTES.CLIENTS} replace />}
        />

        {/* Ruta protegida para editar un cliente */}
        <Route
          path={`${ROUTES.EDIT_CLIENT}/:id`}
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <EditClient />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para ver la tabla de clientes */}
        <Route
          path={ROUTES.CLIENTS}
          element={
            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.WORKER]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para gestionar roles */}
        <Route
          path={ROUTES.ROLES}
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <RoleManagement /> {/* Nueva gestión de roles */}
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para el Dashboard de Clientes/Trabajadores */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.WORKER, ROLES.CLIENT]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirección condicional a dashboard o login */}
        <Route path="/" element={<Navigate to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN} />} />

        {/* Ruta de acceso denegado */}
        <Route path={ROUTES.UNAUTHORIZED} element={<h1>Acceso no autorizado</h1>} />
      </Routes>
      </Suspense>
    </div>
  );
};

export default App;
