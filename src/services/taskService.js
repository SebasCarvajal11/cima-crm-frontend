import axios from 'axios';
import { store } from '../redux/store';
import logger from '../utils/logger';

const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

// Helper function to get the authentication token from Redux store
const getAuthToken = () => {
  const state = store.getState();
  return state.auth?.accessToken || localStorage.getItem('accessToken');
};

// Helper to create headers with authentication token
const getHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
    'accesstoken': getAuthToken()
  }
});

export const taskService = {
  async createTask(task) {
    logger.debug('API Request - Create Task:', task);
    const response = await axios.post(API_URL, task, getHeaders());
    logger.debug('API Response - Create Task:', response.data);
    return response.data;
  },

  async createOrUpdateTask(task) {
    // If task has an ID, update it; otherwise, create a new task
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
    const response = await axios.put(
      `${API_URL}/${taskId}/status`, 
      { status }, 
      getHeaders()
    );
    logger.debug('API Response - Update Task Status:', response.data);
    return response.data;
  },

  async updateTask(id, task) {
    if (!id) {
      logger.error('Error: Task ID is undefined or null', task);
      throw new Error('Task ID is required');
    }
    
    logger.debug('API Request - Update Task:', id, task);
    const response = await axios.put(`${API_URL}/${id}`, task, getHeaders());
    logger.debug('API Response - Update Task:', response.data);
    return response.data;
  },

  async getTaskById(id) {
    logger.debug('API Request - Get Task by ID:', id);
    const response = await axios.get(`${API_URL}/${id}`, getHeaders());
    logger.debug('API Response - Get Task by ID:', response.data);
    return response.data;
  },

  async deleteTask(id) {
    logger.debug('API Request - Delete Task:', id);
    const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
    logger.debug('API Response - Delete Task:', response.data);
    return response.data;
  },

  async listTasks(filters = {}) {
    logger.debug('API Request - List Tasks with filters:', filters);
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}?${params}`, getHeaders());
    logger.debug('API Response - List Tasks:', response.data);
    return response.data;
  },

  async getTasksWithProjectDetails(filters = {}) {
    logger.debug('API Request - Get Tasks with Project Details, filters:', filters);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      );
      const response = await axios.get(`${API_URL}/with-project-details`, {
        params: cleanFilters,
        ...getHeaders()
      });
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
      
      // Primero intenta con el endpoint detallado
      const response = await axios.get(`${API_URL}/all/detailed`, {
        params: cleanFilters,
        ...getHeaders()
      });
      
      logger.debug('API Response - Get Detailed Tasks:', response.data);
      return response.data;
    } catch (error) {
      logger.error('API Error - Get Detailed Tasks:', error);
      // Si falla el endpoint detallado, usa el endpoint regular
      if (error.response?.status === 404) {
        logger.warn('Endpoint detallado no encontrado, usando endpoint regular');
        return this.listTasks(filters);
      }
      throw error;
    }
  },
  
  async getTasksByProject(projectId) {
    const response = await axios.get(`${API_URL}/project/${projectId}`, getHeaders());
    return response.data;
  },
  
  async getTasksByWorker(workerId) {
    const response = await axios.get(`${API_URL}/worker/${workerId}`, getHeaders());
    return response.data;
  },
  
  async getTasksByStatus(status) {
    const response = await axios.get(`${API_URL}/status/${status}`, getHeaders());
    return response.data;
  },
  
  // Admin endpoints
  async getTaskStats() {
    const response = await axios.get(`${API_URL}/admin/stats`, getHeaders());
    return response.data;
  },
  
  async getTasksByDateRange(startDate, endDate) {
    const response = await axios.get(
      `${API_URL}/admin/date-range?startDate=${startDate}&endDate=${endDate}`,
      getHeaders()
    );
    return response.data;
  },
  
  async bulkUpdateTaskStatus(taskIds, status) {
    const response = await axios.post(
      `${API_URL}/admin/bulk-update-status`,
      { taskIds, status },
      getHeaders()
    );
    return response.data;
  },
  
  async bulkAssignTasks(taskIds, workerId) {
    const response = await axios.post(
      `${API_URL}/admin/bulk-assign`,
      { taskIds, workerId },
      getHeaders()
    );
    return response.data;
  },
  
  // Additional endpoints
  async getAllTasks() {
    const response = await axios.get(`${API_URL}/all`, getHeaders());
    return response.data;
  },
  
  async getDetailedTaskById(id) {
    const response = await axios.get(`${API_URL}/detailed/${id}`, getHeaders());
    return response.data;
  },
  
  async getWorkerPerformance(workerId) {
    const response = await axios.get(
      `${API_URL}/admin/worker-performance/${workerId}`,
      getHeaders()
    );
    return response.data;
  }
};