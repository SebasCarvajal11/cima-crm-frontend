import { TableContainer, TableHead, TableRow } from '@mui/material';
import styled from '@emotion/styled';
import { alpha } from '@mui/material/styles';

export const EnhancedTableContainer = styled(TableContainer)(() => ({
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 0 50px 0 rgba(82, 63, 105, 0.15)',
  overflow: 'hidden',
  border: '1px solid #ebedf3',
}));

export const TableToolbar = styled('div')(() => ({
  padding: '20px 24px',
  background: '#ffffff',
  borderBottom: '1px solid #ebedf3',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
}));

export const SearchBar = styled('div')(() => ({
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

export const StyledTableHead = styled(TableHead)(() => ({
  '& .MuiTableCell-head': {
    background: 'var(--color-brand-primary-light)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: '16px 24px',
    borderBottom: '1px solid #ebedf3',
    whiteSpace: 'nowrap',
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
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
