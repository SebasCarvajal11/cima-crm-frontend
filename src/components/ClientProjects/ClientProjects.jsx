import { useState } from 'react';
import {
  Container, Grid, Typography, Alert, Box,
} from '@mui/material';
import { Assignment as ProjectIcon } from '@mui/icons-material';
import { LoadingState, PageHeader } from '../ui';
import { AnimatePresence } from 'framer-motion';
import { useGetMyProjectsQuery } from '../../redux/api';
import ProjectCard from './components/ProjectCard';
import ProjectDetailsDialog from './components/ProjectDetailsDialog';

const ClientProjects = () => {
  const { data: projects = [], isLoading, error } = useGetMyProjectsQuery();
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  if (isLoading) {
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
        <Alert severity="error" className="mb-8 rounded-xl shadow-sm">Error al cargar los proyectos</Alert>
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
