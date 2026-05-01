import { Box, TableCell, IconButton, Typography, Avatar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { stringToColor, adjustColor, getInitials, getPlanColor } from '../../../utils/colorUtils';
import { StatusChip } from '../../ui/StatusChip';
import { StyledTableRow } from './SharedStyles';

export const ClientTableRow = ({ client, onEdit, onDelete }) => {
  const userKey = client.clientId || client.id || `client-${client.email}`;

  return (
    <StyledTableRow key={userKey}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              background: client.name
                ? `linear-gradient(135deg, ${stringToColor(client.name)} 0%, ${adjustColor(stringToColor(client.name), -20)} 100%)`
                : 'linear-gradient(135deg, #000000 0%, #333333 100%)',
            }}
          >
            {getInitials(client.name)}
          </Avatar>
          <Typography sx={{ color: '#3f4254', fontWeight: 500 }}>
            {client.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{client.email}</TableCell>
      <TableCell>
        <StatusChip status={client.role}>{client.role}</StatusChip>
      </TableCell>
      <TableCell>
        <Box
          sx={{
            display: 'inline-block',
            px: 2,
            py: 0.5,
            borderRadius: '4px',
            bgcolor: getPlanColor(client.plan),
            color: 'white',
            fontWeight: 'medium',
          }}
        >
          {client.plan || 'Oro'}
        </Box>
      </TableCell>
      <TableCell>{client.address}</TableCell>
      <TableCell>{client.phone || client.contactInfo}</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => onEdit(client)} sx={{ color: 'var(--color-brand-primary)' }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(client)} sx={{ color: '#f1416c' }}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </StyledTableRow>
  );
};
