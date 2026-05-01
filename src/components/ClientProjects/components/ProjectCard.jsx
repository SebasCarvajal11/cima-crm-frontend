import {
  Card, CardContent, CardActions, Typography, Button, Chip, LinearProgress, Box,
} from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'success';
    case 'in progress': return 'info';
    case 'pending': return 'warning';
    default: return 'default';
  }
};

export default function ProjectCard({ project, index, onViewDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="h-full rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group">
        <Box
          className={`h-2 transition-colors duration-300 ${
            project.status === 'Completed' ? 'bg-green-500' :
            project.status === 'In Progress' ? 'bg-brand-primary' : 'bg-yellow-500'
          }`}
        />

        <CardContent className="flex-grow p-6">
          <Box className="flex justify-between items-start mb-4">
            <Typography variant="h6" className="font-bold text-gray-800 group-hover:text-brand-primary transition-colors">
              {project.projectName}
            </Typography>
          </Box>

          <Chip
            label={project.status}
            size="small"
            color={getStatusColor(project.status)}
            className="mb-4 font-semibold rounded-md"
          />

          <Typography variant="body2" color="text.secondary" className="mb-6 line-clamp-3 min-h-[3rem]">
            <DescriptionIcon className="text-base mr-2 align-text-bottom" />
            {project.description || 'Sin descripción disponible'}
          </Typography>

          <Box className="mt-auto">
            <Box className="flex justify-between items-end mb-2">
              <Typography variant="caption" className="text-gray-500 font-medium">Progreso</Typography>
              <Typography variant="caption" className="text-brand-primary font-bold">{project.progress || 0}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={project.progress || 0}
              className="h-2 rounded-full bg-gray-100"
              sx={{ '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: 'var(--color-brand-primary)' } }}
            />
          </Box>
        </CardContent>

        <CardActions className="p-6 pt-0">
          <Button
            fullWidth
            variant="outlined"
            onClick={() => onViewDetails(project)}
            className="rounded-xl border-gray-200 text-gray-700 hover:border-brand-primary hover:text-brand-primary normal-case font-semibold"
          >
            Ver Detalles
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
}
