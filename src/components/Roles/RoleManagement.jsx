import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUsers, updateRole } from '../../redux/slices/roleSlice';
import { CircularProgress, Alert, Pagination } from '@mui/material';
import logger from '../../utils/logger';

const RoleManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.roles);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUsers());
    }
  }, [dispatch, accessToken]);

  const handleRoleChange = async (userId, newRole) => {
    const user = users.find((u) => (u.userId || u.id) === userId);
    const userName = user?.name || user?.userName || `Usuario #${userId}`;

    const confirmChange = window.confirm(
      `¿Estás seguro de cambiar el rol de ${userName} a ${newRole}?`
    );
    if (!confirmChange) return;

    try {
      await dispatch(updateRole({ userId, role: newRole })).unwrap();
      toast.success(`Rol actualizado a ${newRole} para ${userName}`);
      dispatch(fetchUsers());
    } catch (err) {
      logger.error('Error al actualizar rol:', err);
      toast.error('Error al actualizar el rol');
    }
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-5 md:p-8 bg-white max-w-4xl mx-auto my-6 md:my-12 rounded-xl shadow-lg">
      <h1 className="text-center text-2xl md:text-3xl text-gray-800 mb-8 font-bold">
        Gestión de Roles
      </h1>

      {loading && (
        <div className="flex justify-center p-10">
          <CircularProgress />
        </div>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-5">
            <thead className="bg-brand-secondary text-white">
              <tr>
                <th className="p-3 md:p-4 text-left font-bold text-sm md:text-base border-b border-gray-200">
                  Nombre
                </th>
                <th className="p-3 md:p-4 text-left font-bold text-sm md:text-base border-b border-gray-200">
                  Email
                </th>
                <th className="p-3 md:p-4 text-left font-bold text-sm md:text-base border-b border-gray-200">
                  Rol
                </th>
                <th className="p-3 md:p-4 text-left font-bold text-sm md:text-base border-b border-gray-200">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => {
                const userId = user.userId || user.id;
                return (
                  <tr
                    key={userId}
                    className="even:bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
                  >
                    <td className="p-3 md:p-4 text-left border-b border-gray-200">
                      {user.name || user.userName}
                    </td>
                    <td className="p-3 md:p-4 text-left border-b border-gray-200">
                      {user.email}
                    </td>
                    <td className="p-3 md:p-4 text-left border-b border-gray-200">
                      {user.role}
                    </td>
                    <td className="p-3 md:p-4 text-left border-b border-gray-200">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(userId, e.target.value)}
                        className="w-full md:w-auto p-2 rounded border border-gray-300 text-sm bg-white cursor-pointer transition-all focus:border-brand-secondary focus:outline-none hover:bg-blue-50"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Worker">Worker</option>
                        <option value="Client">Client</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center mt-5">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
              />
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default RoleManagement;
