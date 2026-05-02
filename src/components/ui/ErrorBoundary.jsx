import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import logger from '../../utils/logger';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '16rem',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: '28rem',
          textAlign: 'center',
          borderRadius: '1rem',
        }}
      >
        <ErrorIcon sx={{ fontSize: '3rem', color: 'error.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Algo salió mal
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {error.message || 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={resetErrorBoundary}
          sx={{ borderRadius: '0.5rem' }}
        >
          Reintentar
        </Button>
      </Paper>
    </Box>
  );
}

export function AppErrorBoundary({ children, onReset }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onReset}
      onError={(error, info) => {
        logger.error('Error Boundary capturó un error:', error, info);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function SectionErrorBoundary({ children, sectionName }) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="body2">
            Error en {sectionName || 'esta sección'}: {error.message}
          </Typography>
          <Button size="small" onClick={resetErrorBoundary} sx={{ mt: 1 }}>
            Reintentar
          </Button>
        </Box>
      )}
      onError={(error) => {
        logger.error(`Error en sección [${sectionName}]:`, error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
