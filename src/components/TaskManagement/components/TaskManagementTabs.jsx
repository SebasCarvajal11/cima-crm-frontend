import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { useTask } from '../../../context/TaskContext';

const TaskManagementTabs = () => {
  const { tabValue, handleTabChange, isAdmin } = useTask();

  return (
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      variant="fullWidth"
      className="bg-white rounded-lg mb-6 shadow-sm"
      sx={{
        '& .MuiTab-root': {
          color: '#592d2d',
          '&:hover': { color: '#000000' },
          '&.Mui-selected': { color: '#000000' },
        },
        '& .MuiTabs-indicator': { backgroundColor: '#000000' },
      }}
    >
      <Tab label="Gestión de Tareas" />
      {isAdmin && <Tab label="Estadísticas" />}
    </Tabs>
  );
};

export default TaskManagementTabs;
