import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Button, Typography, CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { ActionButton } from './DialogStyles';
import { useDeleteClientMutation } from '../../../redux/api';
import { useNotification } from '../../../hooks/useNotification';

export const DeleteClientDialog = ({ open, user, onClose, onSuccess }) => {
  const notify = useNotification();
  const [deleteClient, { isLoading }] = useDeleteClientMutation();

  const handleDelete = async () => {
    if (!user) {
      notify.error('No se ha seleccionado ningún cliente para eliminar'); return;
    }

    const clientId = user.clientId || user.id;
    if (!clientId) {
      notify.error('El cliente seleccionado no tiene un ID definido'); return;
    }

    try {
      await deleteClient(clientId).unwrap();
      notify.success('Cliente eliminado correctamente');
      onSuccess(clientId);
      onClose();
    } catch (err) {
      notify.error(`Error al eliminar cliente: ${err.message || err}`);
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
        <ActionButton variant="delete" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Eliminar Cliente'}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};
