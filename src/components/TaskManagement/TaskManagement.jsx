import React, { useState, useEffect } from 'react';

import {
  Button,
  TextField,
  MenuItem,
  IconButton,
  Typography,

  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Tooltip,
  CircularProgress,
  Alert,
  Checkbox,
  Tabs,
  Tab,
  Grid,
  Paper
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,

  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  HourglassEmpty as PendingIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,

  BarChart as BarChartIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { taskService } from '../../services/taskService';
import { toast } from 'react-toastify';
import './TaskManagement.css';
import { useSelector } from 'react-redux';
import { CreateTaskDialog } from './components/CreateTaskDialog';
import { EditTaskDialog } from './components/EditTaskDialog';
import { BulkActionDialog } from './components/BulkActionDialog';

const TaskManagement = () => {
  // Estado para el usuario actual
  const { user, token } = useSelector((state) => state.auth);
  const isAdmin = user && user.role === 'Admin';
  // Estados para tareas
  const [tasks, setTasks] = useState([]); // Inicializado como arreglo vacío
  const [error, setError] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  
  // Estados de control para las variantes de diálogos
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('');
  const [workerFilter, setWorkerFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: '',
    endDate: ''
  });
  
  // Estado para estadísticas
  const [taskStats, setTaskStats] = useState(null);
  
  // Estado para pestañas
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, projectFilter, workerFilter]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      // Usar el endpoint adecuado según los filtros aplicados
      if (projectFilter && !workerFilter && !statusFilter) {
        console.log('Fetching tasks by project:', projectFilter);
        response = await taskService.getTasksByProject(projectFilter);
        console.log('Tasks by project response:', response);
      } else if (!projectFilter && workerFilter && !statusFilter) {
        console.log('Fetching tasks by worker:', workerFilter);
        response = await taskService.getTasksByWorker(workerFilter);
        console.log('Tasks by worker response:', response);
      } else if (!projectFilter && !workerFilter && statusFilter !== 'all') {
        console.log('Fetching tasks by status:', statusFilter);
        response = await taskService.getTasksByStatus(statusFilter);
        console.log('Tasks by status response:', response);
      } else {
        // Si hay múltiples filtros o ninguno, usar el endpoint detallado
        const filters = {};
        if (projectFilter) filters.projectId = projectFilter;
        if (workerFilter) filters.workerId = workerFilter;
        if (statusFilter !== 'all') filters.status = statusFilter;
        
        console.log('Fetching detailed tasks with filters:', filters);
        response = await taskService.getDetailedTasks(filters);
        console.log('Detailed tasks response:', response);
      }
      
      // Extraer el arreglo de tareas de la respuesta
      const tasksArray = response.tasks || response;
      console.log('Extracted tasks array:', tasksArray);
      
      setTasks(Array.isArray(tasksArray) ? tasksArray : []);
      setFilteredTasks(Array.isArray(tasksArray) ? tasksArray : []);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError('Error al cargar las tareas. Por favor, intente nuevamente.');
      
      // Datos de ejemplo para desarrollo
      const mockTasks = [
        { id: 1, projectId: 101, workerId: 201, description: 'Desarrollar página de inicio', status: 'Pending', createdAt: '2023-05-15' },
        { id: 2, projectId: 102, workerId: 202, description: 'Implementar autenticación de usuarios', status: 'In Progress', createdAt: '2023-05-16' },
        { id: 3, projectId: 101, workerId: 203, description: 'Diseñar interfaz de usuario para dashboard', status: 'Completed', createdAt: '2023-05-10' },
        { id: 4, projectId: 103, workerId: 201, description: 'Optimizar consultas de base de datos', status: 'In Progress', createdAt: '2023-05-18' },
        { id: 5, projectId: 102, workerId: 204, description: 'Crear API para gestión de tareasSSSS', status: 'Pending', createdAt: '2023-05-20' },
        { id: 6, projectId: 104, workerId: 205, description: 'Implementar sistema de notificaciones', status: 'Completed', createdAt: '2023-05-12' },
      ];
      console.log('Using mock tasks due to error');
      setTasks(mockTasks);
      setFilteredTasks(mockTasks);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas de tareas (solo para Admin)
  const loadTaskStats = async () => {
    if (!isAdmin) return;
    
    try {
      console.log('Fetching task statistics');
      const response = await taskService.getTaskStats();
      console.log('Task statistics response:', response);
      setTaskStats(response);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('No se pudieron cargar las estadísticas');
      
      // Valores por defecto para evitar errores en el mapeo
      setTaskStats({
        success: false,
        stats: {
          completed: 0,
          inProgress: 0,
          pending: 0,
          total: 0,
          totalProjects: 0,
          totalWorkers: 0
        }
      });
    }
  };

  const filterTasks = () => {
    if (!Array.isArray(tasks)) {
      console.error('Tasks is not an array:', tasks);
      setFilteredTasks([]);
      return;
    }
  
    let result = [...tasks];
    
    // Filtrar por término de búsqueda (incluye nombre de proyecto)
    if (searchTerm) {
      result = result.filter(task => 
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.projectName && task.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtrar por estado - corregido para que funcione siempre que no sea "all"
    if (statusFilter !== 'all') {
      result = result.filter(task => task.status === statusFilter);
    }
    
    // Filtrar por proyecto
    if (projectFilter) {
      result = result.filter(task => task.projectId.toString() === projectFilter.toString());
    }
    
    // Filtrar por trabajador
    if (workerFilter) {
      result = result.filter(task => task.workerId.toString() === workerFilter.toString());
    }
    
    setFilteredTasks(result);
  };

  const openCreateDialog = () => setIsCreateOpen(true);
  
  const openEditDialog = (task) => {
    setSelectedTask(task);
    setIsEditOpen(true);
  };
  
  const openBulkActionDialog = () => {
    if (selectedTasks.length === 0) {
      toast.warning('Seleccione al menos una tarea');
      return;
    }
    setIsBulkOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta tarea?')) {
      setLoading(true);
      try {
        await taskService.deleteTask(id);
        toast.success('Tarea eliminada exitosamente');
        loadTasks();
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        toast.error('Error al eliminar la tarea');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleSelectAllTasks = (event) => {
    if (event.target.checked) {
      setSelectedTasks(filteredTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1 && isAdmin) {
      loadTaskStats();
    }
  };

  const handleDateRangeSearch = async () => {
    if (!dateRangeFilter.startDate || !dateRangeFilter.endDate) {
      toast.warning('Por favor seleccione fechas de inicio y fin');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Searching tasks by date range:', dateRangeFilter);
      const tasks = await taskService.getTasksByDateRange(
        dateRangeFilter.startDate,
        dateRangeFilter.endDate
      );
      console.log('Tasks by date range response:', tasks);
      setTasks(tasks);
      setFilteredTasks(tasks);
    } catch (error) {
      console.error('Error al buscar por rango de fechas:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('Error al buscar tareas por rango de fechas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed':
        return <CheckCircleIcon fontSize="small" />;
      case 'In Progress':
        return <ScheduleIcon fontSize="small" />;
      default:
        return <PendingIcon fontSize="small" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'task-status-completed';
      case 'In Progress':
        return 'task-status-progress';
      default:
        return 'task-status-pending';
    }
  };

  return (
    <div className="task-management-container">
      <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            className="task-tabs"
            sx={{
              '& .MuiTab-root': {
                color: '#592d2d',
                '&:hover': {
                  color: '#000000',
                },
                '&.Mui-selected': {
                  color: '#000000',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#000000',
              }
            }}
          >
            <Tab label="Gestión de Tareas" />
            {isAdmin && <Tab label="Estadísticas" />}
          </Tabs>

      {tabValue === 0 && (
        <>
          <div className="task-header">
            <Typography variant="h4" component="h1" sx={{ color: '#592d2d' }}>
              Gestión de Tareas
            </Typography>
            <div className="task-header-actions">
              {selectedTasks.length > 0 && isAdmin && (
                <Button
                  variant="outlined"
                  onClick={openBulkActionDialog}
                  startIcon={<AssignmentIcon />}
                  sx={{ mr: 2 }}
                >
                  Acciones en Masa ({selectedTasks.length})
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreateDialog}
                sx={{ 
                  background: 'linear-gradient(45deg, #2c3e50 30%,rgb(0, 0, 0) 90%)',
                  boxShadow: '0 3px 5px 2px rgba(52, 152, 219, .3)'
                }}  
              >
                Nueva Tarea
              </Button>
            </div>
          </div>

          <div className="task-filters">
            <TextField
              placeholder="Buscar por descripción o nombre de proyecto..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Estado"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="Pending">Pendientes</MenuItem>
                <MenuItem value="In Progress">En Progreso</MenuItem>
                <MenuItem value="Completed">Completadas</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Proyecto</InputLabel>
              <Select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                label="Proyecto"
              >
                <MenuItem value="">Todos</MenuItem>
                {filteredTasks
                  .reduce((uniqueProjects, task) => {
                    if (task.projectId && !uniqueProjects.some(p => p.id === task.projectId)) {
                      uniqueProjects.push({
                        id: task.projectId,
                        name: task.projectName || `Proyecto #${task.projectId}`
                      });
                    }
                    return uniqueProjects;
                  }, [])
                  .map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            
      
            
            <IconButton onClick={loadTasks} color="primary">
              <RefreshIcon />
            </IconButton>
          </div>

          

          {loading ? (
            <div className="loading-container">
              <CircularProgress />
            </div>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
          ) : (
            <div className="task-grid">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div key={task.taskId || task.id} className="task-card">
  {isAdmin && (
    <Checkbox
      checked={selectedTasks.includes(task.taskId || task.id)}
      onChange={() => handleTaskSelection(task.taskId || task.id)}
      className="task-checkbox"
    />
  )}

  {/* Botón de eliminar posicionado en la esquina superior derecha */}
  <div className="delete-icon">
    <Tooltip title="Eliminar">
      <IconButton 
        size="small" 
        onClick={() => handleDelete(task.taskId || task.id)}
        sx={{
          color: '#d32f2f',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </div>

  <div className="task-card-header">
    <div>
      <Typography className="task-project-name">
        <AssignmentIcon className="task-project-icon" />
        {task.projectName || `Proyecto #${task.projectId}`}
      </Typography>
      <span className={`task-status-chip ${getStatusClass(task.status)}`}>
        {getStatusIcon(task.status)} {task.status}
      </span>
    </div>
    <div className="task-actions">
      <Tooltip title="Editar">
        <IconButton 
          size="small" 
          onClick={() => openEditDialog(task)}
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {/* Eliminamos el botón de eliminar de aquí */}
    </div>
  </div>
  {/* Resto del contenido de la tarjeta */}
  <Typography className="task-card-description">
    {task.description}
  </Typography>
  <div className="task-card-footer">
    <div className="task-worker-info">
      <Avatar sx={{ width: 24, height: 24, bgcolor: '#000000' }}>
        {task.workerName ? task.workerName.charAt(0).toUpperCase() : <PersonIcon fontSize="small" />}
      </Avatar>
      <span>{task.workerName || `Trabajador #${task.workerId}`}</span>
      {task.workerEmail && (
        <Typography variant="caption" sx={{ ml: 1 }}>
          ({task.workerEmail})
        </Typography>
      )}
    </div>
    <div className="task-date">
      {new Date(task.createdAt).toLocaleDateString()}
    </div>
  </div>
</div>

                ))
              ) : (
                <Typography variant="body1" sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4 }}>
                  No se encontraron tareas con los filtros aplicados.
                </Typography>
              )}
            </div>
          )}
        </>
      )}
{/* Sección de Estadísticas */}
      {tabValue === 1 && isAdmin && (
        <div className="stats-container">
          <Typography variant="h5" sx={{ mb: 4, display: 'flex', alignItems: 'center', color: '#2c3e50', fontWeight: 600 }}>
            <BarChartIcon sx={{ mr: 1 }} /> Estadísticas de Tareas
          </Typography>
          
          {taskStats ? (
            <>
              {/* Cards principales */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper className="stats-card" elevation={3} sx={{ 
                    p: 3, 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <div className="stats-card-content">
                      <div className="stats-card-icon total">
                        <AssignmentIcon fontSize="large" />
                      </div>
                      <div>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>{taskStats.stats?.total || 0}</Typography>
                        <Typography variant="subtitle1" sx={{ color: '#64748b' }}>Tareas Totales</Typography>
                      </div>
                    </div>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper className="stats-card" elevation={3} sx={{ 
                    p: 3, 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <div className="stats-card-content">
                      <div className="stats-card-icon completed">
                        <CheckCircleIcon fontSize="large" />
                      </div>
                      <div>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>{taskStats.stats?.completed || 0}</Typography>
                        <Typography variant="subtitle1" sx={{ color: '#64748b' }}>Completadas</Typography>
                      </div>
                    </div>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper className="stats-card" elevation={3} sx={{ 
                    p: 3, 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #fff9e6 0%, #ffeeba 100%)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <div className="stats-card-content">
                      <div className="stats-card-icon in-progress">
                        <ScheduleIcon fontSize="large" />
                      </div>
                      <div>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>{taskStats.stats?.inProgress || 0}</Typography>
                        <Typography variant="subtitle1" sx={{ color: '#64748b' }}>En Progreso</Typography>
                      </div>
                    </div>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper className="stats-card" elevation={3} sx={{ 
                    p: 3, 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { 
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <div className="stats-card-content">
                      <div className="stats-card-icon pending">
                        <PendingIcon fontSize="large" />
                      </div>
                      <div>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>{taskStats.stats?.pending || 0}</Typography>
                        <Typography variant="subtitle1" sx={{ color: '#64748b' }}>Pendientes</Typography>
                      </div>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
              
              {/* Gráficos y detalles */}
              <Grid container spacing={3}>
                {/* Distribución de tareas */}
                <Grid item xs={12} md={6}>
                  <Paper className="stats-detail-card" elevation={3} sx={{ 
                    p: 3, 
                    borderRadius: '12px',
                    height: '100%',
                    background: 'white'
                  }}>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                      <BarChartIcon sx={{ mr: 1, color: '#3498db' }} /> Distribución de Tareas
                    </Typography>
                    
                    <div className="stats-progress-container">
                      <div className="stats-progress-item">
                        <div className="stats-progress-label">
                          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                            <span className="status-dot completed"></span>
                            Completadas
                          </Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            {Math.round((taskStats.stats?.completed / taskStats.stats?.total || 0) * 100)}%
                          </Typography>
                        </div>
                        <div className="stats-progress-bar-container">
                          <div 
                            className="stats-progress-bar completed" 
                            style={{ width: `${(taskStats.stats?.completed / taskStats.stats?.total || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="stats-progress-item">
                        <div className="stats-progress-label">
                          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                            <span className="status-dot in-progress"></span>
                            En Progreso
                          </Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            {Math.round((taskStats.stats?.inProgress / taskStats.stats?.total || 0) * 100)}%
                          </Typography>
                        </div>
                        <div className="stats-progress-bar-container">
                          <div 
                            className="stats-progress-bar in-progress" 
                            style={{ width: `${(taskStats.stats?.inProgress / taskStats.stats?.total || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="stats-progress-item">
                        <div className="stats-progress-label">
                          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                            <span className="status-dot pending"></span>
                            Pendientes
                          </Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            {Math.round((taskStats.stats?.pending / taskStats.stats?.total || 0) * 100)}%
                          </Typography>
                        </div>
                        <div className="stats-progress-bar-container">
                          <div 
                            className="stats-progress-bar pending" 
                            style={{ width: `${(taskStats.stats?.pending / taskStats.stats?.total || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Paper>
                </Grid>
                
                {/* Resumen del proyecto */}
                <Grid item xs={12} md={6}>
                  <Paper className="stats-detail-card" elevation={3} sx={{ 
                    p: 3, 
                    borderRadius: '12px',
                    height: '100%',
                    background: 'white'
                  }}>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                      <PersonIcon sx={{ mr: 1, color: '#9c27b0' }} /> Resumen de tareas
                    </Typography>
                    
                    <div className="stats-info-grid">
                    <div className="stats-info-item">
                        <div className="stats-info-icon efficiency">
                          <CheckCircleIcon />
                        </div>
                        <div className="stats-info-content">
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {taskStats.stats?.total ? Math.round((taskStats.stats?.completed / taskStats.stats?.total) * 100) : 0}%
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Tasa de Finalización
                          </Typography>
                        </div>
                      </div>
                      
                      
                      
                      
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </>
          ) : (
            <div className="loading-container">
              <CircularProgress />
            </div>
          )}
        </div>
      )}

      {/* Componentes de Diálogos Refactorizados */}
      <CreateTaskDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={loadTasks}
        token={token}
        fallbackTasks={filteredTasks}
      />

      <EditTaskDialog
        open={isEditOpen}
        task={selectedTask}
        onClose={() => setIsEditOpen(false)}
        onSuccess={loadTasks}
        token={token}
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
        token={token}
        fallbackTasks={filteredTasks}
      />
    </div>
  );
};

export default TaskManagement;
