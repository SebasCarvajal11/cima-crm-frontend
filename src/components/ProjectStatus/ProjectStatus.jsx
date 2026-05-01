import { useState, useEffect, useMemo } from 'react';
import {
  CircularProgress, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Typography, Box, TextField, InputAdornment,
  IconButton, Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../services/api';
import logger from '../../utils/logger';
import ProjectProgressDialog from './components/ProjectProgressDialog';

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'In Progress': return 'primary';
    case 'Pending': return 'warning';
    default: return 'default';
  }
};

const ProjectStatus = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
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

  const handleViewDetails = async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/progress`);
      if (response.data.success) {
        setProjectDetails(response.data);
        setOpenDialog(true);
      }
    } catch (err) {
      logger.error('Error al cargar detalles del proyecto:', err);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

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

  return (
    <Box className="w-full bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.05)] text-brand-primary font-sans" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#8e3031' }}>
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
            backgroundColor: 'white',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              transition: 'all 0.3s ease',
              '&:hover': { backgroundColor: 'rgba(89, 45, 45, 0.04)' },
              '&.Mui-focused': { backgroundColor: 'white', boxShadow: '0 2px 8px rgba(89, 45, 45, 0.1)' },
            },
          }}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {['Nombre del Proyecto', 'Cliente', 'Descripción', 'Estado', 'Fecha de Creación', 'Última Actualización', 'Acciones'].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 600, color: '#333' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.projectId} hover sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                <TableCell>{project.projectName}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{project.client.name}</Typography>
                    <Typography variant="caption" color="textSecondary">{project.client.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <Chip label={project.status} color={getStatusColor(project.status)} size="small" />
                </TableCell>
                <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(project.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Tooltip title="Ver detalles">
                    <IconButton
                      onClick={() => handleViewDetails(project.projectId)}
                      sx={{ color: '#000', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)', color: '#000' } }}
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

      <ProjectProgressDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        details={projectDetails}
      />
    </Box>
  );
};

export default ProjectStatus;
