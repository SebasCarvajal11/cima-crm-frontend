export const PROJECT_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.PENDING]: 'Pendiente',
  [PROJECT_STATUS.IN_PROGRESS]: 'En Progreso',
  [PROJECT_STATUS.COMPLETED]: 'Completado',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: 'Pendiente',
  [TASK_STATUS.IN_PROGRESS]: 'En Progreso',
  [TASK_STATUS.COMPLETED]: 'Completado',
};

export const STATUS_CHIP_COLORS = {
  [PROJECT_STATUS.COMPLETED]: 'success',
  [PROJECT_STATUS.IN_PROGRESS]: 'info',
  [PROJECT_STATUS.PENDING]: 'warning',
  default: 'default',
};

export const getStatusLabel = (status) =>
  PROJECT_STATUS_LABELS[status] || status || 'Desconocido';

export const getStatusChipColor = (status) =>
  STATUS_CHIP_COLORS[status?.toLowerCase?.()] ||
  STATUS_CHIP_COLORS[status] ||
  STATUS_CHIP_COLORS.default;
