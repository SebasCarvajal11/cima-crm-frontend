import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROUTES, ROLES } from './constants';
import { AppErrorBoundary } from './components/ui';

const Login = lazy(() => import('./components/Auth/Login'));
const AdminDashboard = lazy(() => import('./components/Dashboard/AdminDashboard'));
const EditClient = lazy(() => import('./components/Client/EditClient'));
const UserManagement = lazy(() => import('./components/Client/UserManagement'));
const RoleManagement = lazy(() => import('./components/Roles/RoleManagement'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));

const LoadingFallback = () => <div className="flex justify-center p-12">Cargando...</div>;

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <AppErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />

          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-users-register"
            element={<Navigate to={ROUTES.CLIENTS} replace />}
          />

          <Route
            path={`${ROUTES.EDIT_CLIENT}/:id`}
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <EditClient />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.CLIENTS}
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.WORKER]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ROLES}
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <RoleManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.WORKER, ROLES.CLIENT]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN} />} />

          <Route path={ROUTES.UNAUTHORIZED} element={<h1>Acceso no autorizado</h1>} />
        </Routes>
      </Suspense>
    </AppErrorBoundary>
  );
};

export default App;
