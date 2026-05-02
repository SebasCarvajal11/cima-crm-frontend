import { Tabs, Tab } from '@mui/material';

const TaskManagementTabs = ({ tabValue, onTabChange, isAdmin }) => {
  return (
    <Tabs
      value={tabValue}
      onChange={onTabChange}
      variant="fullWidth"
      className="bg-white rounded-lg mb-6 shadow-sm"
      sx={{
        '& .MuiTab-root': {
          color: 'var(--color-brand-primary)',
          '&:hover': { color: 'var(--color-brand-primary-light)' },
          '&.Mui-selected': { color: 'var(--color-brand-primary-light)' },
        },
        '& .MuiTabs-indicator': { backgroundColor: 'var(--color-brand-primary-light)' },
      }}
    >
      <Tab label="Gestión de Tareas" />
      {isAdmin && <Tab label="Estadísticas" />}
    </Tabs>
  );
};

export default TaskManagementTabs;
