import {
  TextField,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const TaskFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  projectFilter,
  setProjectFilter,
  filteredTasks,
  onRefresh,
}) => {
  const uniqueProjects = filteredTasks.reduce((unique, task) => {
    if (task.projectId && !unique.some(p => p.id === task.projectId)) {
      unique.push({
        id: task.projectId,
        name: task.projectName || `Proyecto #${task.projectId}`,
      });
    }
    return unique;
  }, []);

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg mb-6 shadow-sm items-center">
      <TextField
        placeholder="Buscar por descripción o nombre de proyecto..."
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flexGrow: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Estado</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Estado"
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Pending">Pendientes</MenuItem>
          <MenuItem value="In Progress">En Progreso</MenuItem>
          <MenuItem value="Completed">Completadas</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Proyecto</InputLabel>
        <Select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          label="Proyecto"
        >
          <MenuItem value="">Todos</MenuItem>
          {uniqueProjects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <IconButton onClick={onRefresh} color="primary">
        <RefreshIcon />
      </IconButton>
    </div>
  );
};

export default TaskFilters;
