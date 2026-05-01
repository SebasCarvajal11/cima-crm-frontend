import {
  TextField, FormControl, InputLabel, Select, MenuItem,
  Typography, Avatar, Box, Divider, FormHelperText,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useProjectFormContext } from './context';
import StatusChip from '../../StatusChip';
import { FormSection } from './StyledComponents';

export function ClientSection() {
  const { state: { formData, clients, loading, error }, actions: { handleChange } } = useProjectFormContext();

  return (
    <FormSection>
      <Box display="flex" alignItems="center" mb={2}>
        <BusinessIcon sx={{ mr: 1, color: 'var(--color-brand-primary)' }} />
        <Typography variant="subtitle1" sx={{ color: 'var(--color-brand-primary)' }}>
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
            clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                <Box display="flex" alignItems="center" width="100%">
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      bgcolor: client.id % 2 === 0 ? 'var(--color-brand-primary-light)' : 'var(--color-brand-primary)',
                    }}
                  >
                    {client.name ? client.name.charAt(0).toUpperCase() : `C${client.id}`}
                  </Avatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Typography variant="body1" fontWeight="600" sx={{ color: 'var(--color-brand-primary)' }}>
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
            <MenuItem disabled value="">No hay clientes disponibles</MenuItem>
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
          <DescriptionIcon sx={{ mr: 1, color: 'var(--color-brand-primary)' }} />
          <Typography variant="subtitle1" sx={{ color: 'var(--color-brand-primary)' }}>
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
    { value: 'Completed', label: 'Completado' },
  ];

  return (
    <FormSection>
      <Box display="flex" alignItems="center" mb={2}>
        <ScheduleIcon sx={{ mr: 1, color: 'var(--color-brand-primary)' }} />
        <Typography variant="subtitle1" sx={{ color: 'var(--color-brand-primary)' }}>
          Estado del Proyecto
        </Typography>
      </Box>
      <FormControl fullWidth>
        <InputLabel sx={{ '&.Mui-focused': { color: 'var(--color-brand-primary)' } }}>Estado</InputLabel>
        <Select
          name="status"
          value={formData.status}
          onChange={handleChange}
          label="Estado"
          sx={{
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-brand-primary-light)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-brand-primary)' },
          }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <StatusChip label={option.label} status={option.value} size="small" />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FormSection>
  );
}
