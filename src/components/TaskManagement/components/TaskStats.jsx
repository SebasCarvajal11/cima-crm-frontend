import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  HourglassEmpty as PendingIcon,
  BarChart as BarChartIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTask } from '../../../context/TaskContext';

const StatCard = ({ icon, value, label, gradient, iconColor }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: '12px',
        background: gradient,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl mr-4 ${iconColor}`}
        >
          {icon}
        </div>
        <div>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#64748b' }}>
            {label}
          </Typography>
        </div>
      </div>
    </Paper>
  </Grid>
);

const ProgressBar = ({ label, colorClass, percentage }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between text-sm">
      <Typography sx={{ display: 'flex', alignItems: 'center' }}>
        <span className={`w-3 h-3 rounded-full mr-2 ${colorClass}`}></span>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600 }}>{percentage}%</Typography>
    </div>
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

const TaskStats = () => {
  const { taskStats } = useTask();

  if (!taskStats) {
    return (
      <div className="flex justify-center p-10">
        <CircularProgress />
      </div>
    );
  }

  const { stats } = taskStats;
  const total = stats?.total || 0;
  const completedPct = total ? Math.round((stats.completed / total) * 100) : 0;
  const inProgressPct = total ? Math.round((stats.inProgress / total) * 100) : 0;
  const pendingPct = total ? Math.round((stats.pending / total) * 100) : 0;

  return (
    <div className="p-5 bg-white rounded-xl shadow-md">
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          color: '#2c3e50',
          fontWeight: 600,
        }}
      >
        <BarChartIcon sx={{ mr: 1 }} /> Estadísticas de Tareas
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatCard
          icon={<AssignmentIcon fontSize="large" />}
          value={stats?.total || 0}
          label="Tareas Totales"
          gradient="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
          iconColor="text-blue-500 bg-blue-100"
        />
        <StatCard
          icon={<CheckCircleIcon fontSize="large" />}
          value={stats?.completed || 0}
          label="Completadas"
          gradient="linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%)"
          iconColor="text-green-600 bg-green-100"
        />
        <StatCard
          icon={<ScheduleIcon fontSize="large" />}
          value={stats?.inProgress || 0}
          label="En Progreso"
          gradient="linear-gradient(135deg, #fff9e6 0%, #ffeeba 100%)"
          iconColor="text-blue-800 bg-blue-100"
        />
        <StatCard
          icon={<PendingIcon fontSize="large" />}
          value={stats?.pending || 0}
          label="Pendientes"
          gradient="linear-gradient(135deg, #ffe6e6 0%, #ffcccc 100%)"
          iconColor="text-orange-500 bg-orange-100"
        />
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: '12px', height: '100%', background: 'white' }}
          >
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
              <BarChartIcon sx={{ mr: 1, color: '#3498db' }} /> Distribución de Tareas
            </Typography>
            <div className="flex flex-col gap-4">
              <ProgressBar label="Completadas" colorClass="bg-green-500" percentage={completedPct} />
              <ProgressBar label="En Progreso" colorClass="bg-blue-500" percentage={inProgressPct} />
              <ProgressBar label="Pendientes" colorClass="bg-orange-400" percentage={pendingPct} />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: '12px', height: '100%', background: 'white' }}
          >
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
              <PersonIcon sx={{ mr: 1, color: '#9c27b0' }} /> Resumen de tareas
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl mr-3 bg-green-100 text-green-600">
                  <CheckCircleIcon />
                </div>
                <div className="flex flex-col">
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {completedPct}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Tasa de Finalización
                  </Typography>
                </div>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default TaskStats;
