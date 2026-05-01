import { Box, Pagination, Typography } from '@mui/material';

export const UserPagination = ({ currentPage, totalPages, currentCount, totalCount, onPageChange }) => (
  <Box
    sx={{
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #ebedf3',
    }}
  >
    <Typography sx={{ color: '#7e8299' }}>
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
          borderColor: '#e9ecef',
          color: '#7e8299',
          '&.Mui-selected': {
            background: '#f3f6f9',
            borderColor: '#3699ff',
            color: '#3699ff',
          },
        },
      }}
    />
  </Box>
);
