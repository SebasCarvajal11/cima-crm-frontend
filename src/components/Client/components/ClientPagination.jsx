import { Box, Pagination, Typography } from '@mui/material';
import { useClient } from '../../../context/ClientContext';

export const ClientPagination = () => {
  const { paginatedClients, clients, page, totalPages, handlePageChange } = useClient();

  return (
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
            borderColor: 'divider',
            color: 'text.secondary',
            '&.Mui-selected': {
              background: 'grey.50',
              borderColor: 'var(--color-brand-primary-light)',
              color: 'var(--color-brand-primary-light)',
            },
          },
        }}
      />
    </Box>
  );
};
