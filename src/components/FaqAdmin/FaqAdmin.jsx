import { useState, useMemo } from 'react';
import { Paper, Tabs, Tab } from '@mui/material';
import {
  QuestionAnswer as FaqIcon,
  Add as AddIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { useGetAllFaqsQuery } from '../../redux/api';
import { PageHeader } from '../ui';
import FaqStats from './components/FaqStats';
import FaqFilters from './components/FaqFilters';
import FaqList from './components/FaqList';
import FaqForm from './components/FaqForm';
import FaqDeleteDialog from './components/FaqDeleteDialog';

const FaqAdmin = () => {
  const { data: faqs = [], isLoading, error } = useGetAllFaqsQuery();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  const filteredFaqs = useMemo(() => {
    let filtered = [...faqs];

    if (activeFilter === 'active') {
      filtered = filtered.filter((faq) => !faq.isDeleted);
    } else if (activeFilter === 'draft') {
      filtered = filtered.filter((faq) => faq.isDeleted);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(term) ||
          faq.answer.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [faqs, activeFilter, searchTerm]);

  const stats = useMemo(
    () => ({
      total: faqs.length,
      active: faqs.filter((faq) => !faq.isDeleted).length,
      draft: faqs.filter((faq) => faq.isDeleted).length,
    }),
    [faqs]
  );

  return (
    <div className="mx-auto max-w-6xl bg-gray-50 rounded-xl shadow-sm fluid-padding-lg">
      <PageHeader
        icon={HelpOutlineIcon}
        title="Gestión de Preguntas Frecuentes"
        subtitle="Administra las preguntas frecuentes para ayudar a tus usuarios"
      />

      <FaqStats stats={stats} />

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
        <FaqFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <FaqList
          faqs={filteredFaqs}
          isLoading={isLoading}
          error={error}
          searchTerm={searchTerm}
          setDeleteDialogOpen={setDeleteDialogOpen}
          setFaqToDelete={setFaqToDelete}
        />
      </div>

      <div hidden={tabValue !== 1}>
        <FaqForm onCreated={() => setTabValue(0)} />
      </div>

      <FaqDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        faqId={faqToDelete}
      />
    </div>
  );
};

export default FaqAdmin;
