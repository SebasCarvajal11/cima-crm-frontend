import { Box, TableCell, Typography, Avatar, Select, MenuItem, FormControl } from '@mui/material';
import { Shield as ShieldIcon } from '@mui/icons-material';
import { stringToColor, getInitials } from '../../../utils/colorUtils';
import { StyledTableRow } from '../../Client/components/SharedStyles';

export const RoleTableRow = ({ user, onRoleChange }) => {
  const userId = user.userId || user.id;
  const name = user.name || user.userName || 'Usuario';

  return (
    <StyledTableRow key={userId}>
      <TableCell>
        <Box className="flex items-center gap-3">
          <Avatar sx={{ bgcolor: stringToColor(name), width: 32, height: 32, fontSize: '0.875rem' }}>
            {getInitials(name)}
          </Avatar>
          <Typography className="font-medium text-gray-700">{name}</Typography>
        </Box>
      </TableCell>
      <TableCell className="text-gray-600">{user.email}</TableCell>
      <TableCell>
        <Box className="flex items-center gap-1">
          <ShieldIcon sx={{ fontSize: 16, color: user.role === 'Admin' ? 'var(--color-brand-primary-light)' : '#666' }} />
          <Typography variant="body2" className={user.role === 'Admin' ? 'text-brand-primary font-bold' : ''}>
            {user.role}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="right">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={user.role}
            onChange={(e) => onRoleChange(user, e.target.value)}
            sx={{
              borderRadius: '8px',
              fontSize: '0.875rem',
              '& .MuiSelect-select': { py: 1 }
            }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Worker">Worker</MenuItem>
            <MenuItem value="Client">Client</MenuItem>
          </Select>
        </FormControl>
      </TableCell>
    </StyledTableRow>
  );
};
