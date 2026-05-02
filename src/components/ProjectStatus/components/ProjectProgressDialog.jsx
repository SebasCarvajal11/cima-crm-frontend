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
      <DialogTitle sx={{ borderBottom: '1px solid var(--color-border)', px: '1.5rem', py: '1rem', backgroundColor: 'var(--color-background)' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {details.projectName}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
          Progreso del Proyecto
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: '1.5rem' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ width: '15.625rem', margin: '0 auto', p: '1.5rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
              <CircularProgressbar
                value={details.progress}
                text={`${details.progress}%`}
                styles={buildStyles({
                  textColor: 'var(--color-brand-primary)',
                  pathColor: 'var(--color-brand-primary)',
                  trailColor: 'rgba(89, 45, 45, 0.1)',
                  textSize: '1rem',
                  strokeLinecap: 'round',
                })}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: '1.5rem', backgroundColor: 'var(--color-background)', borderRadius: '1rem' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'info.main', mb: '1rem' }}>
                Estadísticas de Tareas
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Total de Tareas', value: details.taskStats.total, color: 'inherit' },
                  { label: 'Completadas', value: details.taskStats.completed, color: 'success.main' },
                  { label: 'En Progreso', value: details.taskStats.inProgress, color: 'info.main' },
                  { label: 'Pendientes', value: details.taskStats.pending, color: 'warning.main' },
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
            <Paper elevation={0} sx={{ p: '1.5rem', backgroundColor: 'var(--color-background)', borderRadius: '1rem' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'info.main', mb: '1rem' }}>
                Estado de las Tareas
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {details.tasks.map((task, index) => (
                  <Chip
                    key={index}
                    label={task.status}
                    color={getStatusColor(task.status)}
                    size="medium"
                    sx={{ m: '0.25rem', px: '1rem', borderRadius: '1rem', fontWeight: 500 }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ borderRadius: '1rem', textTransform: 'none', px: '1.5rem', backgroundColor: 'grey.900', '&:hover': { backgroundColor: 'grey.800' } }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
