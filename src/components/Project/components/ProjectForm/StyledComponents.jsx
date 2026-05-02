import { Dialog, DialogTitle, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    borderRadius: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    overflowX: 'hidden',
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(() => ({
  background: 'var(--color-brand-primary)',
  color: 'var(--color-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem',
}));

export const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiFormControl-root': {
    marginBottom: theme.spacing(2),
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: 'var(--color-brand-primary-light)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-brand-primary)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--color-brand-primary)',
  },
}));
