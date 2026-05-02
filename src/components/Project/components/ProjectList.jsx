import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TablePagination, TextField, Tooltip, Skeleton,
  TableSortLabel, Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StatusChip from '../StatusChip';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import logger from '../../../utils/logger';

const getStatusLabel = (status) => {
  switch (status) {
    case 'Pending': return 'Pendiente';
    case 'In Progress': return 'En Progreso';
    case 'Completed': return 'Completado';
    default: return status;
  }
};

const ProjectList = ({ projects = [], loading, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [orderBy, setOrderBy] = useState('projectName');
  const [order, setOrder] = useState('asc');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleEdit = (project) => {
    const projectToEdit = { ...project, id: project.id || project.projectId };
    if (!projectToEdit.id) {
      logger.error('Proyecto inválido para editar, sin ID:', project);
      return;
    }
    onEdit(projectToEdit);
  };

  const handleDelete = (project) => {
    const idToDelete = project.id || project.projectId;
    if (!idToDelete) {
      logger.error('No se puede eliminar proyecto sin ID:', project);
      return;
    }
    setProjectToDelete(idToDelete);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      await onDelete(projectToDelete);
    }
    setOpenDialog(false);
    setProjectToDelete(null);
  };

  const filteredProjects = projects && projects.length > 0
    ? projects
        .filter((project) =>
          Object.values(project).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .sort((a, b) => {
          const isAsc = order === 'asc';
          if (!a[orderBy]) return -1;
          if (!b[orderBy]) return 1;
          return isAsc
            ? String(a[orderBy]).localeCompare(String(b[orderBy]))
            : String(b[orderBy]).localeCompare(String(a[orderBy]));
        })
    : [];

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={5}>
                <Skeleton animation="wave" height={50} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(5)].map((__, i) => (
                  <TableCell key={i}><Skeleton animation="wave" /></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar proyectos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
      />

      <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3, borderRadius: 2, '& .MuiTable-root': { minWidth: 650 } }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--color-brand-primary)' }}>
              {['Client ID', 'Nombre del Proyecto', 'Descripción', 'Estado', 'Acciones'].map((header, index) => (
                <TableCell key={header} sx={{ color: 'var(--color-brand-primary-light)', fontWeight: 'bold' }}>
                  {index < 4 ? (
                    <TableSortLabel
                      active={orderBy === header.toLowerCase()}
                      direction={orderBy === header.toLowerCase() ? order : 'asc'}
                      onClick={() => handleRequestSort(header.toLowerCase())}
                      sx={{
                        color: 'var(--color-brand-primary-light) !important',
                        '&.MuiTableSortLabel-root:hover': { color: 'grey.100' },
                        '& .MuiTableSortLabel-icon': { color: 'white !important' },
                      }}
                    >
                      {header}
                    </TableSortLabel>
                  ) : (
                    header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No hay proyectos disponibles</TableCell>
              </TableRow>
            ) : (
              filteredProjects
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((project) => (
                  <TableRow key={project.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                    <TableCell sx={{ color: 'var(--color-brand-primary)' }}>{project.clientId}</TableCell>
                    <TableCell sx={{ color: 'var(--color-brand-primary)' }}>{project.projectName}</TableCell>
                    <TableCell sx={{ color: 'var(--color-brand-primary)' }}>{project.description}</TableCell>
                    <TableCell>
                      <StatusChip label={getStatusLabel(project.status)} status={project.status} />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar proyecto">
                        <Button
                          variant="contained"
                          sx={{ mr: 1, bgcolor: 'var(--color-brand-primary)', '&:hover': { bgcolor: 'var(--color-brand-primary-light)' } }}
                          size="small"
                          onClick={() => handleEdit(project)}
                        >
                          <EditIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Eliminar proyecto">
                        <Button
                          variant="contained"
                          sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
                          size="small"
                          onClick={() => handleDelete(project)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredProjects.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />

      <DeleteConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default ProjectList;
