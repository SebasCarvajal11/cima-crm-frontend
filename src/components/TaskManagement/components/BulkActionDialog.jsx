import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem,
  Button, CircularProgress
} from '@mui/material';
import { taskService } from '../../../services/taskService';
import logger from '../../../utils/logger';

export const BulkActionDialog = ({ open, selectedTasks, onClose, onSuccess, token, fallbackTasks }) => {
  const [bulkAction, setBulkAction] = useState({
    action: 'status',
    status: 'Completed',
    workerId: ''
  });
  const [loading, setLoading] = useState(false);
  const [allWorkers, setAllWorkers] = useState([]);

  useEffect(() => {
    if (open) {
      setBulkAction({
        action: 'status',
        status: 'Completed',
        workerId: ''
      });
      fetchWorkers();
    }
  }, [open]);

  const fetchWorkers = async () => {
    try {
      const headers = { headers: { 'accesstoken': token } };
      const workRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/workers`, headers);
      if (workRes.data.success && Array.isArray(workRes.data.workers)) {
        setAllWorkers(workRes.data.workers);
      }
    } catch (error) {
      logger.error('Error fetching workers:', error);
    }
  };

  const handleBulkActionSubmit = async () => {
    setLoading(true);
    try {
      if (bulkAction.action === 'status') {
        await taskService.bulkUpdateTaskStatus(selectedTasks, bulkAction.status);
        toast.success(`Estado actualizado para ${selectedTasks.length} tareas`);
      } else if (bulkAction.action === 'assign') {
        await taskService.bulkAssignTasks(selectedTasks, bulkAction.workerId);
        toast.success(`${selectedTasks.length} tareas asignadas al trabajador ${bulkAction.workerId}`);
      }
      onSuccess();
      onClose();
    } catch (error) {
      logger.error('Error al procesar acción en masa:', error);
      toast.error('Error al procesar la acción en masa');
    } finally {
      setLoading(false);
    }
  };

  const workerOptions = allWorkers.length > 0 ? allWorkers : (fallbackTasks || []).reduce((unique, t) => {
    if (t.workerId && !unique.some(w => w.id === t.workerId)) {
      unique.push({ id: t.workerId, name: t.workerName || `Trabajador #${t.workerId}` });
    }
    return unique;
  }, []);

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
              <MenuItem value="Pending">Pendiente</MenuItem>
              <MenuItem value="In Progress">En Progreso</MenuItem>
              <MenuItem value="Completed">Completada</MenuItem>
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
              {workerOptions.map(worker => (
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
          disabled={loading || (bulkAction.action === 'assign' && !bulkAction.workerId)}
        >
          {loading ? <CircularProgress size="1.5rem" /> : 'Aplicar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
