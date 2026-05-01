import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { ClientProvider, useClient } from '../../context/ClientContext';
import { CreateClientDialog } from '../Client/components/CreateClientDialog';
import { ClientDashboardStats } from './ClientDashboardStats';
import { ClientDashboardSearchBar } from './ClientDashboardSearchBar';
import { ClientDashboardCard } from './ClientDashboardCard';
import { EmptyState } from '../ui/EmptyState';

const ClientDashboardContent = () => {
  const token = useSelector((state) => state.auth.accessToken);
  const {
    filteredClients,
    loading,
    error,
    isCreateOpen,
    openCreateDialog,
    setIsCreateOpen,
    fetchClients,
  } = useClient();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f5f9 100%)',
        minHeight: '100vh',
      }}
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Gestin de Clientes
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Administra y supervisa toda la informacin de tus clientes en un solo lugar
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderRadius: 2 }}>
            Exportar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            sx={{
              background: 'linear-gradient(45deg, #3498db 30%, #2980b9 90%)',
              borderRadius: 2,
            }}
          >
            Nuevo Cliente
          </Button>
        </Grid>
      </Grid>

      <ClientDashboardSearchBar />
      <ClientDashboardStats />

      <Grid container spacing={3}>
        {filteredClients.map((client) => (
          <ClientDashboardCard key={client.clientId || client.id} client={client} />
        ))}
        {filteredClients.length === 0 && (
          <Grid item xs={12}>
            <EmptyState message="No se encontraron clientes" />
          </Grid>
        )}
      </Grid>

      <CreateClientDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchClients}
        token={token}
      />
    </Box>
  );
};

const ClientDashboard = () => (
  <ClientProvider>
    <ClientDashboardContent />
  </ClientProvider>
);

export default ClientDashboard;
