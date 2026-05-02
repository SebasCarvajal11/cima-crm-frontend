import { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Fade,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  useGetProjectsQuery,
  useGetProjectStatsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '../../../redux/api';
import ProjectList from '../components/ProjectList';
import { CreateProjectDialog, EditProjectDialog } from '../components/ProjectForm';
import ProjectStats from '../components/ProjectStats';
import { useNotification } from '../../../hooks/useNotification';
import logger from '../../../utils/logger';

const ProjectsPage = () => {
  const notify = useNotification();
  const { data: projects = [], isLoading, error } = useGetProjectsQuery();
  const { data: projectStats } = useGetProjectStatsQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const [openForm, setOpenForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesName = !searchTerm || (project.projectName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? project.status === statusFilter : true;
      return matchesName && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData).unwrap();
      setOpenForm(false);
      notify.success('Proyecto creado exitosamente');
    } catch (error) {
      logger.error('Error al crear proyecto:', error);
      notify.error('Error al crear el proyecto', error);
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setOpenEditForm(true);
  };

  const handleUpdateProject = async (formData) => {
    try {
      if (!selectedProject?.id) {
        notify.error('No se ha seleccionado ningún proyecto para actualizar');
        return;
      }

      const projectData = {
        clientId: Number(formData.clientId),
        projectName: formData.projectName,
        description: formData.description || '',
        status: formData.status
      };

      await updateProject({ id: selectedProject.id, ...projectData }).unwrap();
      setOpenEditForm(false);
      notify.success('Proyecto actualizado exitosamente');
    } catch (error) {
      logger.error('Error en la actualización:', error);
      notify.error('Error al actualizar el proyecto', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este proyecto?')) {
      try {
        await deleteProject(id).unwrap();
        notify.success('Proyecto eliminado exitosamente');
      } catch (error) {
        logger.error('Error deleting project:', error);
        notify.error('Error al eliminar el proyecto', error);
      }
    }
  };

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">Error al cargar los proyectos</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Fade in={true}>
        <Box sx={{ py: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" component="h1" sx={{ color: 'var(--color-brand-primary)' }}>
                  Gestión de Proyectos
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenForm(true)}
                  sx={{
                    bgcolor: 'var(--color-brand-primary)',
                    '&:hover': {
                      bgcolor: 'var(--color-brand-primary-light)'
                    }
                  }}
                >
                  Nuevo Proyecto
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <ProjectStats stats={projectStats?.stats || {}} />
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Box className="flex items-center gap-2.5 mb-5 flex-wrap">
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="">Todos</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <Button variant="outlined" onClick={() => { setSearchTerm(''); setStatusFilter(''); }}>
                    Reiniciar
                  </Button>
                </Box>
                <ProjectList
                  projects={filteredProjects}
                  loading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDeleteProject}
                />
              </Paper>
            </Grid>
          </Grid>

          <CreateProjectDialog
            open={openForm}
            onClose={() => {
              setOpenForm(false);
              setSelectedProject(null);
            }}
            onSubmit={handleCreateProject}
          />

          <EditProjectDialog
            open={openEditForm}
            onClose={() => {
              setOpenEditForm(false);
              setSelectedProject(null);
            }}
            onSubmit={handleUpdateProject}
            project={selectedProject}
          />
        </Box>
      </Fade>
    </Container>
  );
};

export default ProjectsPage;
