import { Typography, Button } from '@mui/material';
import { Add as AddIcon, Assignment as AssignmentIcon } from '@mui/icons-material';

const TaskManagementHeader = ({ selectedTasks, isAdmin, onBulkOpen, onCreateOpen }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-5 bg-white rounded-xl shadow-md gap-4">
      <Typography variant="h4" component="h1" sx={{ color: 'var(--color-brand-primary)' }}>
        Gestión de Tareas
      </Typography>
      <div className="flex items-center gap-2">
        {selectedTasks.length > 0 && isAdmin && (
          <Button
            variant="outlined"
            onClick={onBulkOpen}
            startIcon={<AssignmentIcon />}
            sx={{ mr: 2 }}
          >
            Acciones en Masa ({selectedTasks.length})
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateOpen}
          sx={{
            background: 'linear-gradient(45deg, var(--color-brand-secondary) 30%, var(--color-brand-secondary-light) 90%)',
            boxShadow: '0 3px 5px 2px rgba(52, 152, 219, .3)',
          }}
        >
          Nueva Tarea
        </Button>
      </div>
    </div>
  );
};

export default TaskManagementHeader;
