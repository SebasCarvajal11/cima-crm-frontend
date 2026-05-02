import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import { CreateUserDialog } from './components/CreateUserDialog';
import { EditUserDialog } from './components/EditUserDialog';
import { DeleteUserDialog } from './components/DeleteUserDialog';
import { UserTableToolbar } from './components/UserTableToolbar';
import { UserTableRow } from './components/UserTableRow';
import { UserPagination } from './components/UserPagination';
import { EnhancedTableContainer, StyledTableHead } from './components/SharedStyles';
import logger from '../../utils/logger';

const UsersInterface = ({ token }) => {
  const [staffUsers, setStaffUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

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

        logger.debug('Datos de staff recibidos:', response.data);
        setStaffUsers(response.data.users || []);
        setLoading(false);
      } catch (err) {
        logger.error('Error al cargar usuarios del staff:', err);
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

  const openCreateDialog = () => setIsCreateOpen(true);

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

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
  const totalPages = Math.ceil(staffUsers.length / rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '18.75rem' }}>
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
      <UserTableToolbar onOpenCreate={openCreateDialog} />

      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Fecha de creaci&oacute;n</TableCell>
            <TableCell>&Uacute;ltima actualizaci&oacute;n</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {currentUsers.map((user) => (
            <UserTableRow
              key={user.userId || user.id || user.email}
              user={user}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          ))}
        </TableBody>
      </Table>

      <UserPagination
        currentPage={page}
        totalPages={totalPages}
        currentCount={currentUsers.length}
        totalCount={staffUsers.length}
        onPageChange={handlePageChange}
      />

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
