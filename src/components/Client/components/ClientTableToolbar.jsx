import { Box, Button, TextField } from '@mui/material';
import { Add as AddIcon, FilterList as FilterListIcon, Search as SearchIcon } from '@mui/icons-material';
import { useClient } from '../../../context/ClientContext';
import { TableToolbar, SearchBar } from './SharedStyles';

export const ClientTableToolbar = () => {
  const { searchTerm, setSearchTerm, openCreateDialog } = useClient();

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
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" startIcon={<FilterListIcon />}>
          Filtrar
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          className="bg-brand-gradient text-white"
        >
          Nuevo Cliente
        </Button>
      </Box>
    </TableToolbar>
  );
};
