import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Button, CircularProgress
} from '@mui/material';
import { useCreateTaskMutation } from '../../../redux/api';
import { useGetProjectsQuery, useGetWorkersQuery } from '../../../redux/api';
import { TASK_STATUS } from '../../../constants';
import { useNotification } from '../../../hooks/useNotification';
import logger from '../../../utils/logger';

export const CreateTaskDialog = ({ open, onClose }) => {
  const notify = useNotification();
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [formData, setFormData] = useState({
    projectId: '',
    workerId: '',
    description: '',
    status: TASK_STATUS.PENDING
  });

  const { data: allProjects = [] } = useGetProjectsQuery(undefined, { skip: !open });
  const { data: allWorkers = [] } = useGetWorkersQuery(undefined, { skip: !open });

  useEffect(() => {
    if (open) {
      setFormData({
        projectId: '',
        workerId: '',
        description: '',
        status: TASK_STATUS.PENDING
      });
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(formData).unwrap();
      notify.success('Tarea creada con éxito');
      onClose();
    } catch (error) {
      logger.error('Error al crear tarea:', error);
      notify.error(`Error: ${error.message || 'No se pudo crear la tarea'}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nueva Tarea</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Proyecto</InputLabel>
            <Select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              label="Proyecto"
            >
              {allProjects.map(project => (
                <MenuItem key={project.projectId || project.id} value={project.projectId || project.id}>
                  {project.projectName || project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Trabajador</InputLabel>
            <Select
              value={formData.workerId}
              onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
              label="Trabajador"
            >
              {allWorkers.map(worker => (
                <MenuItem key={worker.userId || worker.id} value={worker.userId || worker.id}>
                  {worker.name} {worker.email ? `(${worker.email})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth label="Descripción" multiline rows={4} margin="normal" required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              label="Estado"
            >
              <MenuItem value={TASK_STATUS.PENDING}>Pendiente</MenuItem>
              <MenuItem value={TASK_STATUS.IN_PROGRESS}>En Progreso</MenuItem>
              <MenuItem value={TASK_STATUS.COMPLETED}>Completada</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
            {isLoading ? <CircularProgress size="1.5rem" /> : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
