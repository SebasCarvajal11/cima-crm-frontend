import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useExcelContext } from '../ExcelContext';

export const ExcelDialogs = () => {
  const { state, actions } = useExcelContext();
  const { confirmDelete } = state;
  const { setConfirmDelete, handleDelete } = actions;

  return (
    <Dialog
      open={confirmDelete.open}
      onClose={() => setConfirmDelete({ open: false, fileId: null })}
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ color: 'error.main' }}>
        Confirmar eliminación
      </DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={() => setConfirmDelete({ open: false, fileId: null })}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button 
          onClick={() => handleDelete(confirmDelete.fileId)}
          color="error"
          variant="contained"
          startIcon={<DeleteIcon />}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
