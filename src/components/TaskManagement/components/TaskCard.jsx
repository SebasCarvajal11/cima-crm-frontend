import React from 'react';
import {
  IconButton,
  Typography,
  Avatar,
  Tooltip,
  Checkbox,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  HourglassEmpty as PendingIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTask } from '../../../context/TaskContext';
import { cn } from '../../../utils/cn';

const getStatusIcon = (status) => {
  switch (status) {
    case 'Completed':
      return <CheckCircleIcon fontSize="small" />;
    case 'In Progress':
      return <ScheduleIcon fontSize="small" />;
    default:
      return <PendingIcon fontSize="small" />;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Completed':
      return 'task-status-completed';
    case 'In Progress':
      return 'task-status-progress';
    default:
      return 'task-status-pending';
  }
};

const TaskCard = ({ task, index }) => {
  const {
    isAdmin,
    selectedTasks,
    handleTaskSelection: onSelect,
    setSelectedTask,
    setIsEditOpen,
    handleDelete: onDelete,
  } = useTask();

  const taskId = task.taskId || task.id;
  const isSelected = selectedTasks.includes(taskId);

  const handleEdit = (t) => {
    setSelectedTask(t);
    setIsEditOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      key={taskId}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col hover:-translate-y-1 focus-within:ring-2 focus-within:ring-brand-secondary outline-none"
      tabIndex={0}
    >
      {isAdmin && (
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect(taskId)}
          className="absolute top-2 left-2 z-10"
        />
      )}

      <div className="absolute top-2 right-2 z-10">
        <Tooltip title="Eliminar">
          <IconButton
            size="small"
            onClick={() => onDelete(taskId)}
            sx={{
              color: 'error.main',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      <div className="flex justify-between items-start mb-4 w-full">
        <div>
          <Typography className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <AssignmentIcon className="text-gray-500" />
            {task.projectName || `Proyecto #${task.projectId}`}
          </Typography>
          <span
            className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium', getStatusClass(task.status))}
          >
            {getStatusIcon(task.status)} {task.status}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto relative z-10">
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => handleEdit(task)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <Typography className="flex-grow mb-4 text-gray-600 text-sm leading-relaxed">
        {task.description}
      </Typography>

      <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          <Avatar sx={{ width: '1.5rem', height: '1.5rem', bgcolor: 'grey.900' }}>
            {task.workerName ? (
              task.workerName.charAt(0).toUpperCase()
            ) : (
              <PersonIcon fontSize="small" />
            )}
          </Avatar>
          <span>{task.workerName || `Trabajador #${task.workerId}`}</span>
          {task.workerEmail && (
            <Typography variant="caption" sx={{ ml: 1 }}>
              ({task.workerEmail})
            </Typography>
          )}
        </div>
        <div className="text-gray-400 text-sm">
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
