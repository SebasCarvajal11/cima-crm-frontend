import { useState, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People as PeopleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { useGetClientsQuery } from '../../redux/api';
import { usePagination } from '../../hooks/usePagination';
import UsersInterface from './UsersInterface';
import { CreateClientDialog } from './components/CreateClientDialog';
import { EditClientDialog } from './components/EditClientDialog';
import { DeleteClientDialog } from './components/DeleteClientDialog';
import { ClientTableToolbar } from './components/ClientTableToolbar';
import { ClientTableRow } from './components/ClientTableRow';
import { ClientPagination } from './components/ClientPagination';
import { EnhancedTableContainer, StyledTableHead } from './components/SharedStyles';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
      className="w-full"
    >
      {value === index && <Box sx={{ pt: '1.5rem' }}>{children}</Box>}
    </div>
  );
}

const ClientListContent = () => {
  const { data: clients = [], isLoading, error } = useGetClientsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

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

  const { page, setPage, totalPages, paginatedItems, currentCount, totalCount } = usePagination(filteredClients);

  const openEditDialog = (client) => {
    setSelectedClient(client);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (client) => {
    setSelectedClient(client);
    setIsDeleteOpen(true);
  };

  const handleDeleteSuccess = () => {
    setIsDeleteOpen(false);
    setSelectedClient(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: '2rem', textAlign: 'center' }}>
        Error al cargar los clientes
      </Typography>
    );
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <EnhancedTableContainer>
          <ClientTableToolbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onCreate={() => setIsCreateOpen(true)}
          />

          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell className="hide-mobile">Plan</TableCell>
                <TableCell className="hide-tablet">Dirección</TableCell>
                <TableCell className="hide-tablet">Teléfono</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {paginatedItems.map((client) => (
                <ClientTableRow
                  key={client.clientId || client.id || client.email}
                  client={client}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              ))}
            </TableBody>
          </Table>

          <ClientPagination
            paginatedCount={currentCount}
            totalCount={totalCount}
            page={page}
            totalPages={totalPages}
            onPageChange={(_, value) => setPage(value)}
          />
        </EnhancedTableContainer>
      </motion.div>

      <CreateClientDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => setIsCreateOpen(false)}
      />
      <EditClientDialog
        open={isEditOpen}
        user={selectedClient}
        onClose={() => { setIsEditOpen(false); setSelectedClient(null); }}
        onSuccess={() => { setIsEditOpen(false); setSelectedClient(null); }}
      />
      <DeleteClientDialog
        open={isDeleteOpen}
        user={selectedClient}
        onClose={() => { setIsDeleteOpen(false); setSelectedClient(null); }}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
};

const UserManagement = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className="fluid-padding-lg" sx={{ background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f5f9 100%)', minHeight: '100vh' }}>
      <ToastContainer />

      <Box sx={{ mb: '3rem', textAlign: 'center', position: 'relative', '&::after': { content: '""', position: 'absolute', bottom: '-0.9375rem', left: '50%', transform: 'translateX(-50%)', width: '3.75rem', height: '0.25rem', background: 'var(--color-brand-primary-light)', borderRadius: '0.125rem' } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: '0.5rem' }}>
          Gestión de Usuarios
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Administra y gestiona todos los usuarios del sistema
        </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: '0.625rem',
          boxShadow: '0 0 20px 0 rgba(82, 63, 105, 0.1)',
          mb: '1.5rem',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: 'var(--color-brand-primary-light)' },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              color: 'text.secondary',
              '&.Mui-selected': { color: 'var(--color-brand-primary-light)', fontWeight: 600 },
            },
          }}
        >
          <Tab icon={<PersonIcon />} iconPosition="start" label="Clientes" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Usuarios" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <ClientListContent />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <UsersInterface />
        </motion.div>
      </TabPanel>
    </Box>
  );
};

export default UserManagement;
