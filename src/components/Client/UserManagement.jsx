import { useState } from 'react';
import { useSelector } from 'react-redux';
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
import UsersInterface from './UsersInterface';
import { CreateClientDialog } from './components/CreateClientDialog';
import { EditClientDialog } from './components/EditClientDialog';
import { DeleteClientDialog } from './components/DeleteClientDialog';
import { ClientProvider, useClient } from '../../context/ClientContext';
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
  const token = useSelector((state) => state.auth.accessToken);
  const {
    loading,
    error,
    paginatedClients,
    isCreateOpen,
    isEditOpen,
    isDeleteOpen,
    selectedClient,
    fetchClients,
    openEditDialog,
    openDeleteDialog,
    handleDeleteSuccess,
    setIsCreateOpen,
    setIsEditOpen,
    setIsDeleteOpen,
  } = useClient();

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: '2rem', textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <EnhancedTableContainer>
          <ClientTableToolbar />

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
              {paginatedClients.map((client) => (
                <ClientTableRow
                  key={client.clientId || client.id || client.email}
                  client={client}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              ))}
            </TableBody>
          </Table>

          <ClientPagination />
        </EnhancedTableContainer>
      </motion.div>

      <CreateClientDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={fetchClients} token={token} />
      <EditClientDialog open={isEditOpen} user={selectedClient} onClose={() => setIsEditOpen(false)} onSuccess={fetchClients} token={token} />
      <DeleteClientDialog open={isDeleteOpen} user={selectedClient} onClose={() => setIsDeleteOpen(false)} onSuccess={handleDeleteSuccess} token={token} />
    </>
  );
};

const UserManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const token = useSelector((state) => state.auth.accessToken);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ClientProvider>
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
            <UsersInterface token={token} />
          </motion.div>
        </TabPanel>
      </Box>
    </ClientProvider>
  );
};

export default UserManagement;
