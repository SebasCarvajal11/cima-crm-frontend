import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { taskService } from '../../services/taskService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { CreateTaskDialog } from './components/CreateTaskDialog';
import { EditTaskDialog } from './components/EditTaskDialog';
import { BulkActionDialog } from './components/BulkActionDialog';
import TaskFilters from './components/TaskFilters';
import TaskCard from './components/TaskCard';
import TaskStats from './components/TaskStats';
import { AnimatePresence } from 'framer-motion';
import logger from '../../utils/logger';

const TaskManagement = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const isAdmin = user && user.role === 'Admin';

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('');
  const [workerFilter, setWorkerFilter] = useState('');

  const [taskStats, setTaskStats] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];

    let result = [...tasks];

    if (searchTerm) {
      result = result.filter(
        (task) =>
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.projectName &&
            task.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((task) => task.status === statusFilter);
    }

    if (projectFilter) {
      result = result.filter(
        (task) => task.projectId.toString() === projectFilter.toString()
      );
    }

    if (workerFilter) {
      result = result.filter(
        (task) => task.workerId.toString() === workerFilter.toString()
      );
    }

    return result;
  }, [tasks, searchTerm, statusFilter, projectFilter, workerFilter]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;

      if (projectFilter && !workerFilter && !statusFilter) {
        response = await taskService.getTasksByProject(projectFilter);
      } else if (!projectFilter && workerFilter && !statusFilter) {
        response = await taskService.getTasksByWorker(workerFilter);
      } else if (!projectFilter && !workerFilter && statusFilter !== 'all') {
        response = await taskService.getTasksByStatus(statusFilter);
      } else {
        const filters = {};
        if (projectFilter) filters.projectId = projectFilter;
        if (workerFilter) filters.workerId = workerFilter;
        if (statusFilter !== 'all') filters.status = statusFilter;
        response = await taskService.getDetailedTasks(filters);
      }

      const tasksArray = response.tasks || response;
      setTasks(Array.isArray(tasksArray) ? tasksArray : []);
    } catch (error) {
      logger.error('Error al cargar tareas:', error);
      setError('Error al cargar las tareas. Por favor, intente nuevamente.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTaskStats = async () => {
    if (!isAdmin) return;
    try {
      const response = await taskService.getTaskStats();
      setTaskStats(response);
    } catch (error) {
      logger.error('Error al cargar estadísticas:', error);
      toast.error('No se pudieron cargar las estadísticas');
      setTaskStats({
        success: false,
        stats: {
          completed: 0,
          inProgress: 0,
          pending: 0,
          total: 0,
          totalProjects: 0,
          totalWorkers: 0,
        },
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta tarea?')) {
      setLoading(true);
      try {
        await taskService.deleteTask(id);
        toast.success('Tarea eliminada exitosamente');
        loadTasks();
      } catch (error) {
        logger.error('Error al eliminar la tarea:', error);
        toast.error('Error al eliminar la tarea');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1 && isAdmin) {
      loadTaskStats();
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        className="bg-white rounded-lg mb-6 shadow-sm"
        sx={{
          '& .MuiTab-root': {
            color: '#592d2d',
            '&:hover': { color: '#000000' },
            '&.Mui-selected': { color: '#000000' },
          },
          '& .MuiTabs-indicator': { backgroundColor: '#000000' },
        }}
      >
        <Tab label="Gestión de Tareas" />
        {isAdmin && <Tab label="Estadísticas" />}
      </Tabs>

      {tabValue === 0 && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-5 bg-white rounded-xl shadow-md gap-4">
            <Typography variant="h4" component="h1" sx={{ color: '#592d2d' }}>
              Gestión de Tareas
            </Typography>
            <div className="flex items-center gap-2">
              {selectedTasks.length > 0 && isAdmin && (
                <Button
                  variant="outlined"
                  onClick={() => setIsBulkOpen(true)}
                  startIcon={<AssignmentIcon />}
                  sx={{ mr: 2 }}
                >
                  Acciones en Masa ({selectedTasks.length})
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsCreateOpen(true)}
                sx={{
                  background:
                    'linear-gradient(45deg, #2c3e50 30%,rgb(0, 0, 0) 90%)',
                  boxShadow: '0 3px 5px 2px rgba(52, 152, 219, .3)',
                }}
              >
                Nueva Tarea
              </Button>
            </div>
          </div>

          <TaskFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            projectFilter={projectFilter}
            setProjectFilter={setProjectFilter}
            filteredTasks={filteredTasks}
            onRefresh={loadTasks}
          />

          {loading ? (
            <div className="flex justify-center p-10">
              <CircularProgress />
            </div>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 p-4">
              <AnimatePresence>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
                    <TaskCard
                      key={task.taskId || task.id}
                      task={task}
                      index={index}
                      isAdmin={isAdmin}
                      isSelected={selectedTasks.includes(task.taskId || task.id)}
                      onSelect={handleTaskSelection}
                      onEdit={(t) => {
                        setSelectedTask(t);
                        setIsEditOpen(true);
                      }}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Typography variant="body1" sx={{ color: '#666' }}>
                      No se encontraron tareas con los filtros aplicados.
                    </Typography>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {tabValue === 1 && isAdmin && <TaskStats taskStats={taskStats} />}

      <CreateTaskDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={loadTasks}
        token={accessToken}
        fallbackTasks={filteredTasks}
      />

      <EditTaskDialog
        open={isEditOpen}
        task={selectedTask}
        onClose={() => setIsEditOpen(false)}
        onSuccess={loadTasks}
        token={accessToken}
        fallbackTasks={filteredTasks}
      />

      <BulkActionDialog
        open={isBulkOpen}
        selectedTasks={selectedTasks}
        onClose={() => setIsBulkOpen(false)}
        onSuccess={() => {
          setSelectedTasks([]);
          loadTasks();
        }}
        token={accessToken}
        fallbackTasks={filteredTasks}
      />
    </div>
  );
};

export default TaskManagement;
