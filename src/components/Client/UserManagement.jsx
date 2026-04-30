import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Close as CloseIcon,
  People as PeopleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import 'react-toastify/dist/ReactToastify.css';
import styled from '@emotion/styled';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion, AnimatePresence } from 'framer-motion';
import { IoGridOutline, IoListOutline } from 'react-icons/io5';
import Slide from '@mui/material/Slide';
import UsersInterface from './UsersInterface';
import { stringToColor, adjustColor, getInitials, getPlanColor } from '../../utils/colorUtils';
import { CreateClientDialog } from './components/CreateClientDialog';
import { EditClientDialog } from './components/EditClientDialog';
import { DeleteClientDialog } from './components/DeleteClientDialog';
// TabPanel component to handle tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Estilos personalizados usando styled-components
const StyledBox = styled(Box)(({ theme }) => ({
  padding: '40px',
  background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f5f9 100%)',
  minHeight: '100vh',
}));

// Update PageHeader styling
const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: '48px',
  textAlign: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '4px',
    background: '#8e3031',
    borderRadius: '2px',
  }
}));

const EnhancedTableContainer = styled(TableContainer)(({ theme }) => ({
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

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    background: '#f3f6f9',
    color: '#592d2d',
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: '16px 24px',
    borderBottom: '1px solid #ebedf3',
    whiteSpace: 'nowrap',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({

  '& .MuiTableCell-root': {
    padding: '16px 24px',
    borderBottom: '1px solid #ebedf3',
    color: '#7e8299',
  },
}));

// Update StatusChip colors to match the maroon/burgundy theme
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

// Update ActionButton colors to match the maroon/burgundy theme
const ActionButton = styled(Button)(({ variant }) => ({
  background: variant === 'create' 
    ? 'linear-gradient(45deg, #8e3031 30%, #592d2d 90%)'
    : 'linear-gradient(45deg, #e74c3c 30%, #c0392b 90%)',
  boxShadow: variant === 'create'
    ? '0 3px 5px 2px rgba(142, 48, 49, .3)'
    : '0 3px 5px 2px rgba(231, 76, 60, .3)',
  borderRadius: '8px',
  padding: '10px 25px',
  color: 'white',
  textTransform: 'none',
  fontWeight: 600,

}));

const UserManagement = () => {
  // Add tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Fix the handleTabChange function definition
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Extraer el token desde Redux (asegúrate de que el path sea el correcto)
  const token = useSelector((state) => state.auth.accessToken);
  // Extrae el token y el userId desde Redux
  const userId = useSelector((state) =>  state.auth.user.userId);

  // Estado de usuarios (se obtendrán de la API)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los diálogos variantes
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Paginación
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/clients`, {
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': token
        }
      });
      setUsers(response.data.clients || []);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setError('Error al cargar clientes');
      toast.error('Error al cargar clientes', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Función para abrir el diálogo según la acción
  const openCreateDialog = () => setIsCreateOpen(true);
  
  const openEditDialog = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };
  
  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleDeleteSuccess = (deletedId) => {
    setUsers(users.filter(user => user.clientId !== deletedId));
  };
  
  // Manejo inmediato del cambio de rol en la tabla
  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
    toast.success('Rol actualizado', { position: 'top-center' });
  };

  const currentUsers = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <StyledBox>
      <ToastContainer />
      
      <PageHeader>
        <Typography variant="h4" sx={{
          fontWeight: 700,
          color: '#181c32',
          mb: 1,
        }}>
          Gestión de Usuarios
        </Typography>
        <Typography variant="body1" sx={{ color: '#7e8299' }}>
          Administra y gestiona todos los usuarios del sistema
        </Typography>
      </PageHeader>

      {/* Tabs */}
      <Box sx={{ 
        width: '100%', 
        bgcolor: 'background.paper',
        borderRadius: '10px',
        boxShadow: '0 0 20px 0 rgba(82, 63, 105, 0.1)',
        mb: 3
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#8e3031',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              color: '#7e8299',
              '&.Mui-selected': {
                color: '#8e3031',
                fontWeight: 600,
              },
  

   
            },
          }}
        >
          <Tab 
            icon={<PersonIcon />} 
            iconPosition="start" 
            label="Clientes" 
          />
          <Tab 
            icon={<PeopleIcon />} 
            iconPosition="start" 
            label="Usuarios" 
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* Clients Tab Content - Your existing client management UI */}
        <EnhancedTableContainer>
          <TableToolbar>
            <SearchBar>
              <SearchIcon />
              <TextField
                placeholder="Buscar cliente..."
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
                  background: 'linear-gradient(135deg, #8e3031 0%, #592d2d 100%)',
                  color: 'white',
        
                }}
              >
                Nuevo Cliente
              </Button>
            </Box>
          </TableToolbar>

          {/* Rest of your client table code... */}
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {currentUsers.map((user, index) => {
                const userKey = user.id || user.userId || user.user_id || user._id || `user-${index}`;
                
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
                      <Box sx={{ 
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: '4px',
                        bgcolor: getPlanColor(user.plan),
                        color: 'white',
                        fontWeight: 'medium'
                      }}>
                        {user.plan || 'Oro'}
                      </Box>
                    </TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.phone || user.contactInfo}</TableCell>
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
              Mostrando {currentUsers.length} de {users.length} usuarios
            </Typography>
            <Pagination
              count={Math.ceil(users.length / rowsPerPage)}
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
                    borderColor: '#8e3031',
                    color: '#8e3031',
                  },
                },
              }}
            />
          </Box>
        </EnhancedTableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Users Tab Content - Import from UsersInterface component */}
        <UsersInterface token={token} />
      </TabPanel>

      {/* Explicit Variant Dialogs */}
      <CreateClientDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchUsers}
        token={token}
      />
      
      <EditClientDialog
        open={isEditOpen}
        user={selectedUser}
        onClose={() => setIsEditOpen(false)}
        onSuccess={fetchUsers}
        token={token}
      />
      
      <DeleteClientDialog
        open={isDeleteOpen}
        user={selectedUser}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
        token={token}
      />
    </StyledBox>
  );
};

  

export default UserManagement;
