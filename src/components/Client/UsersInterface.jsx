import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { CreateUserDialog } from './components/CreateUserDialog';
import { EditUserDialog } from './components/EditUserDialog';
import { DeleteUserDialog } from './components/DeleteUserDialog';
import { UserTableToolbar } from './components/UserTableToolbar';
import { UserTableRow } from './components/UserTableRow';
import { UserPagination } from './components/UserPagination';
import { EnhancedTableContainer, StyledTableHead } from './components/SharedStyles';
import { useGetStaffQuery } from '../../redux/api';
import { usePagination } from '../../hooks/usePagination';

const UsersInterface = () => {
  const { data: staffUsers = [], isLoading, error } = useGetStaffQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { page, setPage, totalPages, paginatedItems: currentUsers, currentCount, totalCount } = usePagination(staffUsers);

  const openEditDialog = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '18.75rem' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography color="error">Error al cargar usuarios del staff</Typography>
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
      <UserTableToolbar onOpenCreate={() => setIsCreateOpen(true)} />

      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell className="hide-mobile">Fecha de creaci&oacute;n</TableCell>
            <TableCell className="hide-mobile">&Uacute;ltima actualizaci&oacute;n</TableCell>
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
        currentCount={currentCount}
        totalCount={totalCount}
        onPageChange={(_, value) => setPage(value)}
      />

      <CreateUserDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => setIsCreateOpen(false)}
      />
      <EditUserDialog
        open={isEditOpen}
        user={selectedUser}
        onClose={() => { setIsEditOpen(false); setSelectedUser(null); }}
        onSuccess={() => { setIsEditOpen(false); setSelectedUser(null); }}
      />
      <DeleteUserDialog
        open={isDeleteOpen}
        user={selectedUser}
        onClose={() => { setIsDeleteOpen(false); setSelectedUser(null); }}
        onSuccess={() => { setIsDeleteOpen(false); setSelectedUser(null); }}
      />
    </EnhancedTableContainer>
  );
};

export default UsersInterface;
