import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Button, CircularProgress
} from '@mui/material';
import { taskService } from '../../../services/taskService';

export const EditTaskDialog = ({ open, task, onClose, onSuccess, token, fallbackTasks }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    workerId: '',
    description: '',
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);
  
  // Local state for options
  const [allWorkers, setAllWorkers] = useState([]);
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    if (open && task) {
      setFormData({
        projectId: task.projectId,
        workerId: task.workerId,
        description: task.description,
        status: task.status
      });
      fetchOptions();
    }
  }, [open, task]);

  const fetchOptions = async () => {
    try {
      const headers = { headers: { 'accesstoken': token } };
      // Fetch projects
      const projRes = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, headers);
      if (projRes.data.success && Array.isArray(projRes.data.projects)) {
        setAllProjects(projRes.data.projects);
      }
      // Fetch workers
      const workRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/workers`, headers);
      if (workRes.data.success && Array.isArray(workRes.data.workers)) {
        setAllWorkers(workRes.data.workers);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const taskId = task.id || task.taskId;
      await taskService.createOrUpdateTask({
        ...formData,
        id: taskId,
        taskId: taskId
      });
      toast.success('Tarea actualizada con éxito');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fallbacks using filteredTasks pattern from the original component
  const projectOptions = allProjects.length > 0 ? allProjects : (fallbackTasks || []).reduce((unique, t) => {
    if (t.projectId && !unique.some(p => p.id === t.projectId)) {
      unique.push({ id: t.projectId, name: t.projectName || `Proyecto #${t.projectId}` });
    }
    return unique;
  }, []);

  const workerOptions = allWorkers.length > 0 ? allWorkers : (fallbackTasks || []).reduce((unique, t) => {
    if (t.workerId && !unique.some(w => w.id === t.workerId)) {
      unique.push({ id: t.workerId, name: t.workerName || `Trabajador #${t.workerId}` });
    }
    return unique;
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Tarea</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Proyecto</InputLabel>
            <Select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              label="Proyecto"
            >
              {projectOptions.map(project => (
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
              {workerOptions.map(worker => (
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
              <MenuItem value="Pending">Pendiente</MenuItem>
              <MenuItem value="In Progress">En Progreso</MenuItem>
              <MenuItem value="Completed">Completada</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Actualizar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
