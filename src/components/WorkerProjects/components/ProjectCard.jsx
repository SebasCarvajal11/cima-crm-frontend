import {
  CardContent, CardActions, Typography, Button, Box, Divider,
} from '@mui/material';
import {
  Assignment as ProjectIcon,
  Task as TaskIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { StyledCard, StatusChip } from './StyledComponents';

export default function ProjectCard({ project, onViewTasks }) {
  return (
    <StyledCard>
      <CardContent className="flex-grow p-6">
        <Box className="flex justify-between items-start mb-4">
          <Box className="flex items-center gap-2">
            <ProjectIcon color="primary" />
            <Typography variant="h6" component="h2" className="font-semibold">
              {project.projectName}
            </Typography>
          </Box>
          <StatusChip status={project.status} label={project.status} size="small" />
        </Box>

        <Divider className="my-4" />

        <Typography variant="body2" color="text.secondary" className="mb-4 min-h-[3.75rem]">
          <DescriptionIcon className="text-base mr-2 align-text-bottom" />
          {project.description || 'Sin descripción disponible'}
        </Typography>
      </CardContent>

      <CardActions className="p-4 pt-0 gap-2">
        <Button
          fullWidth
          variant="outlined"
          startIcon={<TaskIcon />}
          onClick={() => onViewTasks(project.projectId)}
        >
          Ver Tareas
        </Button>
      </CardActions>
    </StyledCard>
  );
}
