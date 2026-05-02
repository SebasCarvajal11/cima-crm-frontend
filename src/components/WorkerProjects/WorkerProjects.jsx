import { useState } from 'react';
import {
  Container, Grid, Alert, Fade,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { LoadingState, PageHeader } from '../ui';
import { useGetWorkerProjectsQuery, useGetTasksQuery, useUpdateTaskStatusMutation } from '../../redux/api';
import { useNotification } from '../../hooks/useNotification';
import ProjectCard from './components/ProjectCard';
import TasksModal from './components/TasksModal';
import TaskUpdateDialog from './components/TaskUpdateDialog';

const WorkerProjects = () => {
  const notify = useNotification();
  const { data: projects = [], isLoading, error } = useGetWorkerProjectsQuery();

  const [selectedProjectTasks, setSelectedProjectTasks] = useState(null);
  const { data: tasks = [] } = useGetTasksQuery(
    { projectId: selectedProjectTasks },
    { skip: !selectedProjectTasks }
  );

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskUpdateDialog, setTaskUpdateDialog] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('');
  const [tasksModalOpen, setTasksModalOpen] = useState(false);

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const fetchProjectTasks = (projectId) => {
    if (!projectId) return;
    setSelectedProjectTasks(projectId);
    setTasksModalOpen(true);
  };

  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setNewTaskStatus(task.status);
    setTaskUpdateDialog(true);
  };

  const handleUpdateTaskStatus = async () => {
    try {
      await updateTaskStatus({ id: selectedTask.taskId, status: newTaskStatus }).unwrap();
      setTaskUpdateDialog(false);
      setSelectedTask(null);
      setNewTaskStatus('');
      notify.success('Estado de tarea actualizado');
    } catch (err) {
      notify.error('Error al actualizar el estado de la tarea');
    }
  };

  if (isLoading) {
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
        <Alert severity="error" className="mb-8">Error al cargar los proyectos</Alert>
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
