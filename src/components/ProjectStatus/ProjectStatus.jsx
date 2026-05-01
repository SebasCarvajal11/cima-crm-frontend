import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  CircularProgress, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProjectStatus = ({ userRole }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
          headers: {
            'accesstoken': localStorage.getItem('accessToken')
          }
        });
        
        if (response.data.success) {
          setProjects(response.data.projects);
        }
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los proyectos');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleViewDetails = async (projectId) => {
    try {
      console.log('Project ID:', projectId); // Verificar el ID
      console.log('Access Token:', localStorage.getItem('accessToken')); // Verificar el token

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${projectId}/progress`, {
        headers: {
          'accesstoken': localStorage.getItem('accessToken')
        }
      });
      
      if (response.data.success) {
        console.log('API Response:', response.data); // Ver la respuesta completa
        setProjectDetails(response.data);
        setOpenDialog(true);
      }
    } catch (err) {
      console.error('Error al cargar detalles del proyecto:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const filteredProjects = useMemo(() => {
    return projects.filter(project =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  return (
    <Box className="w-full bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.05)] text-brand-primary font-sans" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color:"#8e3031" }}>
        Estado de Proyectos
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar proyecto por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(89, 45, 45, 0.04)'
              },
              '&.Mui-focused': {
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(89, 45, 45, 0.1)'
              }
            }
          }}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Nombre del Proyecto</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Fecha de Creación</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Última Actualización</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#333' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.projectId} hover sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                <TableCell>{project.projectName}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{project.client.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {project.client.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <Chip 
                    label={project.status}
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(project.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(project.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="Ver detalles">
                    <IconButton
                      onClick={() => {
                        console.log('Clicked project:', project);
                        handleViewDetails(project.projectId)}
                      }
                      sx={{ 
                        color: '#000000',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.08)',
                          color: '#000000'
                        }
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        {projectDetails && (
          <>
            <DialogTitle sx={{ 
              borderBottom: '1px solid #e0e0e0',
              px: 3,
              py: 2,
              backgroundColor: '#f8f9fa'
            }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                {projectDetails.projectName}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                Progreso del Proyecto
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    width: 250, 
                    margin: '0 auto',
                    p: 3,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
                  }}>
                    <CircularProgressbar
                      value={projectDetails.progress}
                      text={`${projectDetails.progress}%`}
                      styles={buildStyles({
                        textColor: '#592d2d',
                        pathColor: '#592d2d',
                        trailColor: 'rgba(89, 45, 45, 0.1)',
                        textSize: '16px',
                        strokeLinecap: 'round'
                      })}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', mb: 2 }}>
                      Estadísticas de Tareas
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Total de Tareas</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 500 }}>
                            {projectDetails.taskStats.total}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">Completadas</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 500, color: '#2e7d32' }}>
                            {projectDetails.taskStats.completed}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">En Progreso</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 500, color: '#1976d2' }}>
                            {projectDetails.taskStats.inProgress}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Pendientes</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 500, color: '#ed6c02' }}>
                            {projectDetails.taskStats.pending}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', mb: 2 }}>
                      Estado de las Tareas
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {projectDetails.tasks.map((task, index) => (
                        <Chip
                          key={index}
                          label={task.status}
                          color={getStatusColor(task.status)}
                          size="medium"
                          sx={{ 
                            m: 0.5,
                            px: 2,
                            borderRadius: 2,
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e0e0e0' }}>
              <Button 
                onClick={() => setOpenDialog(false)}
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  backgroundColor: '#000000',
                  '&:hover': {
                    backgroundColor: '#333333'
                  }
                }}
              >
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProjectStatus;