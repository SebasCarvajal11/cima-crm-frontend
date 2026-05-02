import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, LinearProgress } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useExcelContext } from '../ExcelContext';

const DropzoneArea = styled('div')(({ theme }) => ({
  border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
  borderRadius: theme.shape.borderRadius * 3,
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(8px)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
  },
}));

export const ExcelUploader = () => {
  const { state, actions } = useExcelContext();
  const { loading, uploadProgress, selectedProject } = state;
  const { handleUpload, setError } = actions;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (!selectedProject) {
        setError('Por favor seleccione un proyecto primero');
        return;
      }
      handleUpload(file);
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  });

  return (
    <>
      <DropzoneArea {...getRootProps()}>
        <input {...getInputProps()} />
        <Box 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f8faff 0%, white 100%)',
            borderRadius: 3,
          }}
        >
          <Box sx={{ backgroundColor: 'primary.lighter', borderRadius: '50%', p: 2, mb: 2 }}>
            <UploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Arrastra archivos aquí
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            o haz clic para seleccionar
          </Typography>
          <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              Tamaño máximo permitido: 10MB
            </Typography>
          </Box>
        </Box>
      </DropzoneArea>

      {loading && uploadProgress > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Subiendo archivo...
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={uploadProgress}
            sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { borderRadius: 4 } }} 
          />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            {uploadProgress}%
          </Typography>
        </Box>
      )}
    </>
  );
};
