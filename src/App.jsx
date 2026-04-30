import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './routes/ProtectedRoute';

// Lazy loading para mejorar el rendimiento inicial (Code Splitting)
const Login = lazy(() => import('./components/Auth/Login'));
const AdminDashboard = lazy(() => import('./components/Dashboard/AdminDashboard'));
const EditClient = lazy(() => import('./components/Client/EditClient'));
const UserManagement = lazy(() => import('./components/Client/UserManagement'));
const RoleManagement = lazy(() => import('./components/Roles/RoleManagement')); // Nueva gestión de roles
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard')); // Importa el Dashboard aquí
const CreateUser = lazy(() => import('./components/Client/CreateUser'));

const LoadingFallback = () => <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>Cargando...</div>;
const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        {/* Ruta para el login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida para el Dashboard del Administrador */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute roles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* Ruta protegida para crear un cliente */}
        <Route
          path="/create-users-register"
          element={
            <ProtectedRoute roles={['Admin']}>
              {/*<CreateClient />*/}
              <CreateUser />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para editar un cliente */}
        <Route
          path="/edit-client/:id"
          element={
            <ProtectedRoute roles={['Admin']}>
              <EditClient />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para ver la tabla de clientes */}
        <Route
          path="/clients"
          element={
            <ProtectedRoute roles={['Admin', 'Worker']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para gestionar roles */}
        <Route
          path="/roles"
          element={
            <ProtectedRoute roles={['Admin']}>
              <RoleManagement /> {/* Nueva gestión de roles */}
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para el Dashboard de Clientes/Trabajadores */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['Admin', 'Worker', 'Client']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirección condicional a dashboard o login */}
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />

        {/* Ruta de acceso denegado */}
        <Route path="/unauthorized" element={<h1>Acceso no autorizado</h1>} />
      </Routes>
      </Suspense>
    </div>
  );
};

export default App;
