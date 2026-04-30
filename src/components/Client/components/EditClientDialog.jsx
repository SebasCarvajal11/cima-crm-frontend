import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  IconButton, Button, CircularProgress, Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ActionButton } from './DialogStyles';

export const EditClientDialog = ({ open, user, onClose, onSuccess, token }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', role: 'Client',
    address: '', phone: '', contactInfo: '', additionalInfo: '', plan: 'Oro'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ 
        ...user,
        contactInfo: user.contactInfo || user.phone || '',
        phone: user.phone || user.contactInfo || '',
        additionalInfo: user.additionalInfo || '',
        plan: user.plan || 'Oro'
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Nombre y Email son obligatorios', { position: 'top-center' }); return;
    }
    
    const clientId = user.clientId;
    if (!clientId) {
      toast.error('El cliente seleccionado no tiene un ID definido', { position: 'top-center' }); return;
    }

    setLoading(true);
    try {
      const updateData = {
        contactInfo: formData.contactInfo || formData.phone,
        address: formData.address,
        additionalInfo: formData.additionalInfo,
        plan: formData.plan
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/clients/${clientId}`, updateData, {
        headers: { 'Content-Type': 'application/json', 'accesstoken': token }
      });
      
      toast.success('Cliente actualizado exitosamente', { position: 'top-center' });
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
        sx: { borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', '& .MuiDialogTitle-root': { background: '#8e3031', color: 'white', padding: '20px 24px' } }
      }}
    >
      <DialogTitle>
        Editar Cliente
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField fullWidth label="Nombre" value={formData.name} margin="normal" disabled />
          <TextField fullWidth label="Email" type="email" value={formData.email} margin="normal" disabled />
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
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} sx={{ color: '#7e8299' }}>Cancelar</Button>
        <ActionButton variant="create" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};
