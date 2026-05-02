import { Box, Button, TextField } from '@mui/material';
import { Add as AddIcon, FilterList as FilterListIcon, Search as SearchIcon } from '@mui/icons-material';
import { TableToolbar, SearchBar } from './SharedStyles';

export const ClientTableToolbar = ({ searchTerm, setSearchTerm, onCreate }) => {
  return (
    <TableToolbar>
      <SearchBar>
        <SearchIcon />
        <TextField
          placeholder="Buscar cliente..."
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ disableUnderline: true }}
        />
      </SearchBar>
      <Box sx={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 1rem)', flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<FilterListIcon />}>
          Filtrar
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreate}
          className="bg-brand-gradient text-white"
        >
          Nuevo Cliente
        </Button>
      </Box>
    </TableToolbar>
  );
};
