import {
  TextField, Button, Paper, IconButton, InputAdornment, Grid, Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Cancel as CancelIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import { cn } from '../../../utils/cn';
import { useFaq } from '../../../context/FaqContext';

export default function FaqFilters() {
  const {
    searchTerm, setSearchTerm,
    activeFilter, setActiveFilter,
    fetchFaqs,
  } = useFaq();

  const filterBtnBase = 'px-4 py-2 rounded-md font-medium transition-all cursor-pointer border';

  return (
    <Paper className="mb-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all" elevation={0}>
      <Grid container spacing={2} alignItems="center" padding={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar preguntas frecuentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <CancelIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="flex gap-2.5 flex-wrap">
            <Button
              variant={activeFilter === 'all' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setActiveFilter('all')}
              startIcon={<FilterIcon />}
              className={cn(
                filterBtnBase,
                activeFilter === 'all'
                  ? 'bg-info text-white border-info'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              Todas
            </Button>
            <Button
              variant={activeFilter === 'active' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setActiveFilter('active')}
              startIcon={<CheckCircleIcon />}
              className={cn(
                filterBtnBase,
                activeFilter === 'active'
                  ? 'bg-info text-white border-info'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              Activas
            </Button>
            <Button
              variant={activeFilter === 'draft' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setActiveFilter('draft')}
              startIcon={<PendingIcon />}
              className={cn(
                filterBtnBase,
                activeFilter === 'draft'
                  ? 'bg-info text-white border-info'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              Borradores
            </Button>
            <Tooltip title="Actualizar">
              <IconButton color="primary" onClick={fetchFaqs}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}
