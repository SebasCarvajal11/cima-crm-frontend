import { Paper, Typography } from '@mui/material';

export function StatsCard({ value, label, icon, gradient, iconColor, ...props }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        background: gradient || 'white',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        },
        ...props.sx,
      }}
    >
      {icon && (
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${iconColor || 'text-brand-primary bg-brand-primary/10'}`}>
          {icon}
        </div>
      )}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
}
