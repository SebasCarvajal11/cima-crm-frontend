import { Box, Pagination, Typography } from '@mui/material';
import { useClient } from '../../../context/ClientContext';

export const ClientPagination = () => {
  const { paginatedClients, clients, page, totalPages, handlePageChange } = useClient();

  return (
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
        Mostrando {paginatedClients.length} de {clients.length} clientes
      </Typography>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
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
              borderColor: 'var(--color-brand-primary-light)',
              color: 'var(--color-brand-primary-light)',
            },
          },
        }}
      />
    </Box>
  );
};
