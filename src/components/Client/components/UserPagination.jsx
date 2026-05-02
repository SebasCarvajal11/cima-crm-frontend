import { Box, Pagination, Typography } from '@mui/material';

export const UserPagination = ({ currentPage, totalPages, currentCount, totalCount, onPageChange }) => (
  <Box
    sx={{
      padding: 'clamp(0.75rem, 3vw, 1.25rem)',
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'stretch', sm: 'center' },
      gap: '0.75rem',
      borderTop: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Typography sx={{ color: 'text.secondary', textAlign: { xs: 'center', sm: 'left' } }}>
      Mostrando {currentCount} de {totalCount} usuarios
    </Typography>
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={onPageChange}
      variant="outlined"
      shape="rounded"
      siblingCount={0}
      boundaryCount={1}
      sx={{
        alignSelf: 'center',
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
