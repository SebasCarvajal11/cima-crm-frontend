import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { taskService } from '../services/taskService';
import logger from '../utils/logger';
import { useNotification } from '../hooks/useNotification';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const isAdmin = user && user.role === 'Admin';
  const notify = useNotification();

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

  const loadTasks = useCallback(async () => {
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
  }, [projectFilter, workerFilter, statusFilter]);

  const loadTaskStats = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const response = await taskService.getTaskStats();
      setTaskStats(response);
    } catch (error) {
      logger.error('Error al cargar estadísticas:', error);
      notify.error('No se pudieron cargar las estadísticas', error);
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
  }, [isAdmin]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

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

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta tarea?')) {
      setLoading(true);
      try {
        await taskService.deleteTask(id);
        notify.success('Tarea eliminada exitosamente');
        loadTasks();
      } catch (error) {
        logger.error('Error al eliminar la tarea:', error);
        notify.error('Error al eliminar la tarea', error);
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

  const value = {
    tasks,
    loading,
    error,
    selectedTasks,
    setSelectedTasks,
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    setIsEditOpen,
    isBulkOpen,
    setIsBulkOpen,
    selectedTask,
    setSelectedTask,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    projectFilter,
    setProjectFilter,
    workerFilter,
    setWorkerFilter,
    taskStats,
    tabValue,
    setTabValue,
    filteredTasks,
    isAdmin,
    accessToken,
    loadTasks,
    loadTaskStats,
    handleDelete,
    handleTaskSelection,
    handleTabChange
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask debe ser usado dentro de un TaskProvider');
  }
  return context;
};
