import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { ROLES } from '../../constants';
import { useNotification } from '../../hooks/useNotification';
import {
  useGetTasksQuery,
  useGetTaskStatsQuery,
  useDeleteTaskMutation,
} from '../../redux/api';

import { CreateTaskDialog } from './components/CreateTaskDialog';
import { EditTaskDialog } from './components/EditTaskDialog';
import { BulkActionDialog } from './components/BulkActionDialog';
import TaskFilters from './components/TaskFilters';
import TaskCard from './components/TaskCard';
import TaskStats from './components/TaskStats';
import TaskManagementHeader from './components/TaskManagementHeader';
import TaskManagementTabs from './components/TaskManagementTabs';

const TaskManagement = () => {
  const notify = useNotification();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === ROLES.ADMIN;

  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const params = useMemo(() => {
    const p = {};
    if (projectFilter) p.projectId = projectFilter;
    if (statusFilter !== 'all') p.status = statusFilter;
    return p;
  }, [projectFilter, statusFilter]);

  const { data: tasks = [], isLoading, error } = useGetTasksQuery(params);
  const { data: taskStats, isLoading: statsLoading } = useGetTaskStatsQuery(undefined, {
    skip: !isAdmin || tabValue !== 1,
  });
  const [deleteTask] = useDeleteTaskMutation();

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    let result = [...tasks];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (task) =>
          (task.description || '').toLowerCase().includes(term) ||
          (task.projectName || '').toLowerCase().includes(term)
      );
    }
    return result;
  }, [tasks, searchTerm]);

  const handleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta tarea?')) {
      try {
        await deleteTask(id).unwrap();
        notify.success('Tarea eliminada exitosamente');
      } catch (err) {
        notify.error('Error al eliminar la tarea', err);
      }
    }
  };

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditOpen(true);
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      <TaskManagementTabs
        tabValue={tabValue}
        onTabChange={handleTabChange}
        isAdmin={isAdmin}
      />

      {tabValue === 0 && (
        <>
          <TaskManagementHeader
            selectedTasks={selectedTasks}
            isAdmin={isAdmin}
            onBulkOpen={() => setIsBulkOpen(true)}
            onCreateOpen={() => setIsCreateOpen(true)}
          />
          <TaskFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            projectFilter={projectFilter}
            setProjectFilter={setProjectFilter}
            filteredTasks={filteredTasks}
          />

          {isLoading ? (
            <div className="flex justify-center p-10">
              <CircularProgress />
            </div>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              Error al cargar las tareas. Por favor, intente nuevamente.
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
                      selectedTasks={selectedTasks}
                      onSelect={handleTaskSelection}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      No se encontraron tareas con los filtros aplicados.
                    </Typography>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {tabValue === 1 && isAdmin && (
        <TaskStats taskStats={taskStats} isLoading={statsLoading} />
      )}

      <CreateTaskDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditTaskDialog
        open={isEditOpen}
        task={selectedTask}
        onClose={() => setIsEditOpen(false)}
      />

      <BulkActionDialog
        open={isBulkOpen}
        selectedTasks={selectedTasks}
        onClose={() => setIsBulkOpen(false)}
        onSuccess={() => setSelectedTasks([])}
      />
    </div>
  );
};

export default TaskManagement;
