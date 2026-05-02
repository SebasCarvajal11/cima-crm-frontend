import { Box, TableCell, IconButton, Typography, Avatar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { stringToColor, adjustColor, getInitials } from '../../../utils/colorUtils';
import { StatusChip } from '../../ui/StatusChip';
import { StyledTableRow } from './SharedStyles';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const UserTableRow = ({ user, onEdit, onDelete }) => {
  const userKey = user.userId || user.id || `user-${user.email}`;

  return (
    <StyledTableRow key={userKey}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              background: user.name
                ? `linear-gradient(135deg, ${stringToColor(user.name)} 0%, ${adjustColor(stringToColor(user.name), -20)} 100%)`
                : 'linear-gradient(135deg, grey.900 0%, grey.700 100%)',
            }}
          >
            {getInitials(user.name)}
          </Avatar>
          <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
            {user.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <StatusChip status={user.role}>{user.role}</StatusChip>
      </TableCell>
      <TableCell>{formatDate(user.createdAt)}</TableCell>
      <TableCell>{formatDate(user.updatedAt)}</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => onEdit(user)} sx={{ color: 'var(--color-brand-primary)' }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(user)} sx={{ color: 'error.main' }}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </StyledTableRow>
  );
};
