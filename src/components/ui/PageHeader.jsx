import { Box, Typography } from '@mui/material';

export function PageHeader({ icon: Icon, title, subtitle, actions }) {
  return (
    <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <Box className="flex items-center gap-3">
        {Icon && <Icon sx={{ fontSize: '2rem', color: 'var(--color-brand-primary)' }} />}
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</Typography>
          {subtitle && <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
        </Box>
      </Box>
      {actions && <Box className="flex items-center gap-2">{actions}</Box>}
    </Box>
  );
}
