import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Typography,
  Avatar,
  Fade,
  IconButton,
  Box,
  Divider,
  Alert,
  FormHelperText
} from '@mui/material';
import {
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useProjectFormContext } from './context';
import StatusChip from '../../StatusChip';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    overflowX: 'hidden'
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: '#000000',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiFormControl-root': {
    marginBottom: theme.spacing(2),
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: '#8e3031',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#592d2d',
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#592d2d',
  }
}));

export function FormDialog({ open, onClose, children }) {
  return (
    <StyledDialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      {children}
    </StyledDialog>
  );
}

export function Header({ title, onClose }) {
  return (
    <StyledDialogTitle>
      <Box display="flex" alignItems="center">
        <AssignmentIcon sx={{ mr: 1, color: '#ffffff' }} />
        <Typography variant="h6">
          {title}
        </Typography>
      </Box>
      <IconButton 
        onClick={onClose}
        size="small"
        sx={{ color: '#ffffff' }}
      >
        <CloseIcon />
      </IconButton>
    </StyledDialogTitle>
  );
}

export function Content({ children }) {
  const { state: { loading, error } } = useProjectFormContext();

  return (
    <DialogContent sx={{ pt: 3, overflowX: 'hidden' }}>
      {loading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box my={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      )}
    </DialogContent>
  );
}

export function ClientSection() {
  const { state: { formData, clients, loading, error }, actions: { handleChange } } = useProjectFormContext();

  return (
    <FormSection>
      <Box display="flex" alignItems="center" mb={2}>
        <BusinessIcon sx={{ mr: 1, color: '#592d2d' }} />
        <Typography variant="subtitle1" sx={{ color: '#592d2d' }}>
          Información del Cliente
        </Typography>
      </Box>
      <FormControl fullWidth error={!!error}>
        <InputLabel>Seleccionar Cliente</InputLabel>
        <Select
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          label="Seleccionar Cliente"
          required
          disabled={loading}
        >
          {clients && clients.length > 0 ? (
            clients.map(client => (
              <MenuItem key={client.id} value={client.id}>
                <Box display="flex" alignItems="center" width="100%">
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      mr: 1.5,
                      bgcolor: client.id % 2 === 0 ? '#8e3031' : '#592d2d'
                    }}
                  >
                    {client.name ? client.name.charAt(0).toUpperCase() : `C${client.id}`}
                  </Avatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Typography variant="body1" fontWeight="600" sx={{ color: '#592d2d' }}>
                      {client.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {client.email}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled value="">
              No hay clientes disponibles
            </MenuItem>
          )}
        </Select>
        {error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    </FormSection>
  );
}

export function DetailsSection() {
  const { state: { formData }, actions: { handleChange } } = useProjectFormContext();

  return (
    <>
      <Divider sx={{ my: 3 }} />
      <FormSection>
        <Box display="flex" alignItems="center" mb={2}>
          <DescriptionIcon sx={{ mr: 1, color: '#592d2d' }} />
          <Typography variant="subtitle1" sx={{ color: '#592d2d' }}>
            Detalles del Proyecto
          </Typography>
        </Box>
        
        <TextField
          name="projectName"
          label="Nombre del Proyecto"
          fullWidth
          value={formData.projectName}
          onChange={handleChange}
          required
          variant="outlined"
        />

        <TextField
          name="description"
          label="Descripción"
          fullWidth
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          variant="outlined"
          placeholder="Describe los detalles del proyecto..."
        />
      </FormSection>
    </>
  );
}

export function StatusSection() {
  const { state: { formData }, actions: { handleChange } } = useProjectFormContext();

  const statusOptions = [
    { value: 'Pending', label: 'Pendiente' },
    { value: 'In Progress', label: 'En Progreso' },
    { value: 'Completed', label: 'Completado' }
  ];

  return (
    <FormSection>
      <Box display="flex" alignItems="center" mb={2}>
        <ScheduleIcon sx={{ mr: 1, color: '#592d2d' }} />
        <Typography variant="subtitle1" sx={{ color: '#592d2d' }}>
          Estado del Proyecto
        </Typography>
      </Box>
      
      <FormControl fullWidth>
        <InputLabel sx={{ '&.Mui-focused': { color: '#592d2d' } }}>
          Estado
        </InputLabel>
        <Select
          name="status"
          value={formData.status}
          onChange={handleChange}
          label="Estado"
          sx={{
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8e3031',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#592d2d',
            }
          }}
        >
          {statusOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              <StatusChip
                label={option.label}
                status={option.value}
                size="small"
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FormSection>
  );
}

export function Actions({ onCancel, submitLabel }) {
  const { state: { isValid, loading, isSubmitting }, actions: { handleSubmit } } = useProjectFormContext();

  return (
    <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
      <Button 
        onClick={onCancel} 
        sx={{
          color: '#ffffff',
          backgroundColor: '#000000',
          borderColor: '#000000',
          '&:hover': {
            backgroundColor: '#333333',
            borderColor: '#333333',
          }
        }}
        variant="contained"
        startIcon={<CloseIcon />}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button
        onClick={handleSubmit}
        variant="contained"
        disabled={!isValid || loading || isSubmitting}
        sx={{ 
          ml: 2,
          color: '#ffffff',
          bgcolor: '#000000',
          '&:hover': {
            bgcolor: '#333333',
          },
          '&.Mui-disabled': {
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          submitLabel
        )}
      </Button>
    </DialogActions>
  );
}

export const ProjectForm = {
  Dialog: FormDialog,
  Header,
  Content,
  ClientSection,
  DetailsSection,
  StatusSection,
  Actions,
};
