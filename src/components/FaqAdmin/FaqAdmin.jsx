import { Typography, Paper, Tabs, Tab } from '@mui/material';
import {
  QuestionAnswer as FaqIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import './FaqAdmin.css';
import { FaqProvider, useFaq } from '../../context/FaqContext';
import FaqStats from './components/FaqStats';
import FaqFilters from './components/FaqFilters';
import FaqList from './components/FaqList';
import FaqForm from './components/FaqForm';
import FaqDeleteDialog from './components/FaqDeleteDialog';

const FaqAdminContent = () => {
  const { tabValue, setTabValue } = useFaq();

  return (
    <div className="faq-admin-container">
      <div className="faq-admin-header">
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Preguntas Frecuentes
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Administra las preguntas frecuentes para ayudar a tus usuarios
        </Typography>
      </div>

      <FaqStats />

      <Paper className="faq-tabs">
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Todas las preguntas" icon={<FaqIcon />} />
          <Tab label="Añadir nueva pregunta" icon={<AddIcon />} />
        </Tabs>
      </Paper>

      <div className="faq-tab-panel" hidden={tabValue !== 0}>
        <FaqFilters />
        <FaqList />
      </div>

      <div className="faq-tab-panel" hidden={tabValue !== 1}>
        <FaqForm />
      </div>

      <FaqDeleteDialog />
    </div>
  );
};

const FaqAdmin = () => (
  <FaqProvider>
    <FaqAdminContent />
  </FaqProvider>
);

export default FaqAdmin;
