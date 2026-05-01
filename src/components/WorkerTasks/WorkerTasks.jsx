import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  HourglassEmpty as PendingIcon,
  Update as UpdateIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { taskService } from '../../services/taskService';
import logger from '../../utils/logger';

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'completado':
      return <CheckCircleIcon fontSize="small" />;
    case 'in progress':
    case 'en progreso':
      return <ScheduleIcon fontSize="small" />;
    default:
      return <PendingIcon fontSize="small" />;
  }
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'completado':
      return 'success';
    case 'in progress':
    case 'en progreso':
      return 'info';
    case 'pending':
    case 'pendiente':
      return 'warning';
    default:
      return 'default';
  }
};

const WorkerTasks = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      const data = await taskService.getTasksByWorker(user.userId);
      setTasks(data || []);
      setError(null);
    } catch (err) {
      logger.error('Error fetching worker tasks:', err);
      setError('Error al cargar las tareas asignadas.');
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      setUpdatingId(taskId);
      await taskService.updateTaskStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => ((t.taskId || t.id) === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      logger.error('Error updating task status:', err);
      alert('Error al actualizar el estado de la tarea.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-4 md:p-8 max-w-7xl mx-auto">
      <Box className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2 flex items-center gap-3">
            <TaskIcon fontSize="large" className="text-brand-primary" />
            Mis Tareas Asignadas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona el progreso de las tareas que tienes asignadas.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" className="mb-6 rounded-xl">
          {error}
        </Alert>
      )}

      {tasks.length === 0 ? (
        <Paper className="p-12 text-center rounded-2xl bg-white shadow-sm border border-gray-100">
          <TaskIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No tienes tareas asignadas en este momento.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          <AnimatePresence>
            {tasks.map((task, index) => {
              const taskId = task.taskId || task.id;
              return (
                <Grid item xs={12} md={6} lg={4} key={taskId}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="h-full rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                      <CardContent className="flex-grow p-6">
                        <Box className="flex justify-between items-start mb-4">
                          <Chip
                            icon={getStatusIcon(task.status)}
                            label={task.status}
                            color={getStatusColor(task.status)}
                            size="small"
                            className="font-semibold"
                          />
                          <Typography variant="caption" color="text.disabled">
                            #{taskId}
                          </Typography>
                        </Box>

                        <Typography variant="h6" className="font-bold text-gray-800 mb-3">
                          {task.description || 'Sin descripción'}
                        </Typography>

                        <Box className="flex items-center gap-2 mb-4">
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'var(--color-brand-primary)' }}>
                            <TaskIcon sx={{ fontSize: 14 }} />
                          </Avatar>
                          <Typography variant="body2" color="text.secondary" className="font-medium">
                            {task.projectName || `Proyecto #${task.projectId}`}
                          </Typography>
                        </Box>

                        <Divider className="my-4" />

                        <FormControl fullWidth size="small" className="mt-2">
                          <InputLabel>Actualizar Estado</InputLabel>
                          <Select
                            value={task.status}
                            label="Actualizar Estado"
                            onChange={(e) => handleUpdateStatus(taskId, e.target.value)}
                            disabled={updatingId === taskId}
                          >
                            <MenuItem value="Pending">Pendiente</MenuItem>
                            <MenuItem value="In Progress">En progreso</MenuItem>
                            <MenuItem value="Completed">Completado</MenuItem>
                          </Select>
                        </FormControl>
                      </CardContent>
                      
                      <Box className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                        <Box className="flex items-center gap-1 text-gray-500">
                          <ScheduleIcon sx={{ fontSize: 14 }} />
                          <Typography variant="caption">
                            Creado: {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                          </Typography>
                        </Box>
                        {updatingId === taskId && <CircularProgress size={16} />}
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </AnimatePresence>
        </Grid>
      )}
    </Box>
  );
};

export default WorkerTasks;
