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
                : 'linear-gradient(135deg, grey.900 0%, grey.700 100%)',
              width: '2rem',
              height: '2rem',
              fontSize: '0.75rem',
              flexShrink: 0,
            }}
          >
            {getInitials(client.name)}
          </Avatar>
          <Typography noWrap sx={{ color: 'text.primary', fontWeight: 500, maxWidth: '10rem' }}>
            {client.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography noWrap sx={{ maxWidth: '12rem', fontSize: 'inherit' }}>
          {client.email}
        </Typography>
      </TableCell>
      <TableCell>
        <StatusChip status={client.role}>{client.role}</StatusChip>
      </TableCell>
      <TableCell className="hide-mobile">
        <Box
          sx={{
            display: 'inline-block',
            px: '1rem',
            py: '0.25rem',
            borderRadius: '0.25rem',
            bgcolor: getPlanColor(client.plan),
            color: 'white',
            fontWeight: 'medium',
            whiteSpace: 'nowrap',
          }}
        >
          {client.plan || 'Oro'}
        </Box>
      </TableCell>
      <TableCell className="hide-tablet">{client.address}</TableCell>
      <TableCell className="hide-tablet" sx={{ whiteSpace: 'nowrap' }}>{client.phone || client.contactInfo}</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => onEdit(client)} sx={{ color: 'var(--color-brand-primary)' }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(client)} sx={{ color: 'error.main' }}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </StyledTableRow>
  );
};
