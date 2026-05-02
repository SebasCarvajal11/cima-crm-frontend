import { Paper, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export const ClientDashboardSearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <Paper sx={{ p: 2, mb: 4, borderRadius: 3, display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar clientes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: '25rem' }}
      />
    </Paper>
  );
};
