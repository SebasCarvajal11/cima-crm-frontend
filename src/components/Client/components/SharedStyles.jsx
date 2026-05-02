import { TableContainer, TableHead, TableRow } from '@mui/material';
import styled from '@emotion/styled';

export const EnhancedTableContainer = styled(TableContainer)(() => ({
  background: 'var(--color-surface)',
  borderRadius: '1.25rem',
  boxShadow: '0 0 50px 0 rgba(82, 63, 105, 0.15)',
  overflowX: 'auto',
  border: '1px solid var(--color-border)',
  '& .MuiTable-root': {
    minWidth: '42rem',
  },
}));

export const TableToolbar = styled('div')(() => ({
  padding: 'clamp(0.75rem, 3vw, 1.25rem) clamp(1rem, 4vw, 1.5rem)',
  background: 'var(--color-surface)',
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'clamp(0.5rem, 2vw, 1rem)',
}));

export const SearchBar = styled('div')(() => ({
  position: 'relative',
  flex: '1',
  maxWidth: '100%',
  '@media (min-width: 40rem)': {
    maxWidth: '25rem',
  },
  '& .MuiInputBase-root': {
    width: '100%',
    background: 'rgba(243, 246, 249, 0.7)',
    borderRadius: '0.625rem',
    '&:hover': {
      background: '#f3f6f9',
    },
  },
  '& .MuiInputBase-input': {
    padding: '0.75rem 0.75rem 0.75rem clamp(2rem, 5vw, 2.8125rem)',
  },
  '& .MuiSvgIcon-root': {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-text-muted)',
  },
}));

export const StyledTableHead = styled(TableHead)(() => ({
  '& .MuiTableCell-head': {
    background: 'var(--color-brand-primary-light)',
    color: 'var(--color-surface)',
    fontWeight: 600,
    fontSize: 'clamp(0.8125rem, 0.5vw + 0.7rem, 0.95rem)',
    padding: '0.75rem clamp(0.5rem, 2vw, 1rem)',
    borderBottom: '1px solid var(--color-border)',
    whiteSpace: 'nowrap',
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(243, 246, 249, 0.7)',
  },
  '& .MuiTableCell-root': {
    padding: '0.75rem clamp(0.5rem, 2vw, 1rem)',
    borderBottom: '1px solid var(--color-border)',
    color: 'var(--color-gray-700)',
  },
}));
