import { useEffect, useState, useCallback } from 'react';
import {
  Container, Grid, Typography, Alert, Box,
} from '@mui/material';
import { Assignment as ProjectIcon } from '@mui/icons-material';
import { LoadingState, PageHeader } from '../ui';
import { AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import logger from '../../utils/logger';
import ProjectCard from './components/ProjectCard';
import ProjectDetailsDialog from './components/ProjectDetailsDialog';

const ClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects/my-projects');
      setProjects(response.data.projects || []);
      setError(null);
    } catch (err) {
      logger.error('Error fetching client projects:', err);
      setError('Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return <LoadingState minHeight="24rem" />;
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <PageHeader
        icon={ProjectIcon}
        title="Mis Proyectos"
        subtitle="Gestiona y visualiza el progreso de tus proyectos activos"
      />

      {error && (
        <Alert severity="error" className="mb-8 rounded-xl shadow-sm">{error}</Alert>
      )}

      <Grid container spacing={4}>
        <AnimatePresence>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={project.projectId}>
              <ProjectCard
                project={project}
                index={index}
                onViewDetails={(p) => { setSelectedProject(p); setOpenDialog(true); }}
              />
            </Grid>
          ))}
        </AnimatePresence>

        {projects.length === 0 && !error && (
          <Grid item xs={12}>
            <Box className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <ProjectIcon className="text-7xl text-gray-200 mb-4" />
              <Typography variant="h6" className="text-gray-400 font-medium">
                Aún no tienes proyectos asignados
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <ProjectDetailsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        project={selectedProject}
      />
    </Container>
  );
};

export default ClientProjects;
