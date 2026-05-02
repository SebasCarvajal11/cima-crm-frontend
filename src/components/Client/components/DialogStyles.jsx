import { Button } from '@mui/material';
import styled from '@emotion/styled';

export const ActionButton = styled(Button)(({ variant }) => ({
  background: variant === 'create' 
    ? 'linear-gradient(45deg, var(--color-brand-primary) 30%, var(--color-brand-primary) 90%)'
    : 'linear-gradient(45deg, var(--color-error) 30%, var(--color-error) 90%)',
  boxShadow: variant === 'create'
    ? '0 3px 5px 2px rgba(142, 48, 49, .3)'
    : '0 3px 5px 2px rgba(231, 76, 60, .3)',
  borderRadius: '0.5rem',
  padding: '0.625rem 1.5625rem',
  color: 'white',
  textTransform: 'none',
  fontWeight: 600,
}));
