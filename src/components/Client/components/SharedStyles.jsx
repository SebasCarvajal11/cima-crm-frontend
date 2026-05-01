import { Box, TableContainer, TableHead, TableRow } from '@mui/material';
import styled from '@emotion/styled';
import { alpha } from '@mui/material/styles';

export const EnhancedTableContainer = styled(TableContainer)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 0 50px 0 rgba(82, 63, 105, 0.15)',
  overflow: 'hidden',
  border: '1px solid #ebedf3',
}));

export const TableToolbar = styled(Box)(({ theme }) => ({
  padding: '20px 24px',
  background: '#ffffff',
  borderBottom: '1px solid #ebedf3',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
}));

export const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  flex: '1',
  maxWidth: '400px',
  '& .MuiInputBase-root': {
    width: '100%',
    background: alpha('#f3f6f9', 0.7),
    borderRadius: '10px',
    '&:hover': {
      background: '#f3f6f9',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 12px 12px 45px',
  },
  '& .MuiSvgIcon-root': {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#b5b5c3',
  },
}));

export const StatusChip = styled(Box)(({ status }) => ({
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.85rem',
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  ...(status === 'Admin' && {
    background: alpha('#8e3031', 0.1),
    color: '#8e3031',
  }),
  ...(status === 'Worker' && {
    background: alpha('#592d2d', 0.1),
    color: '#592d2d',
  }),
  ...(status === 'Client' && {
    background: alpha('#f1416c', 0.1),
    color: '#f1416c',
  }),
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    background: '#8e3031',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: '16px 24px',
    borderBottom: '1px solid #ebedf3',
    whiteSpace: 'nowrap',
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: alpha('#f3f6f9', 0.7),
  },
  '& .MuiTableCell-root': {
    padding: '16px 24px',
    borderBottom: '1px solid #ebedf3',
    color: '#3f4254',
  },
}));
