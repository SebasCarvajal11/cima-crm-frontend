// src/pages/projects/ProjectsPage.js
import React, { useState, useContext, useEffect } from 'react';
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
import { ProjectContext } from '../../../context/ProjectContext';
import ProjectList from '../components/ProjectList';
import { CreateProjectDialog, EditProjectDialog } from '../components/ProjectForm';
import ProjectStats from '../components/ProjectStats';
import { useNotification } from '../../../hooks/useNotification';
import logger from '../../../utils/logger';

const ProjectsPage = () => {
  const projectContext = useContext(ProjectContext);
  const notify = useNotification();
  
  if (!projectContext) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            Error: ProjectContext no está disponible. Asegúrate de que este componente esté dentro de un ProjectContextProvider.
          </Alert>
        </Box>
      </Container>
    );
  }
  
  const {
    projects,
    filteredProjects,
    projectStats,
    loading,
    error,
    createProject,
    deleteProject,
    fetchProjects,
    updateProject
  } = projectContext;

  const [openForm, setOpenForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openEditForm, setOpenEditForm] = useState(false);

  // Asegurarse de cargar los proyectos cuando el componente se monta
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);
      fetchProjects(); // Recargar la lista después de crear
      setOpenForm(false);
    } catch (error) {
      logger.error('Error al crear proyecto:', error);
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

      await updateProject(selectedProject.id, projectData);
      setOpenEditForm(false);
      notify.success('Proyecto actualizado exitosamente');
    } catch (error) {
      logger.error('Error en la actualización:', error);
      notify.error('Error al actualizar el proyecto');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este proyecto?')) {
      try {
        await deleteProject(id);
      } catch (error) {
        logger.error('Error deleting project:', error);
      }
    }
  };

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
              <ProjectStats stats={projectStats} />
            </Grid>

            <Grid item xs={12}>
              <Paper>
                <ProjectList
                  projects={filteredProjects}
                  loading={loading}
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
