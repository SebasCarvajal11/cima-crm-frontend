import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Button, Typography, CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useDeleteUserMutation } from '../../../redux/api';

const ActionButton = ({ children, disabled, onClick }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    sx={{
      background: 'linear-gradient(45deg, var(--color-error) 30%, var(--color-error) 90%)',
      boxShadow: '0 3px 5px 2px rgba(231, 76, 60, .3)',
      borderRadius: '0.5rem',
      padding: '0.625rem 1.5625rem',
      color: 'white',
      textTransform: 'none',
      fontWeight: 600,
      '&:hover': {
        background: 'linear-gradient(45deg, var(--color-error) 30%, var(--color-error) 90%)',
      }
    }}
  >
    {children}
  </Button>
);

export const DeleteUserDialog = ({ open, user, onClose, onSuccess }) => {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

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

    try {
      await deleteUser(userId).unwrap();
      toast.success('Usuario eliminado correctamente', { position: 'top-center' });
      onSuccess(userId);
      onClose();
    } catch (err) {
      toast.error(`Error al eliminar usuario: ${err.userMessage || err.message}`, { position: 'top-center' });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ background: 'var(--color-error)', color: 'white' }}>
        Confirmar Eliminación
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
        <Typography variant="body1">
          ¿Estás seguro de que deseas eliminar al usuario <strong>{user?.name}</strong>?
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '1rem 1.5rem' }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancelar</Button>
        <ActionButton onClick={handleDelete} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Eliminar Usuario'}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};
