import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container, Grid, Alert, Fade,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { LoadingState, PageHeader } from '../ui';
import api from '../../services/api';
import { taskService } from '../../services/taskService';
import logger from '../../utils/logger';
import { useNotification } from '../../hooks/useNotification';
import ProjectCard from './components/ProjectCard';
import TasksModal from './components/TasksModal';
import TaskUpdateDialog from './components/TaskUpdateDialog';

const WorkerProjects = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const notify = useNotification();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [tasksModalOpen, setTasksModalOpen] = useState(false);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskUpdateDialog, setTaskUpdateDialog] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/worker/projects');
      setProjects(response.data.projects || []);
      setError(null);
    } catch (err) {
      const msg = 'Error al cargar los proyectos';
      setError(msg);
      notify.error(msg, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchProjects();
    }
  }, [accessToken]);

  const fetchProjectTasks = async (projectId) => {
    if (!projectId) return;
    try {
      const response = await api.get(`/projects/${projectId}/worker/tasks`);
      setTasks(response.data.tasks || []);
      setSelectedProjectTasks(projectId);
      setTasksModalOpen(true);
    } catch (err) {
      notify.error('Error al cargar las tareas', err);
    }
  };

  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setNewTaskStatus(task.status);
    setTaskUpdateDialog(true);
  };

  const handleUpdateTaskStatus = async () => {
    try {
      await taskService.updateTaskStatus(selectedTask.taskId, newTaskStatus);
      await fetchProjectTasks(selectedProjectTasks);
      setTaskUpdateDialog(false);
      setSelectedTask(null);
      setNewTaskStatus('');
      notify.success('Estado de tarea actualizado');
    } catch (err) {
      notify.error('Error al actualizar el estado de la tarea', err);
    }
  };

  if (loading) {
    return <LoadingState minHeight="24rem" />;
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <PageHeader
        icon={FolderIcon}
        title="Mis Proyectos"
        subtitle="Gestiona y visualiza el progreso de tus proyectos"
      />

      {error && (
        <Alert severity="error" className="mb-8">{error}</Alert>
      )}

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.projectId}>
            <Fade in timeout={300}>
              <ProjectCard project={project} onViewTasks={fetchProjectTasks} />
            </Fade>
          </Grid>
        ))}
      </Grid>

      <TasksModal
        open={tasksModalOpen}
        onClose={() => {
          setTasksModalOpen(false);
          setSelectedProjectTasks(null);
          setTasks([]);
        }}
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
      />

      <TaskUpdateDialog
        open={taskUpdateDialog}
        onClose={() => setTaskUpdateDialog(false)}
        onUpdate={handleUpdateTaskStatus}
        status={newTaskStatus}
        onStatusChange={setNewTaskStatus}
      />
    </Container>
  );
};

export default WorkerProjects;
