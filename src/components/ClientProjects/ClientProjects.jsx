import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  Box,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import {
  Assignment as ProjectIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Contacts as ContactsIcon,
  Person as PersonIcon,
  Update as UpdateIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import logger from '../../utils/logger';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'success';
    case 'in progress': return 'info';
    case 'pending': return 'warning';
    default: return 'default';
  }
};

const ClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);

  const fetchProjects = useCallback(async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/projects/my-projects`,
        {
          headers: { 'accesstoken': accessToken }
        }
      );
      setProjects(response.data.projects || []);
      setError(null);
    } catch (err) {
      logger.error('Error fetching client projects:', err);
      setError('Error al cargar los proyectos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="mt-12 flex justify-center">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-8">
        <Typography variant="h4" className="font-bold mb-2 flex items-center gap-3">
          <ProjectIcon fontSize="large" className="text-brand-primary" />
          <span className="bg-gradient-to-r from-brand-primary to-brand-primary-light bg-clip-text text-transparent">
            Mis Proyectos
          </span>
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600 font-medium">
          Gestiona y visualiza el progreso de tus proyectos activos
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-8 rounded-xl shadow-sm">
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <AnimatePresence>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={project.projectId}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className="h-full rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group"
                >
                  <Box 
                    className={`h-2 transition-colors duration-300 ${
                      project.status === 'Completed' ? 'bg-green-500' : 
                      project.status === 'In Progress' ? 'bg-brand-primary' : 'bg-yellow-500'
                    }`}
                  />
                  
                  <CardContent className="flex-grow p-6">
                    <Box className="flex justify-between items-start mb-4">
                      <Typography variant="h6" className="font-bold text-gray-800 group-hover:text-brand-primary transition-colors">
                        {project.projectName}
                      </Typography>
                    </Box>

                    <Chip 
                      label={project.status} 
                      size="small" 
                      color={getStatusColor(project.status)}
                      className="mb-4 font-semibold rounded-md"
                    />
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      className="mb-6 line-clamp-3 min-h-[3rem]"
                    >
                      {project.description || 'Sin descripción disponible'}
                    </Typography>
                    
                    <Box className="mt-auto">
                      <Box className="flex justify-between items-end mb-2">
                        <Typography variant="caption" className="text-gray-500 font-medium">Progreso</Typography>
                        <Typography variant="caption" className="text-brand-primary font-bold">{project.progress || 0}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={project.progress || 0}
                        className="h-2 rounded-full bg-gray-100"
                        sx={{
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            bgcolor: 'var(--color-brand-primary)'
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                  
                  <CardActions className="p-6 pt-0">
                    <Button 
                      fullWidth
                      variant="outlined"
                      onClick={() => handleViewDetails(project)}
                      className="rounded-xl border-gray-200 text-gray-700 hover:border-brand-primary hover:text-brand-primary normal-case font-semibold"
                    >
                      Ver Detalles
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
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

      {/* Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ className: "rounded-3xl shadow-2xl overflow-hidden" }}
      >
        {selectedProject && (
          <>
            <DialogTitle className="p-0">
              <Box className="bg-gradient-to-r from-brand-primary to-brand-primary-light p-8 text-white relative">
                <Box className="flex items-center gap-4">
                  <Box className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                    <ProjectIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h5" className="font-bold leading-tight">
                      {selectedProject.projectName}
                    </Typography>
                    <Typography variant="body2" className="opacity-80">
                      ID: {selectedProject.projectId}
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  onClick={() => setOpenDialog(false)} 
                  className="absolute top-6 right-6 text-white hover:bg-white/20"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent className="p-8">
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Box className="p-6 bg-gray-50 rounded-2xl">
                    <Typography variant="subtitle1" className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <DescriptionIcon className="text-brand-primary" /> 
                      Descripción del Proyecto
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 leading-relaxed">
                      {selectedProject.description || 'Sin descripción disponible'}
                    </Typography> 
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" className="font-bold text-gray-800 mb-4">
                    Estado y Progreso Actual
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box className="p-4 border border-gray-100 rounded-2xl">
                        <Typography variant="caption" className="text-gray-400 uppercase font-bold block mb-2">Estado</Typography>
                        <Chip
                          label={selectedProject.status}
                          color={getStatusColor(selectedProject.status)}
                          className="font-bold px-4"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box className="p-4 border border-gray-100 rounded-2xl h-full flex flex-col justify-center">
                        <Box className="flex justify-between mb-2">
                          <Typography variant="caption" className="text-gray-400 uppercase font-bold">Progreso General</Typography>
                          <Typography variant="body2" className="font-bold text-brand-primary">{selectedProject.progress || 0}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedProject.progress || 0}
                          className="h-2 rounded-full bg-gray-100"
                          sx={{ '& .MuiLinearProgress-bar': { bgcolor: 'var(--color-brand-primary)' } }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {selectedProject.taskStats && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" className="font-bold text-gray-800 mb-4">
                      Estadísticas de Tareas
                    </Typography>
                    <Grid container spacing={2}>
                      {[
                        { label: 'Total', count: selectedProject.taskStats.total, color: 'bg-gray-100 text-gray-600' },
                        { label: 'Completadas', count: selectedProject.taskStats.completed, color: 'bg-green-50 text-green-600' },
                        { label: 'En Progreso', count: selectedProject.taskStats.inProgress, color: 'bg-blue-50 text-blue-600' },
                        { label: 'Pendientes', count: selectedProject.taskStats.pending, color: 'bg-yellow-50 text-yellow-600' }
                      ].map((stat) => (
                        <Grid item xs={6} sm={3} key={stat.label}>
                          <Box className={`p-4 text-center rounded-2xl ${stat.color}`}>
                            <Typography variant="h4" className="font-bold mb-1">{stat.count}</Typography>
                            <Typography variant="caption" className="font-bold uppercase opacity-80">{stat.label}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <Box className="p-6 border border-gray-100 rounded-2xl h-full">
                    <Typography variant="subtitle1" className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ContactsIcon className="text-brand-primary" /> Información de Contacto
                    </Typography>
                    <List dense className="p-0">
                      <ListItem className="px-0">
                        <ListItemIcon className="min-w-[40px]"><PersonIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Responsable" secondary={selectedProject.client?.name || '-'} />
                      </ListItem>
                      <ListItem className="px-0">
                        <ListItemIcon className="min-w-[40px]"><EmailIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Email" secondary={selectedProject.client?.email || '-'} />
                      </ListItem>
                      <ListItem className="px-0">
                        <ListItemIcon className="min-w-[40px]"><PhoneIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Teléfono" secondary={selectedProject.client?.contactInfo || '-'} />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box className="p-6 border border-gray-100 rounded-2xl h-full">
                    <Typography variant="subtitle1" className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ScheduleIcon className="text-brand-primary" /> Fechas del Proyecto
                    </Typography>
                    <List dense className="p-0">
                      <ListItem className="px-0">
                        <ListItemIcon className="min-w-[40px]"><CalendarIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Fecha de Creación" 
                          secondary={new Date(selectedProject.createdAt).toLocaleDateString('es-ES', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })} 
                        />
                      </ListItem>
                      <ListItem className="px-0">
                        <ListItemIcon className="min-w-[40px]"><UpdateIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Última Actualización" 
                          secondary={new Date(selectedProject.updatedAt).toLocaleDateString('es-ES', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })} 
                        />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <Divider />
            <DialogActions className="p-6 bg-gray-50">
              <Button 
                onClick={() => setOpenDialog(false)}
                variant="contained"
                className="bg-black hover:bg-gray-800 px-8 py-2.5 rounded-xl normal-case font-bold shadow-lg"
              >
                Cerrar Detalles
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ClientProjects;