import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingState, PageHeader } from '../ui';
import { useGetTasksQuery, useUpdateTaskStatusMutation } from '../../redux/api';
import logger from '../../utils/logger';
import { useNotification } from '../../hooks/useNotification';

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
  const notify = useNotification();
  const { user } = useSelector((state) => state.auth);
  const [updatingId, setUpdatingId] = useState(null);

  const { data: tasks = [], isLoading, error } = useGetTasksQuery(
    { workerId: user?.userId },
    { skip: !user?.userId }
  );
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      setUpdatingId(taskId);
      await updateTaskStatus({ id: taskId, status: newStatus }).unwrap();
      notify.success('Estado actualizado');
    } catch (err) {
      logger.error('Error updating task status:', err);
      notify.error('Error al actualizar el estado de la tarea');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Box className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        icon={TaskIcon}
        title="Mis Tareas Asignadas"
        subtitle="Gestiona el progreso de las tareas que tienes asignadas."
      />

      {error && (
        <Alert severity="error" className="mb-6 rounded-xl">
          Error al cargar las tareas asignadas.
        </Alert>
      )}

      {tasks.length === 0 ? (
        <Box className="fluid-padding-lg text-center rounded-2xl bg-white shadow-sm border border-gray-100">
          <TaskIcon sx={{ fontSize: '4rem', color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No tienes tareas asignadas en este momento.
          </Typography>
        </Box>
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
                      <CardContent className="flex-grow fluid-padding">
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
                          <Avatar sx={{ width: '1.5rem', height: '1.5rem', bgcolor: 'var(--color-brand-primary)' }}>
                            <TaskIcon sx={{ fontSize: '0.875rem' }} />
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
                          <ScheduleIcon sx={{ fontSize: '0.875rem' }} />
                          <Typography variant="caption">
                            Creado: {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                          </Typography>
                        </Box>
                        {updatingId === taskId && <CircularProgress size="1rem" />}
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
