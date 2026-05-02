import { Box, Button, TextField } from '@mui/material';
import { Add as AddIcon, FilterList as FilterListIcon, Search as SearchIcon } from '@mui/icons-material';
import { TableToolbar, SearchBar } from './SharedStyles';

export const UserTableToolbar = ({ onOpenCreate }) => (
  <TableToolbar>
    <SearchBar>
      <SearchIcon />
      <TextField
        placeholder="Buscar usuario..."
        variant="standard"
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
        onClick={onOpenCreate}
        sx={{
          background: 'linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(207, 215, 224) 100%)',
          },
        }}
      >
        Nuevo Usuario
      </Button>
    </Box>
  </TableToolbar>
);
