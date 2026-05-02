import { Box, Typography, Pagination } from '@mui/material';

export function DataTablePagination({ page, totalPages, totalCount, currentCount, onPageChange, label = 'elementos' }) {
  if (totalPages <= 1) return null;
  return (
    <Box className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
      <Typography variant="body2" color="text.secondary">
        Mostrando {currentCount} de {totalCount} {label}
      </Typography>
      <Pagination count={totalPages} page={page} onChange={onPageChange} color="primary" size="small" />
    </Box>
  );
}
