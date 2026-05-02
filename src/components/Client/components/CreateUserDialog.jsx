import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  IconButton, Button, CircularProgress, Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useCreateUserMutation } from '../../../redux/api';
import { ROLES } from '../../../constants';

const ActionButton = ({ children, disabled, onClick }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    sx={{
      background: 'linear-gradient(45deg, var(--color-brand-primary) 30%, var(--color-brand-primary) 90%)',
      boxShadow: '0 3px 5px 2px rgba(142, 48, 49, .3)',
      borderRadius: '0.5rem',
      padding: '0.625rem 1.5625rem',
      color: 'white',
      textTransform: 'none',
      fontWeight: 600,
      '&:hover': {
        background: 'linear-gradient(45deg, var(--color-brand-primary) 30%, var(--color-brand-primary) 90%)',
      }
    }}
  >
    {children}
  </Button>
);

export const CreateUserDialog = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: ROLES.WORKER
  });
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleEnter = () => {
    setFormData({ name: '', email: '', password: '', role: ROLES.WORKER });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Nombre, Email y Rol son obligatorios', { position: 'top-center' });
      return;
    }
    if (!formData.password) {
      toast.error('La contraseña es obligatoria para crear un usuario', { position: 'top-center' });
      return;
    }

    try {
      const response = await createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }).unwrap();

      const newUser = response.user || response;
      toast.success('Usuario creado exitosamente', { position: 'top-center' });
      onSuccess(newUser);
      onClose();
    } catch (err) {
      toast.error(`Error: ${err.userMessage || err.message || 'Ocurrió un problema'}`, { position: 'top-center' });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{ onEnter: handleEnter }}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '& .MuiDialogTitle-root': {
            background: 'var(--color-brand-primary)',
            color: 'white',
            padding: '1.25rem 1.5rem'
          }
        }
      }}
    >
      <DialogTitle>
        Crear Nuevo Usuario
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '1.5rem' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth label="Nombre" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal" required
          />
          <TextField
            fullWidth label="Email" type="email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal" required
          />
          <TextField
            fullWidth label="Contraseña" type="password" value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal" required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              label="Rol"
            >
              <MenuItem value={ROLES.ADMIN}>Administrador</MenuItem>
              <MenuItem value={ROLES.WORKER}>Trabajador</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '1rem 1.5rem' }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancelar</Button>
        <ActionButton onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Crear Usuario'}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};
