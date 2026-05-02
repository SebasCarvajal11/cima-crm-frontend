import {
  DialogContent, DialogActions, Button, Grid, CircularProgress,
  Typography, IconButton, Box, Alert, Fade,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useProjectFormContext } from './context';
import { StyledDialog, StyledDialogTitle } from './StyledComponents';
import { ClientSection, DetailsSection, StatusSection } from './FormSections';

export function FormDialog({ open, onClose, children }) {
  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth TransitionComponent={Fade} transitionDuration={300}>
      {children}
    </StyledDialog>
  );
}

export function Header({ title, onClose }) {
  return (
    <StyledDialogTitle>
      <Box display="flex" alignItems="center">
        <AssignmentIcon sx={{ mr: 1, color: 'white' }} />
        <Typography variant="h6">{title}</Typography>
      </Box>
      <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
        <CloseIcon />
      </IconButton>
    </StyledDialogTitle>
  );
}

export function Content({ children }) {
  const { state: { loading, error } } = useProjectFormContext();

  return (
    <DialogContent sx={{ pt: 3, overflowX: 'hidden' }}>
      {loading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box my={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>{children}</Grid>
        </Grid>
      )}
    </DialogContent>
  );
}

export function Actions({ onCancel, submitLabel }) {
  const { state: { isValid, loading, isSubmitting }, actions: { handleSubmit } } = useProjectFormContext();

  return (
    <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
      <Button
        onClick={onCancel}
        variant="contained"
        startIcon={<CloseIcon />}
        disabled={isSubmitting}
        sx={{
          color: 'white',
          backgroundColor: 'var(--color-brand-primary)',
          '&:hover': { backgroundColor: 'var(--color-brand-primary-light)' },
        }}
      >
        Cancelar
      </Button>
      <Button
        onClick={handleSubmit}
        variant="contained"
        disabled={!isValid || loading || isSubmitting}
        sx={{
          ml: 2,
          color: 'white',
          bgcolor: 'var(--color-brand-primary)',
          '&:hover': { bgcolor: 'var(--color-brand-primary-light)' },
          '&.Mui-disabled': { bgcolor: 'rgba(89, 45, 45, 0.3)', color: 'rgba(255, 255, 255, 0.7)' },
        }}
      >
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : submitLabel}
      </Button>
    </DialogActions>
  );
}

export const ProjectForm = {
  Dialog: FormDialog,
  Header,
  Content,
  ClientSection,
  DetailsSection,
  StatusSection,
  Actions,
};
