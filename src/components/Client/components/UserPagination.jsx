import { Box, Pagination, Typography } from '@mui/material';

export const UserPagination = ({ currentPage, totalPages, currentCount, totalCount, onPageChange }) => (
  <Box
    sx={{
      padding: '1.25rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Typography sx={{ color: 'text.secondary' }}>
      Mostrando {currentCount} de {totalCount} usuarios
    </Typography>
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={onPageChange}
      variant="outlined"
      shape="rounded"
      sx={{
        '& .MuiPaginationItem-root': {
          borderColor: 'divider',
          color: 'text.secondary',
          '&.Mui-selected': {
            background: 'grey.50',
            borderColor: 'info.main',
            color: 'info.main',
          },
        },
      }}
    />
  </Box>
);
