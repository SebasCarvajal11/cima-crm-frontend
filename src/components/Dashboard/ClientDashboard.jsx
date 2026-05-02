import { useState, useMemo } from 'react';
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
import { CreateClientDialog } from '../Client/components/CreateClientDialog';
import { ClientDashboardStats } from './ClientDashboardStats';
import { ClientDashboardSearchBar } from './ClientDashboardSearchBar';
import { ClientDashboardCard } from './ClientDashboardCard';
import { EmptyState } from '../ui/EmptyState';
import { useGetClientsQuery } from '../../redux/api';

const ClientDashboard = () => {
  const { data: clients = [], isLoading, error } = useGetClientsQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter(
      (client) =>
        (client.name || '').toLowerCase().includes(term) ||
        (client.email || '').toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Error al cargar los clientes</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        background: 'linear-gradient(135deg, var(--color-background) 0%, var(--color-background) 100%)',
        minHeight: '100vh',
      }}
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, var(--color-text-primary) 30%, var(--color-info) 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Gestión de Clientes
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Administra y supervisa toda la información de tus clientes en un solo lugar
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderRadius: 2 }}>
            Exportar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateOpen(true)}
            sx={{
              background: 'linear-gradient(45deg, var(--color-info) 30%, var(--color-info) 90%)',
              borderRadius: 2,
            }}
          >
            Nuevo Cliente
          </Button>
        </Grid>
      </Grid>

      <ClientDashboardSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ClientDashboardStats clients={clients} />

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
        onSuccess={() => setIsCreateOpen(false)}
      />
    </Box>
  );
};

export default ClientDashboard;
