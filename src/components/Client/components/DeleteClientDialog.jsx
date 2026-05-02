import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Button, Typography, CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ActionButton } from './DialogStyles';

export const DeleteClientDialog = ({ open, user, onClose, onSuccess, token }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) {
      toast.error('No se ha seleccionado ningún cliente para eliminar', { position: 'top-center' }); return;
    }
    
    const clientId = user.clientId;
    if (!clientId) {
      toast.error('El cliente seleccionado no tiene un ID definido', { position: 'top-center' }); return;
    }

    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/clients/${clientId}`, {
        headers: { 'Content-Type': 'application/json', 'accesstoken': token }
      });
      
      toast.success('Cliente eliminado correctamente', { position: 'top-center' });
      onSuccess(clientId);
      onClose();
    } catch (err) {
      toast.error(`Error al eliminar cliente: ${err.response?.data?.message || err.message}`, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}
      PaperProps={{
        sx: { borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', '& .MuiDialogTitle-root': { background: 'var(--color-error)', color: 'white', padding: '1.25rem 1.5rem' } }
      }}
    >
      <DialogTitle sx={{ background: 'var(--color-error)', color: 'white' }}>
        Confirmar Eliminación
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
        <Typography variant="body1">
          ¿Estás seguro de que deseas eliminar al cliente <strong>{user?.name}</strong>?
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '1rem 1.5rem' }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancelar</Button>
        <ActionButton variant="delete" onClick={handleDelete} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Eliminar Cliente'}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};
