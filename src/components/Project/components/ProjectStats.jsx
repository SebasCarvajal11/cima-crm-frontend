import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import logger from '../../../utils/logger';

const StatCard = ({ title, value, icon, borderColor, barColor }) => (
  <Paper
    elevation={2}
    className={`p-4 h-full flex flex-col bg-white border-2 ${borderColor} rounded-lg transition-transform hover:-translate-y-1 hover:shadow-md`}
  >
    <Box className="flex items-center mb-2">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 mr-2 text-gray-600">
        {icon}
      </div>
      <Typography variant="h6" component="div" className="text-gray-900 font-semibold">
        {title}
      </Typography>
    </Box>
    <Typography variant="h3" component="div" className="text-gray-900 font-bold mb-4">
      {value}
    </Typography>
    <LinearProgress
      variant="determinate"
      value={100}
      sx={{
        height: 6,
        borderRadius: 3,
        bgcolor: 'rgba(0,0,0,0.05)',
        '& .MuiLinearProgress-bar': {
          bgcolor: barColor
        }
      }}
    />
  </Paper>
);

const ProjectStats = ({ stats }) => {
  logger.debug('Project stats:', stats);
  const {
    total = 0,
    completed = 0,
    pending = 0,
    inProgress = 0
  } = stats || {};

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Proyectos"
          value={total}
          icon={<AssignmentIcon />}
          borderColor="border-brand-primary/20"
          barColor="var(--color-brand-primary)"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Completados"
          value={completed}
          icon={<CheckCircleIcon />}
          borderColor="border-green-500/20"
          barColor="#10b981" // Tailwind green-500
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Pendientes"
          value={pending}
          icon={<PendingIcon />}
          borderColor="border-orange-500/20"
          barColor="#f59e0b" // Tailwind orange-500
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="En Progreso"
          value={inProgress}
          icon={<TimelineIcon />}
          borderColor="border-blue-500/20"
          barColor="#3b82f6" // Tailwind blue-500
        />
      </Grid>
    </Grid>
  );
};

export default ProjectStats;
