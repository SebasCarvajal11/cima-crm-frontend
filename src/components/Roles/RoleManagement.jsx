import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchUsers, updateRole } from '../../redux/slices/roleSlice';
import { 
  CircularProgress, 
  Alert, 
  Pagination, 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableRow, 
  Avatar, 
  Select, 
  MenuItem, 
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { 
  Security as SecurityIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { stringToColor, getInitials } from '../../utils/colorUtils';
import { EnhancedTableContainer, TableToolbar, StyledTableHead, StyledTableRow } from '../Client/components/SharedStyles';
import logger from '../../utils/logger';

const RoleManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.roles);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Estado para el diálogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    userId: null,
    userName: '',
    newRole: ''
  });

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUsers(accessToken));
    }
  }, [dispatch, accessToken]);

  const handleRoleChangeClick = (user, newRole) => {
    if (user.role === newRole) return;
    
    setConfirmDialog({
      open: true,
      userId: user.userId || user.id,
      userName: user.name || user.userName || `Usuario #${user.userId || user.id}`,
      newRole
    });
  };

  const handleConfirmRoleChange = async () => {
    const { userId, newRole, userName } = confirmDialog;
    setConfirmDialog(prev => ({ ...prev, open: false }));

    try {
      await dispatch(updateRole({ userId, role: newRole, token: accessToken })).unwrap();
      toast.success(`Rol actualizado a ${newRole} para ${userName}`);
    } catch (err) {
      logger.error('Error al actualizar rol:', err);
      toast.error(`Error: ${err}`);
    }
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <Box className="p-4 md:p-8 max-w-6xl mx-auto">
      <Box className="mb-8">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2 flex items-center gap-3">
          <SecurityIcon fontSize="large" className="text-brand-primary" />
          Gestión de Roles y Permisos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Asigna roles a los usuarios para controlar su nivel de acceso al sistema.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-6 rounded-xl">
          {error}
        </Alert>
      )}

      <EnhancedTableContainer>
        <TableToolbar>
          <Typography variant="h6" className="font-bold text-gray-700">
            Usuarios del Sistema ({users.length})
          </Typography>
        </TableToolbar>

        {loading ? (
          <Box className="flex justify-center p-12">
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol Actual</TableCell>
                <TableCell align="right">Cambiar Rol</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {currentUsers.map((user) => {
                const userId = user.userId || user.id;
                const name = user.name || user.userName || 'Usuario';
                
                return (
                  <StyledTableRow key={userId}>
                    <TableCell>
                      <Box className="flex items-center gap-3">
                        <Avatar sx={{ bgcolor: stringToColor(name), width: 32, height: 32, fontSize: '0.875rem' }}>
                          {getInitials(name)}
                        </Avatar>
                        <Typography className="font-medium text-gray-700">
                          {name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <Box className="flex items-center gap-1">
                        <ShieldIcon sx={{ fontSize: 16, color: user.role === 'Admin' ? '#8e3031' : '#666' }} />
                        <Typography variant="body2" className={user.role === 'Admin' ? 'text-brand-primary font-bold' : ''}>
                          {user.role}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={user.role}
                          onChange={(e) => handleRoleChangeClick(user, e.target.value)}
                          sx={{ 
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            '& .MuiSelect-select': { py: 1 }
                          }}
                        >
                          <MenuItem value="Admin">Admin</MenuItem>
                          <MenuItem value="Worker">Worker</MenuItem>
                          <MenuItem value="Client">Client</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </StyledTableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" className="p-8 text-gray-500 italic">
                    No se encontraron usuarios registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {totalPages > 1 && (
          <Box className="flex justify-center p-6 border-t border-gray-100">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </EnhancedTableContainer>

      {/* Diálogo de Confirmación */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        PaperProps={{ className: "rounded-2xl" }}
      >
        <DialogTitle className="font-bold text-gray-800">
          ¿Confirmar cambio de rol?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de cambiar el rol de <strong>{confirmDialog.userName}</strong> a <strong>{confirmDialog.newRole}</strong>. 
            Este cambio afectará sus permisos de acceso inmediatamente.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4">
          <Button 
            onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
            className="text-gray-600"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmRoleChange}
            variant="contained"
            className="bg-brand-primary hover:bg-brand-primary-light rounded-lg px-6"
          >
            Confirmar Cambio
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;
