import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  IconButton, Button, CircularProgress, Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ActionButton } from './DialogStyles';
import { useUpdateClientMutation } from '../../../redux/api';
import { ROLES } from '../../../constants';
import { useNotification } from '../../../hooks/useNotification';

export const EditClientDialog = ({ open, user, onClose, onSuccess }) => {
  const notify = useNotification();
  const [updateClient, { isLoading }] = useUpdateClientMutation();
  const [formData, setFormData] = useState({
    name: '', email: '', role: ROLES.CLIENT,
    address: '', phone: '', contactInfo: '', additionalInfo: '', plan: 'Oro'
  });

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
      notify.error('Nombre y Email son obligatorios'); return;
    }

    const clientId = user.clientId || user.id;
    if (!clientId) {
      notify.error('El cliente seleccionado no tiene un ID definido'); return;
    }

    const updateData = {
      contactInfo: formData.contactInfo || formData.phone,
      address: formData.address,
      additionalInfo: formData.additionalInfo,
      plan: formData.plan
    };

    try {
      await updateClient({ id: clientId, ...updateData }).unwrap();
      notify.success('Cliente actualizado exitosamente');
      onSuccess();
      onClose();
    } catch (err) {
      notify.error(`Error: ${err.message || 'Ocurrió un problema'}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', '& .MuiDialogTitle-root': { background: 'var(--color-brand-primary)', color: 'white', padding: '1.25rem 1.5rem' } }
      }}
    >
      <DialogTitle>
        Editar Cliente
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '1.5rem' }}>
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
      <DialogActions sx={{ padding: '1rem 1.5rem' }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancelar</Button>
        <ActionButton variant="create" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};
