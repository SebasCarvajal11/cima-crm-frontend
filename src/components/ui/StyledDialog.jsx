import { Dialog, DialogTitle, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const StyledDialogPaper = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    borderRadius: '1rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ variant = 'brand' }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: 'white',
  padding: '1rem 1.5rem',
  ...(variant === 'brand' && {
    background: 'var(--color-brand-primary)',
  }),
  ...(variant === 'error' && {
    background: 'var(--color-error)',
  }),
  ...(variant === 'warning' && {
    background: 'var(--color-warning)',
  }),
}));

export function FormDialog({ open, onClose, title, variant = 'brand', maxWidth = 'sm', children }) {
  return (
    <StyledDialogPaper open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <StyledDialogTitle variant={variant}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>{title}</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}><CloseIcon /></IconButton>
      </StyledDialogTitle>
      {children}
    </StyledDialogPaper>
  );
}
