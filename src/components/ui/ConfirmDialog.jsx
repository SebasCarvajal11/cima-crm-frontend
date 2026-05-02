import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirmar acción', message, confirmLabel = 'Confirmar', confirmColor = 'error', loading = false }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '1rem' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: confirmColor === 'error' ? 'var(--color-error)' : 'var(--color-brand-primary)', color: 'white', py: 2, px: 3 }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>{title}</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>Cancelar</Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor} disabled={loading} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
