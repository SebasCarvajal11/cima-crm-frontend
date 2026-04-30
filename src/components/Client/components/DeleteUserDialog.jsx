import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Button, Typography, CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ActionButton = ({ children, disabled, onClick }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    sx={{
      background: 'linear-gradient(45deg, #e74c3c 30%, #c0392b 90%)',
      boxShadow: '0 3px 5px 2px rgba(231, 76, 60, .3)',
      borderRadius: '8px',
      padding: '10px 25px',
      color: 'white',
      textTransform: 'none',
      fontWeight: 600,
      '&:hover': {
        background: 'linear-gradient(45deg, #c0392b 30%, #a93226 90%)',
      }
    }}
  >
    {children}
  </Button>
);

export const DeleteUserDialog = ({ open, user, onClose, onSuccess, token }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) {
      toast.error('No se ha seleccionado ningún usuario para eliminar', { position: 'top-center' });
      return;
    }

    const userId = user.userId || user.id;
    if (!userId) {
      toast.error('El usuario seleccionado no tiene un ID definido', { position: 'top-center' });
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': token
        }
      });

      toast.success('Usuario eliminado correctamente', { position: 'top-center' });
      onSuccess(userId);
      onClose();
    } catch (err) {
      toast.error(`Error al eliminar usuario: ${err.response?.data?.message || err.message}`, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ background: '#f1416c', color: 'white' }}>
        Confirmar Eliminación
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '24px', paddingTop: '24px' }}>
        <Typography variant="body1">
          ¿Estás seguro de que deseas eliminar al usuario <strong>{user?.name}</strong>?
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} sx={{ color: '#7e8299' }}>Cancelar</Button>
        <ActionButton onClick={handleDelete} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Eliminar Usuario'}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};
