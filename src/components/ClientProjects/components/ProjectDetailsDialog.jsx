import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Box, Grid, Chip, LinearProgress,
  List, ListItem, ListItemIcon, ListItemText, IconButton, Divider,
} from '@mui/material';
import {
  Assignment as ProjectIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Contacts as ContactsIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'success';
    case 'in progress': return 'info';
    case 'pending': return 'warning';
    default: return 'default';
  }
};

export default function ProjectDetailsDialog({ open, onClose, project }) {
  if (!project) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ className: 'rounded-3xl shadow-2xl overflow-hidden' }}
    >
      <DialogTitle className="p-0">
        <Box className="bg-gradient-to-r from-brand-primary to-brand-primary-light p-8 text-white relative">
          <Box className="flex items-center gap-4">
            <Box className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <ProjectIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" className="font-bold leading-tight">
                {project.projectName}
              </Typography>
              <Typography variant="body2" className="opacity-80">
                ID: {project.projectId}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} className="absolute top-6 right-6 text-white hover:bg-white/20">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent className="p-8">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box className="p-6 bg-gray-50 rounded-2xl">
              <Typography variant="subtitle1" className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <DescriptionIcon className="text-brand-primary" />
                Descripción del Proyecto
              </Typography>
              <Typography variant="body1" className="text-gray-600 leading-relaxed">
                {project.description || 'Sin descripción disponible'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" className="font-bold text-gray-800 mb-4">
              Estado y Progreso Actual
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box className="p-4 border border-gray-100 rounded-2xl">
                  <Typography variant="caption" className="text-gray-400 uppercase font-bold block mb-2">Estado</Typography>
                  <Chip label={project.status} color={getStatusColor(project.status)} className="font-bold px-4" />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="p-4 border border-gray-100 rounded-2xl h-full flex flex-col justify-center">
                  <Box className="flex justify-between mb-2">
                    <Typography variant="caption" className="text-gray-400 uppercase font-bold">Progreso General</Typography>
                    <Typography variant="body2" className="font-bold text-brand-primary">{project.progress || 0}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress || 0}
                    className="h-2 rounded-full bg-gray-100"
                    sx={{ '& .MuiLinearProgress-bar': { bgcolor: 'var(--color-brand-primary)' } }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {project.taskStats && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" className="font-bold text-gray-800 mb-4">Estadísticas de Tareas</Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Total', count: project.taskStats.total, color: 'bg-gray-100 text-gray-600' },
                  { label: 'Completadas', count: project.taskStats.completed, color: 'bg-green-50 text-green-600' },
                  { label: 'En Progreso', count: project.taskStats.inProgress, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Pendientes', count: project.taskStats.pending, color: 'bg-yellow-50 text-yellow-600' },
                ].map((stat) => (
                  <Grid item xs={6} sm={3} key={stat.label}>
                    <Box className={`p-4 text-center rounded-2xl ${stat.color}`}>
                      <Typography variant="h4" className="font-bold mb-1">{stat.count}</Typography>
                      <Typography variant="caption" className="font-bold uppercase opacity-80">{stat.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Box className="p-6 border border-gray-100 rounded-2xl h-full">
              <Typography variant="subtitle1" className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ContactsIcon className="text-brand-primary" /> Información de Contacto
              </Typography>
              <List dense className="p-0">
                <ListItem className="px-0">
                  <ListItemIcon className="min-w-[40px]"><PersonIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Responsable" secondary={project.client?.name || '-'} />
                </ListItem>
                <ListItem className="px-0">
                  <ListItemIcon className="min-w-[40px]"><EmailIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Email" secondary={project.client?.email || '-'} />
                </ListItem>
                <ListItem className="px-0">
                  <ListItemIcon className="min-w-[40px]"><PhoneIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Teléfono" secondary={project.client?.contactInfo || '-'} />
                </ListItem>
              </List>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="p-6 border border-gray-100 rounded-2xl h-full">
              <Typography variant="subtitle1" className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ScheduleIcon className="text-brand-primary" /> Fechas del Proyecto
              </Typography>
              <List dense className="p-0">
                <ListItem className="px-0">
                  <ListItemIcon className="min-w-[40px]"><CalendarIcon color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Fecha de Creación"
                    secondary={new Date(project.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  />
                </ListItem>
                <ListItem className="px-0">
                  <ListItemIcon className="min-w-[40px]"><UpdateIcon color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Última Actualización"
                    secondary={new Date(project.updatedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />
      <DialogActions className="p-6 bg-gray-50">
        <Button
          onClick={onClose}
          variant="contained"
          className="bg-black hover:bg-gray-800 px-8 py-2.5 rounded-xl normal-case font-bold shadow-lg"
        >
          Cerrar Detalles
        </Button>
      </DialogActions>
    </Dialog>
  );
}
