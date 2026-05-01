import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';

export default function TaskUpdateDialog({ open, onClose, onUpdate, status, onStatusChange }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Actualizar Estado de Tarea</DialogTitle>
      <DialogContent className="min-w-[300px]">
        <FormControl fullWidth className="mt-4">
          <InputLabel>Estado</InputLabel>
          <Select
            value={status}
            label="Estado"
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <MenuItem value="Pending">En espera</MenuItem>
            <MenuItem value="In Progress">En Progreso</MenuItem>
            <MenuItem value="Completed">Completado</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onUpdate} variant="contained" color="primary">
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
