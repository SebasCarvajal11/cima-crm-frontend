import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, CircularProgress,
} from '@mui/material';
import { useDeleteFaqMutation } from '../../../redux/api';
import { useNotification } from '../../../hooks/useNotification';
import { MESSAGES } from '../../../constants';

export default function FaqDeleteDialog({ open, onClose, faqId }) {
  const notify = useNotification();
  const [deleteFaq, { isLoading }] = useDeleteFaqMutation();

  const handleDelete = async () => {
    if (!faqId) return;

    try {
      await deleteFaq(faqId).unwrap();
      notify.success(MESSAGES.SUCCESS.FAQ.DELETE);
      onClose();
    } catch (err) {
      notify.error(MESSAGES.ERROR.FAQ.DELETE, err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar esta pregunta frecuente? Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
