import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import logger from '../../utils/logger';
import { stringToColor, getInitials } from '../../utils/colorUtils';

const ClientDashboard = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      if (!accessToken) return;
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/clients`, {
          headers: {
            'Content-Type': 'application/json',
            accesstoken: accessToken,
          },
        });
        setClients(response.data.clients || []);
      } catch (err) {
        logger.error('Error al cargar clientes:', err);
        setError('Error al cargar los clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [accessToken]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(
      (c) =>
        (c.clientName || c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  const stats = useMemo(() => {
    const total = clients.length;
    return [
      { label: 'Total', count: total },
      { label: 'Activos', count: total },
    ];
  }, [clients]);

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
            sx={{
              background: 'linear-gradient(45deg, #3498db 30%, #2980b9 90%)',
              borderRadius: 2,
            }}
          >
            Nuevo Cliente
          </Button>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.label}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'white',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {category.count}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {category.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {filteredClients.map((client) => {
          const clientId = client.clientId || client.id;
          const clientName = client.clientName || client.name || `Cliente #${clientId}`;
          const initials = getInitials(clientName);

          return (
            <Grid item xs={12} md={6} lg={4} key={clientId}>
              <Card
                sx={{
                  borderRadius: 3,
                  '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.1)' },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: stringToColor(clientName),
                        width: 56,
                        height: 56,
                        mr: 2,
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {clientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {client.phone || 'Sin teléfono'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MailIcon fontSize="small" color="action" />
                        <Typography variant="body2">{client.email || 'Sin email'}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        {filteredClients.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', p: 4 }}>
              No se encontraron clientes
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ClientDashboard;
