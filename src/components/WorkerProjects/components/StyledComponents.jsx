import { Card, Modal, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StatusChip } from '../../ui/StatusChip';

export { StatusChip };

export const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '0.25rem',
    background: 'var(--color-brand-primary-light)',
    borderRadius: '0.25rem 0.25rem 0 0',
  },
}));

export const StyledModal = styled(Modal)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const ModalHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, var(--color-brand-primary-light) 0%, var(--color-brand-primary) 100%)',
  padding: theme.spacing(3),
  color: theme.palette.primary.contrastText,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '0.25rem',
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));
