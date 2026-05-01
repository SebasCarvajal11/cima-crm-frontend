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
import { useFaq } from '../../../context/FaqContext';

export default function FaqFilters() {
  const {
    searchTerm, setSearchTerm,
    activeFilter, setActiveFilter,
    fetchFaqs,
  } = useFaq();

  return (
    <Paper className="search-container" elevation={0}>
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
          <div className="faq-filters">
            <Button
              variant={activeFilter === 'all' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setActiveFilter('all')}
              startIcon={<FilterIcon />}
              className={`faq-filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            >
              Todas
            </Button>
            <Button
              variant={activeFilter === 'active' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setActiveFilter('active')}
              startIcon={<CheckCircleIcon />}
              className={`faq-filter-button ${activeFilter === 'active' ? 'active' : ''}`}
            >
              Activas
            </Button>
            <Button
              variant={activeFilter === 'draft' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setActiveFilter('draft')}
              startIcon={<PendingIcon />}
              className={`faq-filter-button ${activeFilter === 'draft' ? 'active' : ''}`}
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
