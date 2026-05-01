import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Tooltip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Assignment as ProjectIcon,
  Timeline as TimelineIcon,
  Update as UpdateIcon,
  Info as InfoIcon,
  Task as TaskIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { taskService } from '../../services/taskService';
import logger from '../../utils/logger';

// Update the StyledCard component to use the burgundy color
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: '#8e3031', // Changed to burgundy color
    borderRadius: '4px 4px 0 0',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getColor = () => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return { bg: theme.palette.info.light, color: theme.palette.info.dark };
      case 'completed':
        return { bg: theme.palette.success.light, color: theme.palette.success.dark };
      case 'pending':
        return { bg: theme.palette.warning.light, color: theme.palette.warning.dark };
      default:
        return { bg: theme.palette.grey[200], color: theme.palette.grey[700] };
    }
  };
  const { bg, color } = getColor();
  return {
    backgroundColor: bg,
    color: color,
    fontWeight: 600,
    '& .MuiChip-label': {
      padding: '0 12px',
    },
  };
});

// Update the StyledModal component
const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiPaper-root': {
    width: '90%',
    maxWidth: 1200,
    maxHeight: '90vh',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    background: theme.palette.background.paper,
    animation: 'modalFadeIn 0.3s ease-out',
  },
  '@keyframes modalFadeIn': {
    from: {
      opacity: 0,
      transform: 'scale(0.95)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
}));

// Add this new styled component
const ModalHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #8e3031 0%, #592d2d 100%)`, // Changed to burgundy gradient
  padding: theme.spacing(3),
  color: theme.palette.primary.contrastText,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

const ProjectMetadata = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  marginTop: theme.spacing(2),
}));

const WorkerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState(null);
  const [tasksModalOpen, setTasksModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskUpdateDialog, setTaskUpdateDialog] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('');
  
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);

  const renderProjectCard = (project) => (
    <StyledCard>
      <CardContent className="flex-grow p-6">
        <Box className="flex justify-between items-start mb-4">
          <Box className="flex items-center gap-2">
            <ProjectIcon color="primary" />
            <Typography variant="h6" component="h2" className="font-semibold">
              {project.projectName}
            </Typography>
          </Box>
          <StatusChip
            status={project.status}
            label={project.status}
            size="small"
          />
        </Box>

        <Divider className="my-4" />

        <Typography variant="body2" color="text.secondary" className="mb-4 min-h-[60px]">
          <DescriptionIcon className="text-base mr-2 align-text-bottom" />
          {project.description || 'Sin descripción disponible'}
        </Typography>

        <ProjectMetadata>
          <Typography variant="body2">
            {/* Metadata placeholder */}
          </Typography>
        </ProjectMetadata>
      </CardContent>

      <CardActions className="p-4 pt-0 gap-2">
        <Button
          fullWidth
          variant="outlined"
          startIcon={<TaskIcon />}
          onClick={() => fetchProjectTasks(project.projectId)}
        >
          Ver Tareas
        </Button>
      </CardActions>
    </StyledCard>
  );

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/projects/worker/projects`,
        {
          headers: { 'accesstoken': accessToken }
        }
      );
      setProjects(response.data.projects || []);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los proyectos: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchProjects();
    }
  }, [accessToken]);

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/projects/${projectId}/status`,
        { status: newStatus },
        { headers: { 'accesstoken': accessToken } }
      );
      fetchProjects();
      setOpenDialog(false);
    } catch (err) {
      setError('Error al actualizar el estado: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleViewDetails = (projectId) => {
    navigate(`/project-status/${projectId}`);
  };

  const fetchProjectTasks = async (projectId) => {
    try {
      logger.debug('Fetching tasks for project:', projectId);
      if (!projectId) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/projects/${projectId}/worker/tasks`,
        {
          headers: { 'accesstoken': accessToken }
        }
      );
      setTasks(response.data.tasks || []);
      setSelectedProjectTasks(projectId);
      setTasksModalOpen(true);
    } catch (err) {
      logger.error('Error fetching tasks:', err);
      setError('Error al cargar las tareas: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCloseTasksModal = () => {
    setTasksModalOpen(false);
    setSelectedProjectTasks(null);
    setTasks([]);
  };

  const handleUpdateTaskStatus = async () => {
    try {
      await taskService.updateTaskStatus(selectedTask.taskId, newTaskStatus);
      await fetchProjectTasks(selectedProjectTasks);
      setTaskUpdateDialog(false);
      setSelectedTask(null);
      setNewTaskStatus('');
    } catch (err) {
      setError('Error al actualizar el estado de la tarea: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="mt-8">
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-8">
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #8e3031 30%, #592d2d 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Mis Proyectos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gestiona y visualiza el progreso de tus proyectos
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-8">
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.projectId}>
            <Fade in timeout={300}>
              {renderProjectCard(project)}
            </Fade>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        {/* Dialog content for project status change if needed */}
      </Dialog>

      <StyledModal open={tasksModalOpen} onClose={handleCloseTasksModal}>
        <Paper className="flex flex-col h-[90vh]">
          <ModalHeader>
            <Box className="flex items-center gap-4">
              <TaskIcon className="text-3xl" />
              <Typography variant="h5" component="h2" className="font-semibold">
                Tareas del Proyecto
              </Typography>
            </Box>
          </ModalHeader>

          <Box className="p-6 flex-grow overflow-auto">
            <TableContainer className="rounded shadow-sm" sx={{ 
              '& .MuiTable-root': {
                borderCollapse: 'separate',
                borderSpacing: '0 8px',
              },
            }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="font-semibold text-brand-primary">Descripción</TableCell>
                    <TableCell className="font-semibold text-brand-primary">Estado</TableCell>
                    <TableCell className="font-semibold text-brand-primary">Fecha de Creación</TableCell>
                    <TableCell className="font-semibold text-brand-primary">Última Actualización</TableCell>
                    <TableCell className="font-semibold text-brand-primary">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow 
                      key={task.taskId || task._id}
                      className="transition-all duration-200 hover:bg-black/5 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <TableCell>{task.description}</TableCell>
                      <TableCell>
                        <StatusChip status={task.status} label={task.status} />
                      </TableCell>
                      <TableCell>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(task.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Actualizar Estado" arrow>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<UpdateIcon />}
                            onClick={() => {
                              setSelectedTask(task);
                              setNewTaskStatus(task.status);
                              setTaskUpdateDialog(true);
                            }}
                            className="shadow-none hover:shadow-lg"
                          >
                            Actualizar
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {tasks.length === 0 && (
              <Box className="py-16 flex flex-col items-center gap-4">
                <TaskIcon className="text-5xl text-gray-400" />
                <Typography variant="h6" color="text.secondary">
                  No hay tareas asignadas para este proyecto
                </Typography>
              </Box>
            )}
          </Box>

          <Box className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
            <Button
              onClick={handleCloseTasksModal}
              variant="contained"
              color="primary"
              startIcon={<CloseIcon />}
              className="shadow-none hover:shadow-lg"
            >
              Cerrar
            </Button>
          </Box>
        </Paper>
      </StyledModal>

      <Dialog open={taskUpdateDialog} onClose={() => setTaskUpdateDialog(false)}>
        <DialogTitle>
          Actualizar Estado de Tarea
        </DialogTitle>
        <DialogContent className="min-w-[300px]">
          <FormControl fullWidth className="mt-4">
            <InputLabel>Estado</InputLabel>
            <Select
              value={newTaskStatus}
              label="Estado"
              onChange={(e) => setNewTaskStatus(e.target.value)}
            >
              <MenuItem value="Pending">En espera</MenuItem>
              <MenuItem value="In Progress">En Progreso</MenuItem>
              <MenuItem value="Completed">Completado</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskUpdateDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateTaskStatus}
            variant="contained"
            color="primary"
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkerProjects;