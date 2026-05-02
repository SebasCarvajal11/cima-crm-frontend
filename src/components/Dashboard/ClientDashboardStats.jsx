import { Grid } from '@mui/material';
import { useMemo } from 'react';
import { StatsCard } from '../ui/StatsCard';

export const ClientDashboardStats = ({ clients }) => {
  const stats = useMemo(() => {
    const total = clients.length;
    return [
      { label: 'Total', count: total },
      { label: 'Activos', count: total },
    ];
  }, [clients]);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((category) => (
        <Grid item xs={12} sm={6} md={3} key={category.label}>
          <StatsCard value={category.count} label={category.label} />
        </Grid>
      ))}
    </Grid>
  );
};
