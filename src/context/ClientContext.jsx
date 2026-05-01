import { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import logger from '../utils/logger';
import { clientService } from '../services/clientService';
import { useNotification } from '../hooks/useNotification';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const notify = useNotification();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState('');

  const fetchClients = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      logger.error('Error al cargar clientes:', err);
      setError('Error al cargar clientes');
      notify.error('Error al cargar clientes', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter(
      (client) =>
        (client.name || '').toLowerCase().includes(term) ||
        (client.email || '').toLowerCase().includes(term) ||
        (client.company || '').toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredClients.slice(start, start + rowsPerPage);
  }, [filteredClients, page]);

  const totalPages = Math.ceil(filteredClients.length / rowsPerPage);

  const openCreateDialog = () => setIsCreateOpen(true);

  const openEditDialog = (client) => {
    setSelectedClient(client);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (client) => {
    setSelectedClient(client);
    setIsDeleteOpen(true);
  };

  const closeAllDialogs = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedClient(null);
  };

  const handleCreateSuccess = () => {
    fetchClients();
    closeAllDialogs();
    notify.success('Cliente creado exitosamente');
  };

  const handleEditSuccess = () => {
    fetchClients();
    closeAllDialogs();
    notify.success('Cliente actualizado exitosamente');
  };

  const handleDeleteSuccess = (deletedId) => {
    setClients((prev) =>
      prev.filter((c) => (c.clientId || c.id) !== deletedId)
    );
    closeAllDialogs();
    notify.success('Cliente eliminado exitosamente');
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const value = {
    clients,
    filteredClients,
    paginatedClients,
    loading,
    error,
    page,
    totalPages,
    rowsPerPage,
    searchTerm,
    setSearchTerm,
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    selectedClient,
    fetchClients,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeAllDialogs,
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    handlePageChange,
    setIsCreateOpen,
    setIsEditOpen,
    setIsDeleteOpen,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient debe ser usado dentro de un ClientProvider');
  }
  return context;
};
