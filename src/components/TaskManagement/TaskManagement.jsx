import React from 'react';
import {
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { TaskProvider, useTask } from '../../context/TaskContext';

import { CreateTaskDialog } from './components/CreateTaskDialog';
import { EditTaskDialog } from './components/EditTaskDialog';
import { BulkActionDialog } from './components/BulkActionDialog';
import TaskFilters from './components/TaskFilters';
import TaskCard from './components/TaskCard';
import TaskStats from './components/TaskStats';
import TaskManagementHeader from './components/TaskManagementHeader';
import TaskManagementTabs from './components/TaskManagementTabs';

const TaskManagementContent = () => {
  const {
    tabValue,
    isAdmin,
    loading,
    error,
    filteredTasks,
    loadTasks,
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    setIsEditOpen,
    isBulkOpen,
    setIsBulkOpen,
    selectedTask,
    accessToken,
    selectedTasks,
    setSelectedTasks
  } = useTask();

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      <TaskManagementTabs />

      {tabValue === 0 && (
        <>
          <TaskManagementHeader />
          <TaskFilters />

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

      {tabValue === 1 && isAdmin && <TaskStats />}

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

const TaskManagement = () => (
  <TaskProvider>
    <TaskManagementContent />
  </TaskProvider>
);

export default TaskManagement;
