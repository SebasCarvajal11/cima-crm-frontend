import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export function SearchInput({ value, onChange, placeholder = 'Buscar...', onClear, size = 'small', sx }) {
  return (
    <TextField
      size={size}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{ minWidth: 250, ...sx }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'var(--color-text-muted)' }} />
            </InputAdornment>
          ),
          endAdornment: value && onClear ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={onClear}><ClearIcon fontSize="small" /></IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}
