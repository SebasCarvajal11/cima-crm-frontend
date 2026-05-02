import { Box, CircularProgress, Typography } from '@mui/material';

export function LoadingState({ message = 'Cargando...', minHeight = '16rem' }) {
  return (
    <Box className="flex flex-col justify-center items-center gap-3" sx={{ minHeight }}>
      <CircularProgress size="2.5rem" sx={{ color: 'var(--color-brand-primary)' }} />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  );
}
