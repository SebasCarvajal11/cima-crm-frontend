import api from './api';
import logger from '../utils/logger';

export const taskService = {
  async createTask(task) {
    logger.debug('API Request - Create Task:', task);
    const response = await api.post('/tasks', task);
    logger.debug('API Response - Create Task:', response.data);
    return response.data;
  },

  async createOrUpdateTask(task) {
    if (task.id || task.taskId) {
      const taskId = task.id || task.taskId;
      logger.debug('Updating existing task:', taskId);
      return this.updateTask(taskId, task);
    } else {
      logger.debug('Creating new task as no ID was provided');
      return this.createTask(task);
    }
  },

  async updateTaskStatus(taskId, status) {
    if (!taskId) {
      logger.error('Error: taskId is undefined or null');
      throw new Error('Task ID is required');
    }

    logger.debug('API Request - Update Task Status:', taskId, status);
    const response = await api.put(`/tasks/${taskId}/status`, { status });
    logger.debug('API Response - Update Task Status:', response.data);
    return response.data;
  },

  async updateTask(id, task) {
    if (!id) {
      logger.error('Error: Task ID is undefined or null', task);
      throw new Error('Task ID is required');
    }

    logger.debug('API Request - Update Task:', id, task);
    const response = await api.put(`/tasks/${id}`, task);
    logger.debug('API Response - Update Task:', response.data);
    return response.data;
  },

  async getTaskById(id) {
    logger.debug('API Request - Get Task by ID:', id);
    const response = await api.get(`/tasks/${id}`);
    logger.debug('API Response - Get Task by ID:', response.data);
    return response.data;
  },

  async deleteTask(id) {
    logger.debug('API Request - Delete Task:', id);
    const response = await api.delete(`/tasks/${id}`);
    logger.debug('API Response - Delete Task:', response.data);
    return response.data;
  },

  async listTasks(filters = {}) {
    logger.debug('API Request - List Tasks with filters:', filters);
    const response = await api.get('/tasks', { params: filters });
    logger.debug('API Response - List Tasks:', response.data);
    return response.data;
  },

  async getTasksWithProjectDetails(filters = {}) {
    logger.debug('API Request - Get Tasks with Project Details, filters:', filters);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      );
      const response = await api.get('/tasks/with-project-details', { params: cleanFilters });
      logger.debug('API Response - Get Tasks with Project Details:', response.data);
      return response.data;
    } catch (error) {
      logger.error('API Error - Get Tasks with Project Details:', error);
      if (error.response?.status === 404) {
        logger.warn('Detailed endpoint not found, falling back to regular endpoint');
        const tasks = await this.listTasks(filters);
        return tasks.map(task => ({ ...task, project: { name: 'Unknown Project' } }));
      }
      throw error;
    }
  },

  async getDetailedTasks(filters = {}) {
    logger.debug('API Request - Get Detailed Tasks, filters:', filters);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      );

      const response = await api.get('/tasks/all/detailed', { params: cleanFilters });

      logger.debug('API Response - Get Detailed Tasks:', response.data);
      return response.data;
    } catch (error) {
      logger.error('API Error - Get Detailed Tasks:', error);
      if (error.response?.status === 404) {
        logger.warn('Endpoint detallado no encontrado, usando endpoint regular');
        return this.listTasks(filters);
      }
      throw error;
    }
  },

  async getTasksByProject(projectId) {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  },

  async getTasksByWorker(workerId) {
    const response = await api.get(`/tasks/worker/${workerId}`);
    return response.data;
  },

  async getTasksByStatus(status) {
    const response = await api.get(`/tasks/status/${status}`);
    return response.data;
  },

  async getTaskStats() {
    const response = await api.get('/tasks/admin/stats');
    return response.data;
  },

  async getTasksByDateRange(startDate, endDate) {
    const response = await api.get('/tasks/admin/date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  async bulkUpdateTaskStatus(taskIds, status) {
    const response = await api.post('/tasks/admin/bulk-update-status', { taskIds, status });
    return response.data;
  },

  async bulkAssignTasks(taskIds, workerId) {
    const response = await api.post('/tasks/admin/bulk-assign', { taskIds, workerId });
    return response.data;
  },

  async getAllTasks() {
    const response = await api.get('/tasks/all');
    return response.data;
  },

  async getDetailedTaskById(id) {
    const response = await api.get(`/tasks/detailed/${id}`);
    return response.data;
  },

  async getWorkerPerformance(workerId) {
    const response = await api.get(`/tasks/admin/worker-performance/${workerId}`);
    return response.data;
  }
};
