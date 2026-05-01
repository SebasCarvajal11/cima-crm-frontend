// src/pages/projects/components/ProjectFilter.js
import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../../context/ProjectContext';
import { TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';

const ProjectFilter = () => {
  const { projects, setFilteredProjects } = useContext(ProjectContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearch = () => {
    const filtered = projects.filter((project) => {
      const matchesName = project.projectName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? project.status === statusFilter : true;
      return matchesName && matchesStatus;
    });
    setFilteredProjects(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
    setFilteredProjects(projects);
  };

  return (
    <div className="flex items-center gap-2.5 mb-5 flex-wrap">
      <TextField
        label="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        size="small"
      />
      <FormControl variant="outlined" size="small" className="min-w-[150px]">
        <InputLabel>Estado</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Estado"
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Buscar
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleReset}>
        Reiniciar
      </Button>
    </div>
  );
};

export default ProjectFilter;
