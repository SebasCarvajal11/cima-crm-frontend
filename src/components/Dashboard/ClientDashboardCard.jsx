import { Box, Card, CardContent, Typography, Avatar, Divider, Grid } from '@mui/material';
import { Mail as MailIcon } from '@mui/icons-material';
import { stringToColor, getInitials } from '../../utils/colorUtils';

export const ClientDashboardCard = ({ client }) => {
  const clientId = client.clientId || client.id;
  const clientName = client.clientName || client.name || `Cliente #${clientId}`;
  const initials = getInitials(clientName);

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card
        sx={{
          borderRadius: 3,
          '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.1)' },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: stringToColor(clientName),
                width: '3.5rem',
                height: '3.5rem',
                mr: 2,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {clientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {client.phone || 'Sin telfono'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MailIcon fontSize="small" color="action" />
                <Typography variant="body2">{client.email || 'Sin email'}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
