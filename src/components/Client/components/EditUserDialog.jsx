import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  IconButton, Button, CircularProgress, Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ActionButton = ({ children, disabled, onClick }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    sx={{
      background: 'linear-gradient(45deg, #8e3031 30%, #592d2d 90%)',
      boxShadow: '0 3px 5px 2px rgba(142, 48, 49, .3)',
      borderRadius: '8px',
      padding: '10px 25px',
      color: 'white',
      textTransform: 'none',
      fontWeight: 600,
      '&:hover': {
        background: 'linear-gradient(45deg, #592d2d 30%, #3d1e1e 90%)',
      }
    }}
  >
    {children}
  </Button>
);

export const EditUserDialog = ({ open, user, onClose, onSuccess, token }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Worker'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '', // Don't pre-fill password
        department: user.department || '',
        position: user.position || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Nombre, Email y Rol son obligatorios', { position: 'top-center' });
      return;
    }

    const userId = user.userId || user.id;
    if (!userId) {
      toast.error('El usuario seleccionado no tiene un ID definido', { position: 'top-center' });
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };

      // Only include password if provided
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'accesstoken': token
          }
        }
      );

      toast.success('Usuario actualizado exitosamente', { position: 'top-center' });
      onSuccess(userId, updateData);
      onClose();
    } catch (err) {
      toast.error(`Error: ${err.response?.data?.message || 'Ocurrió un problema'}`, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '& .MuiDialogTitle-root': {
            background: '#8e3031',
            color: 'white',
            padding: '20px 24px'
          }
        }
      }}
    >
      <DialogTitle>
        Editar Usuario
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
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
            fullWidth label="Nueva Contraseña (opcional)" type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            helperText="Deja en blanco para mantener la contraseña actual"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              label="Rol"
            >
              <MenuItem value="Admin">Administrador</MenuItem>
              <MenuItem value="Worker">Trabajador</MenuItem>
            </Select>
          </FormControl>

          {/* Read-only date fields */}
          {formData.createdAt && (
            <TextField
              fullWidth label="Fecha de creación"
              value={new Date(formData.createdAt).toLocaleDateString('es-ES')}
              margin="normal" disabled
            />
          )}
          {formData.updatedAt && (
            <TextField
              fullWidth label="Última actualización"
              value={new Date(formData.updatedAt).toLocaleDateString('es-ES')}
              margin="normal" disabled
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} sx={{ color: '#7e8299' }}>Cancelar</Button>
        <ActionButton onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
};
