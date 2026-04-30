import { Button } from '@mui/material';
import styled from '@emotion/styled';

export const ActionButton = styled(Button)(({ variant }) => ({
  background: variant === 'create' 
    ? 'linear-gradient(45deg, #8e3031 30%, #592d2d 90%)'
    : 'linear-gradient(45deg, #e74c3c 30%, #c0392b 90%)',
  boxShadow: variant === 'create'
    ? '0 3px 5px 2px rgba(142, 48, 49, .3)'
    : '0 3px 5px 2px rgba(231, 76, 60, .3)',
  borderRadius: '8px',
  padding: '10px 25px',
  color: 'white',
  textTransform: 'none',
  fontWeight: 600,
}));
