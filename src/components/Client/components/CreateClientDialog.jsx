import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  IconButton, Button, CircularProgress, Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ActionButton } from './DialogStyles';

export const CreateClientDialog = ({ open, onClose, onSuccess, token }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Client',
    address: '', phone: '', contactInfo: '', additionalInfo: '', plan: 'Oro'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Nombre y Email son obligatorios', { position: 'top-center' }); return;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error('La contraseña es obligatoria y debe tener al menos 6 caracteres', { position: 'top-center' }); return;
    }

    setLoading(true);
    try {
      const clientData = {
        name: formData.name, email: formData.email,
        password: formData.password, role: 'Client'
      };
      if (formData.contactInfo || formData.phone) clientData.contactInfo = formData.contactInfo || formData.phone;
      if (formData.address) clientData.address = formData.address;
      if (formData.additionalInfo) clientData.additionalInfo = formData.additionalInfo;
      if (formData.plan) clientData.plan = formData.plan;

      await axios.post(`${import.meta.env.VITE_API_URL}/clients/register`, clientData, {
        headers: { 'Content-Type': 'application/json', 'accesstoken': token }
      });
      
      toast.success('Cliente creado exitosamente', { position: 'top-center' });
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(`Error: ${err.response?.data?.message || 'Ocurrió un problema'}`, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', '& .MuiDialogTitle-root': { background: 'var(--color-brand-primary)', color: 'white', padding: '1.25rem 1.5rem' } }
      }}
    >
      <DialogTitle>
        Crear Nuevo Cliente
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '1.5rem' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField fullWidth label="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Contraseña" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} margin="normal" required />
          <TextField fullWidth label="Dirección" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} margin="normal" />
          <TextField fullWidth label="Teléfono" value={formData.phone || formData.contactInfo} onChange={(e) => setFormData({ ...formData, phone: e.target.value, contactInfo: e.target.value })} margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Plan</InputLabel>
            <Select value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value })} label="Plan">
              <MenuItem value="Oro">Oro</MenuItem>
              <MenuItem value="Esmeralda">Esmeralda</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Información Adicional" value={formData.additionalInfo} onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })} margin="normal" multiline rows={3} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '1rem 1.5rem' }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancelar</Button>
        <ActionButton variant="create" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Crear Cliente'}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};
