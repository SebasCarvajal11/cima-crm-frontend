import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, CardContent } from '@mui/material';
import { FolderOpen as ProjectIcon } from '@mui/icons-material';
import { useExcelContext } from '../ExcelContext';

export const ExcelProjectSelector = () => {
  const { state, actions } = useExcelContext();
  const { projects, selectedProject } = state;
  const { handleProjectChange } = actions;

  return (
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            backgroundColor: 'primary.lighter',
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ProjectIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        </Box>
        <FormControl fullWidth>
          <InputLabel>Seleccionar Proyecto</InputLabel>
          <Select
            value={selectedProject}
            onChange={handleProjectChange}
            label="Seleccionar Proyecto"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'text.primary',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            }}
          >
            <MenuItem value="">
              <em>Seleccione un proyecto</em>
            </MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.projectId} value={project.projectId}>
                {project.projectName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </CardContent>
  );
};
