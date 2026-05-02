import React from 'react';
import { Container, Paper, Box, Typography, Alert } from '@mui/material';
import { FolderOpen as ProjectIcon } from '@mui/icons-material';
import { ExcelProvider, useExcelContext } from './ExcelContext';
import { ExcelProjectSelector } from './components/ExcelProjectSelector';
import { ExcelUploader } from './components/ExcelUploader';
import { ExcelFileList } from './components/ExcelFileList';
import { ExcelDialogs } from './components/ExcelDialogs';

// Componente presentacional que consume el contexto
const ExcelManagerContainer = () => {
  const { state } = useExcelContext();
  const { selectedProject, error, success } = state;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f8faff 0%, white 100%)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main', 
              mb: 1,
              background: 'linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Gestor de Documentos
          </Typography>
          <Typography variant="subtitle1" color="text.primary" sx={{ mb: 4 }}>
            Gestiona y organiza archivos de cualquier tipo para tus proyectos
          </Typography>

          <ExcelProjectSelector />

          {selectedProject ? (
            <>
              <ExcelUploader />

              {error && (
                <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }} variant="filled">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }} variant="filled">
                  {success}
                </Alert>
              )}

              <ExcelFileList />
            </>
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8, 
                bgcolor: 'background.paper',
                borderRadius: 4,
                border: '1px dashed',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <ProjectIcon sx={{ fontSize: 48, color: 'var(--color-brand-primary)', opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary">
                Seleccione un proyecto para gestionar sus documentos
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      <ExcelDialogs />
    </Container>
  );
};

// Componente principal envuelto en el Provider
const ExcelImport = ({ projectId = '' }) => {
  return (
    <ExcelProvider initialProjectId={projectId}>
      <ExcelManagerContainer />
    </ExcelProvider>
  );
};

export default ExcelImport;
