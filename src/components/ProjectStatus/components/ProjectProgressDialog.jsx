import {
  Box, Typography, Grid, Paper, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'In Progress': return 'primary';
    case 'Pending': return 'warning';
    default: return 'default';
  }
};

export default function ProjectProgressDialog({ open, onClose, details }) {
  if (!details) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' } }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', px: 3, py: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {details.projectName}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
          Progreso del Proyecto
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ width: 250, margin: '0 auto', p: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
              <CircularProgressbar
                value={details.progress}
                text={`${details.progress}%`}
                styles={buildStyles({
                  textColor: 'var(--color-brand-primary)',
                  pathColor: 'var(--color-brand-primary)',
                  trailColor: 'rgba(89, 45, 45, 0.1)',
                  textSize: '16px',
                  strokeLinecap: 'round',
                })}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', mb: 2 }}>
                Estadísticas de Tareas
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Total de Tareas', value: details.taskStats.total, color: 'inherit' },
                  { label: 'Completadas', value: details.taskStats.completed, color: '#2e7d32' },
                  { label: 'En Progreso', value: details.taskStats.inProgress, color: '#1976d2' },
                  { label: 'Pendientes', value: details.taskStats.pending, color: '#ed6c02' },
                ].map((stat) => (
                  <Grid item xs={6} key={stat.label}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">{stat.label}</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 500, color: stat.color }}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', mb: 2 }}>
                Estado de las Tareas
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {details.tasks.map((task, index) => (
                  <Chip
                    key={index}
                    label={task.status}
                    color={getStatusColor(task.status)}
                    size="medium"
                    sx={{ m: 0.5, px: 2, borderRadius: 2, fontWeight: 500 }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e0e0e0' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ borderRadius: 2, textTransform: 'none', px: 3, backgroundColor: '#000', '&:hover': { backgroundColor: '#333' } }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
