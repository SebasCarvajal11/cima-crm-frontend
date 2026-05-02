import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem,
  Button, CircularProgress
} from '@mui/material';
import { useBulkUpdateTaskStatusMutation, useBulkAssignTasksMutation, useGetWorkersQuery } from '../../../redux/api';
import { TASK_STATUS } from '../../../constants';
import { useNotification } from '../../../hooks/useNotification';
import logger from '../../../utils/logger';

export const BulkActionDialog = ({ open, selectedTasks, onClose, onSuccess }) => {
  const notify = useNotification();
  const [bulkAction, setBulkAction] = useState({
    action: 'status',
    status: TASK_STATUS.COMPLETED,
    workerId: ''
  });
  const [bulkUpdateTaskStatus, { isLoading: isUpdatingStatus }] = useBulkUpdateTaskStatusMutation();
  const [bulkAssignTasks, { isLoading: isAssigning }] = useBulkAssignTasksMutation();
  const isLoading = isUpdatingStatus || isAssigning;

  const { data: allWorkers = [] } = useGetWorkersQuery(undefined, { skip: !open });

  useEffect(() => {
    if (open) {
      setBulkAction({
        action: 'status',
        status: TASK_STATUS.COMPLETED,
        workerId: ''
      });
    }
  }, [open]);

  const handleBulkActionSubmit = async () => {
    try {
      if (bulkAction.action === 'status') {
        await bulkUpdateTaskStatus({ taskIds: selectedTasks, status: bulkAction.status }).unwrap();
        notify.success(`Estado actualizado para ${selectedTasks.length} tareas`);
      } else if (bulkAction.action === 'assign') {
        await bulkAssignTasks({ taskIds: selectedTasks, workerId: bulkAction.workerId }).unwrap();
        notify.success(`${selectedTasks.length} tareas asignadas al trabajador`);
      }
      onSuccess();
      onClose();
    } catch (error) {
      logger.error('Error al procesar acción en masa:', error);
      notify.error('Error al procesar la acción en masa');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Acciones en Masa ({selectedTasks.length} tareas seleccionadas)
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Acción</InputLabel>
          <Select
            value={bulkAction.action}
            onChange={(e) => setBulkAction({ ...bulkAction, action: e.target.value })}
            label="Acción"
          >
            <MenuItem value="status">Cambiar Estado</MenuItem>
            <MenuItem value="assign">Asignar a Trabajador</MenuItem>
          </Select>
        </FormControl>

        {bulkAction.action === 'status' && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Nuevo Estado</InputLabel>
            <Select
              value={bulkAction.status}
              onChange={(e) => setBulkAction({ ...bulkAction, status: e.target.value })}
              label="Nuevo Estado"
            >
              <MenuItem value={TASK_STATUS.PENDING}>Pendiente</MenuItem>
              <MenuItem value={TASK_STATUS.IN_PROGRESS}>En Progreso</MenuItem>
              <MenuItem value={TASK_STATUS.COMPLETED}>Completada</MenuItem>
            </Select>
          </FormControl>
        )}

        {bulkAction.action === 'assign' && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Trabajador</InputLabel>
            <Select
              value={bulkAction.workerId}
              onChange={(e) => setBulkAction({ ...bulkAction, workerId: e.target.value })}
              label="Trabajador"
            >
              {allWorkers.map(worker => (
                <MenuItem key={worker.userId || worker.id} value={worker.userId || worker.id}>
                  {worker.name} {worker.email ? `(${worker.email})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button
          onClick={handleBulkActionSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading || (bulkAction.action === 'assign' && !bulkAction.workerId)}
        >
          {isLoading ? <CircularProgress size="1.5rem" /> : 'Aplicar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
