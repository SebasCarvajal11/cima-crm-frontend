import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Typography, 
  Avatar, 
  Button, 
  IconButton,
  TextField,
  Pagination,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import { alpha } from '@mui/material/styles';
import { stringToColor, adjustColor, getInitials } from '../../utils/colorUtils';
import { CreateUserDialog } from './components/CreateUserDialog';
import { EditUserDialog } from './components/EditUserDialog';
import { DeleteUserDialog } from './components/DeleteUserDialog';
// Reuse styled components from UserManagement
const EnhancedTableContainer = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 0 50px 0 rgba(82, 63, 105, 0.15)',
  overflow: 'hidden',
  border: '1px solid #ebedf3',
}));

const TableToolbar = styled(Box)(({ theme }) => ({
  padding: '20px 24px',
  background: '#ffffff',
  borderBottom: '1px solid #ebedf3',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
}));

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  flex: '1',
  maxWidth: '400px',
  '& .MuiInputBase-root': {
    width: '100%',
    background: alpha('#f3f6f9', 0.7),
    borderRadius: '10px',
    '&:hover': {
      background: '#f3f6f9',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 12px 12px 45px',
  },
  '& .MuiSvgIcon-root': {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#b5b5c3',
  },
}));

// Update the StyledTableHead component to use your color scheme
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    background: '#8e3031',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: '16px 24px',
    borderBottom: '1px solid #ebedf3',
    whiteSpace: 'nowrap',
  },
}));

// Add the StyledTableRow component
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha('#f3f6f9', 0.7),
  },
  '& .MuiTableCell-root': {
    padding: '16px 24px',
    borderBottom: '1px solid #ebedf3',
    color: '#464E5F',
  },
}));

// Update the StatusChip component colors
const StatusChip = styled(Box)(({ status }) => ({
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.85rem',
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  ...(status === 'Admin' && {
    background: alpha('#8e3031', 0.1),
    color: '#8e3031',
  }),
  ...(status === 'Worker' && {
    background: alpha('#592d2d', 0.1),
    color: '#592d2d',
  }),
  ...(status === 'Client' && {
    background: alpha('#f1416c', 0.1),
    color: '#f1416c',
  }),
}));


const UsersInterface = ({ token }) => {
  // Estado para los usuarios del staff (Worker y Admin)
  const [staffUsers, setStaffUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de control para las variantes de diálogos
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Paginación
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  
  // Obtener todos los usuarios del staff cuando se monte el componente
  useEffect(() => {
    const fetchStaffUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/staff`, {
          headers: {
            'Content-Type': 'application/json',
            'accesstoken': token
          }
        });
        
        console.log('Datos de staff recibidos:', response.data);
        setStaffUsers(response.data.users || []);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar usuarios del staff:', err);
        setError('Error al cargar usuarios del staff');
        toast.error('Error al cargar usuarios del staff', { position: 'top-center' });
        setLoading(false);
      }
    };

    if (token) {
      fetchStaffUsers();
    }
  }, [token]);
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  // Openers explícitos para cada variante de diálogo
  const openCreateDialog = () => setIsCreateOpen(true);
  
  const openEditDialog = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // Callbacks de éxito para actualizar estado local
  const handleCreateSuccess = (newUser) => {
    const userWithId = {
      ...newUser,
      userId: newUser.userId || newUser.id || Date.now().toString()
    };
    setStaffUsers(prevUsers => [...prevUsers, userWithId]);
  };

  const handleEditSuccess = (userId, updateData) => {
    const updatedUsers = staffUsers.map(user => {
      if ((user.userId || user.id) === userId) {
        return { ...user, ...updateData };
      }
      return user;
    });
    setStaffUsers(updatedUsers);
  };

  const handleDeleteSuccess = (userId) => {
    const updatedUsers = staffUsers.filter(user => (user.userId || user.id) !== userId);
    setStaffUsers(updatedUsers);
  };
  
  const currentUsers = staffUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <EnhancedTableContainer>
      <TableToolbar>
        <SearchBar>
          <SearchIcon />
          <TextField
            placeholder="Buscar usuario..."
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
          />
        </SearchBar>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
          >
            Filtrar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            sx={{
              background: 'linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(207, 215, 224) 100%)',
              },
            }}
          >
            Nuevo Usuario
          </Button>
        </Box>
      </TableToolbar>

      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Fecha de creación</TableCell>
            <TableCell>Última actualización</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {currentUsers.map((user, index) => {
            const userKey = user.userId || user.id || `staff-${index}`;
            
            return (
              <StyledTableRow key={userKey}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ 
                      background: user.name 
                        ? `linear-gradient(135deg, ${stringToColor(user.name)} 0%, ${adjustColor(stringToColor(user.name), -20)} 100%)`
                        : 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                      }}>
                        {getInitials(user.name)}
                      </Avatar>
                      <Typography sx={{ color: '#3f4254', fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <StatusChip status={user.role}>
                      {user.role}
                    </StatusChip>
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : '-'}
                  </TableCell>
                  <TableCell>
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => openEditDialog(user)}
                      sx={{ color: '#592d2d' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteDialog(user)}
                      sx={{ color: '#f1416c' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
  
        <Box sx={{ 
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #ebedf3',
        }}>
          <Typography sx={{ color: '#7e8299' }}>
            Mostrando {currentUsers.length} de {staffUsers.length} usuarios
          </Typography>
          <Pagination
            count={Math.ceil(staffUsers.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                borderColor: '#e9ecef',
                color: '#7e8299',
                '&.Mui-selected': {
                  background: '#f3f6f9',
                  borderColor: '#3699ff',
                  color: '#3699ff',
                },
              },
            }}
          />
        </Box>
  
        {/* Variantes explícitas de diálogos */}
        <CreateUserDialog
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={handleCreateSuccess}
          token={token}
        />
        <EditUserDialog
          open={isEditOpen}
          user={selectedUser}
          onClose={() => { setIsEditOpen(false); setSelectedUser(null); }}
          onSuccess={handleEditSuccess}
          token={token}
        />
        <DeleteUserDialog
          open={isDeleteOpen}
          user={selectedUser}
          onClose={() => { setIsDeleteOpen(false); setSelectedUser(null); }}
          onSuccess={handleDeleteSuccess}
          token={token}
        />
      </EnhancedTableContainer>
    );
  };
  
  export default UsersInterface;