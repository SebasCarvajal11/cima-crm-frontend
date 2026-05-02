import { Paper, Tabs, Tab } from '@mui/material';
import {
  QuestionAnswer as FaqIcon,
  Add as AddIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { FaqProvider, useFaq } from '../../context/FaqContext';
import { PageHeader } from '../ui';
import FaqStats from './components/FaqStats';
import FaqFilters from './components/FaqFilters';
import FaqList from './components/FaqList';
import FaqForm from './components/FaqForm';
import FaqDeleteDialog from './components/FaqDeleteDialog';

const FaqAdminContent = () => {
  const { tabValue, setTabValue } = useFaq();

  return (
    <div className="mx-auto max-w-6xl bg-gray-50 rounded-xl shadow-sm fluid-padding-lg">
      <PageHeader
        icon={HelpOutlineIcon}
        title="Gestión de Preguntas Frecuentes"
        subtitle="Administra las preguntas frecuentes para ayudar a tus usuarios"
      />

      <FaqStats />

      <Paper className="mb-6">
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

      <div hidden={tabValue !== 0}>
        <FaqFilters />
        <FaqList />
      </div>

      <div hidden={tabValue !== 1}>
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
