import React from 'react';
import { 
  Box, Typography, Button, IconButton, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Tooltip 
} from '@mui/material';
import { 
  Delete as DeleteIcon, Download as DownloadIcon, FileCopy as FileIcon 
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useExcelContext } from '../ExcelContext';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  border: '1px solid',
  borderColor: theme.palette.divider,
  '& .MuiTableCell-head': {
    backgroundColor: "#8e3031",
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: theme.spacing(2),
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.3s ease',
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: '#000000',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      transform: 'translateY(-1px)',
    },
  },
  '& .file-name': {
    fontWeight: 500,
    color: "#8e3031",
  },
  '& .file-info': {
    color: '#000000',
    fontSize: '0.875rem',
  },
}));

export const ExcelFileList = () => {
  const { state, actions } = useExcelContext();
  const { files } = state;
  const { handleDownload, setConfirmDelete } = actions;

  return (
    <StyledTableContainer sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Archivo</TableCell>
            <TableCell>Información</TableCell>
            <TableCell>Tamaño</TableCell>
            <TableCell>Descargar</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.fileId}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FileIcon sx={{ mr: 2, color: '#592d2d' }} />
                  <Typography className="file-name" sx={{ color: '#000000' }}>
                    {file.originalName || 'Sin nombre'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell className="file-info">
                <Typography variant="body2" sx={{ color: '#000000' }}>
                  Subido el: {file.uploadedAt ? new Date(file.uploadedAt).toLocaleString('es-ES') : 'Fecha no disponible'}
                </Typography>
              </TableCell>
              <TableCell className="file-info">
                <Typography variant="body2" sx={{ color: '#000000' }}>
                  {file.fileSize ? `${(file.fileSize / 1024).toFixed(2)} KB` : 'Tamaño no disponible'}
                </Typography>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(file.fileId)}
                  sx={{ backgroundColor: '#592d2d', '&:hover': { backgroundColor: '#8e3031' } }}
                >
                  Descargar
                </Button>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Tooltip title="Eliminar archivo">
                    <IconButton 
                      onClick={() => setConfirmDelete({ open: true, fileId: file.fileId })}
                      sx={{ color: 'error.main', '&:hover': { backgroundColor: 'error.light', color: 'error.dark' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};
