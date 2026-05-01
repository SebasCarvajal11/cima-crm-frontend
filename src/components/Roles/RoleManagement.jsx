import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoleManagement = () => {
  // Datos ficticios para pruebas
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin' },
    { id: 2, name: 'Ana García', email: 'ana@example.com', role: 'Worker' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'Client' },
    // ... (Añade más datos para pruebas si es necesario)
  ]);

  const [currentPage, setCurrentPage] = useState(1);  // Estado de la página actual
  const usersPerPage = 2;  // Cantidad de usuarios por página

  const handleRoleChange = (userId, newRole) => {
    // Confirmación antes de cambiar el rol
    const confirmChange = window.confirm(`¿Estás seguro de cambiar el rol a ${newRole}?`);
    if (confirmChange) {
      // Actualizar el rol del usuario en el array de datos ficticios
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);  // Actualizar el estado con los nuevos datos

      // Mostrar notificación de éxito
      toast.success(`Rol actualizado a ${newRole} para ${updatedUsers.find(user => user.id === userId).name}`);
    }
  };

  // Lógica para paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-5 md:p-8 bg-white max-w-4xl mx-auto my-6 md:my-12 rounded-xl shadow-lg">
      <h1 className="text-center text-2xl md:text-3xl text-gray-800 mb-8 font-bold">Gestión de Roles</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-5">
          <thead className="bg-brand-secondary text-white">
            <tr>
              <th className="p-3 md:p-4 text-left font-bold text-sm md:text-base border-b border-gray-200">Nombre</th>
              <th className="p-3 md:p-4 text-left font-bold text-sm md:text-base border-b border-gray-200">Email</th>
              <th className="p-3 md:p-4 text-left font-bold text-sm md:text-base border-b border-gray-200">Rol</th>
              <th className="p-3 md:p-4 text-left font-bold text-sm md:text-base border-b border-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} className="even:bg-gray-50 hover:bg-blue-50 transition-colors duration-300">
                <td className="p-3 md:p-4 text-left border-b border-gray-200">{user.name}</td>
                <td className="p-3 md:p-4 text-left border-b border-gray-200">{user.email}</td>
                <td className="p-3 md:p-4 text-left border-b border-gray-200">{user.role}</td>
                <td className="p-3 md:p-4 text-left border-b border-gray-200">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="w-full md:w-auto p-2 rounded border border-gray-300 text-sm bg-white cursor-pointer transition-all focus:border-brand-secondary focus:outline-none hover:bg-blue-50"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Worker">Worker</option>
                    <option value="Client">Client</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination
        usersPerPage={usersPerPage}
        totalUsers={users.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      {/* Componente para mostrar las notificaciones */}
      <ToastContainer />
    </div>
  );
};

// Componente de paginación
const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="text-center mt-5">
      <ul className="inline-flex list-none p-0 flex-wrap justify-center gap-2">
        {pageNumbers.map(number => (
          <li key={number} className="mx-1">
            <button 
              onClick={() => paginate(number)} 
              className={`px-4 py-2 border rounded transition-colors cursor-pointer ${currentPage === number ? 'bg-brand-secondary-light text-white border-brand-secondary-light' : 'text-brand-secondary border-gray-300 hover:bg-brand-secondary hover:text-white'}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default RoleManagement;
