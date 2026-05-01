import { Box, Pagination, Typography } from '@mui/material';
import { useClient } from '../../../context/ClientContext';

export const ClientPagination = () => {
  const { paginatedClients, clients, page, totalPages, handlePageChange } = useClient();

  return (
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
        Mostrando {paginatedClients.length} de {clients.length} clientes
      </Typography>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        variant="outlined"
        shape="rounded"
        sx={{
          '& .MuiPaginationItem-root': {
            borderColor: '#e9ecef',
            color: '#7e8299',
            '&.Mui-selected': {
              background: '#f3f6f9',
              borderColor: 'var(--color-brand-primary-light)',
              color: 'var(--color-brand-primary-light)',
            },
          },
        }}
      />
    </Box>
  );
};
