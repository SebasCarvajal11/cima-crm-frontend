import { useState, useMemo } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Typography, Box,
  IconButton, Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { LoadingState, PageHeader, SearchInput } from '../ui';
import { useGetProjectsQuery } from '../../redux/api';
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
  const { data: projects = [], isLoading, error } = useGetProjectsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      (project.projectName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleViewDetails = async (projectId) => {
    try {
      const project = projects.find((p) => p.projectId === projectId || p.id === projectId);
      setProjectDetails({ project });
      setOpenDialog(true);
    } catch (err) {
      logger.error('Error al cargar detalles del proyecto:', err);
    }
  };

  if (isLoading) {
    return <LoadingState minHeight="25rem" />;
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error al cargar los proyectos</Typography>
      </Box>
    );
  }

  return (
    <Box className="w-full bg-white rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.05)] text-brand-primary font-sans" sx={{ p: 3 }}>
      <PageHeader
        title="Estado de Proyectos"
        subtitle="Visualiza y gestiona el estado de todos los proyectos"
      />

      <Box sx={{ mb: 3 }}>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar proyecto por nombre..."
          onClear={() => setSearchTerm('')}
          size="small"
          sx={{ width: '100%' }}
        />
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ overflowX: 'auto', '& .MuiTable-root': { minWidth: '35rem' } }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              {['Nombre del Proyecto', 'Cliente', 'Descripción', 'Estado', 'Fecha de Creación', 'Última Actualización', 'Acciones'].map((header, i) => (
                <TableCell key={header} sx={{ fontWeight: 600, color: 'text.primary' }} className={[2, 4, 5].includes(i) ? 'hide-mobile' : undefined}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.projectId || project.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
                <TableCell>{project.projectName || project.name}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{project.client?.name || project.clientName || 'N/A'}</Typography>
                    <Typography variant="caption" color="textSecondary">{project.client?.email || ''}</Typography>
                  </Box>
                </TableCell>
                <TableCell className="hide-mobile">{project.description}</TableCell>
                <TableCell>
                  <Chip label={project.status} color={getStatusColor(project.status)} size="small" />
                </TableCell>
                <TableCell className="hide-mobile">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '-'}</TableCell>
                <TableCell className="hide-mobile">{project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <Tooltip title="Ver detalles">
                    <IconButton
                      onClick={() => handleViewDetails(project.projectId || project.id)}
                      sx={{ color: 'grey.900', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)', color: 'grey.900' } }}
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
