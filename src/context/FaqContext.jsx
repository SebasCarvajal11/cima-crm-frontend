import { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { faqService } from '../services/faqService';
import logger from '../utils/logger';
import { useNotification } from '../hooks/useNotification';
import { MESSAGES } from '../constants';

const FaqContext = createContext();

export const FaqProvider = ({ children }) => {
  const notify = useNotification();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  const [editFaq, setEditFaq] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  const stats = useMemo(() => ({
    total: faqs.length,
    active: faqs.filter((faq) => !faq.isDeleted).length,
    draft: faqs.filter((faq) => faq.isDeleted).length,
  }), [faqs]);

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

  const fetchFaqs = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedFaqs = await faqService.getAllFaqs();
      setFaqs(fetchedFaqs || []);
      setError(null);
    } catch (err) {
      setError(MESSAGES.ERROR.FAQ.LOAD);
      logger.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleAddFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      notify.warning('Por favor, completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const newFaq = await faqService.createFaq({
        question: newQuestion,
        answer: newAnswer,
      });
      setFaqs((prev) => [...prev, newFaq]);
      setNewQuestion('');
      setNewAnswer('');
      notify.success(MESSAGES.SUCCESS.FAQ.CREATE);
    } catch (err) {
      notify.error(MESSAGES.ERROR.FAQ.CREATE, err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async () => {
    if (!faqToDelete) return;

    try {
      setLoading(true);
      await faqService.deleteFaq(faqToDelete);
      setFaqs((prev) => prev.filter((faq) => faq.faqId !== faqToDelete));
      notify.success(MESSAGES.SUCCESS.FAQ.DELETE);
    } catch (err) {
      notify.error(MESSAGES.ERROR.FAQ.DELETE, err);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    }
  };

  const handleEditFaq = (faq) => {
    const faqId = faq.faqId || faq._id;
    if (!faqId) {
      notify.error('No se puede editar esta pregunta (ID no encontrado)');
      return;
    }
    setEditFaq(faqId);
    setEditQuestion(faq.question || '');
    setEditAnswer(faq.answer || '');
  };

  const handleSaveFaq = async (id) => {
    if (!id) {
      notify.error('ID de pregunta no válido');
      return;
    }
    if (!editQuestion.trim() || !editAnswer.trim()) {
      notify.warning('Por favor, completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const updatedFaq = await faqService.updateFaq(id, {
        question: editQuestion,
        answer: editAnswer,
      });
      setFaqs((prev) =>
        prev.map((faq) => (faq._id === id ? { ...faq, ...updatedFaq } : faq))
      );
      setEditFaq(null);
      setEditQuestion('');
      setEditAnswer('');
      notify.success(MESSAGES.SUCCESS.FAQ.UPDATE);
    } catch (err) {
      notify.error(MESSAGES.ERROR.FAQ.UPDATE, err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditFaq(null);
    setEditQuestion('');
    setEditAnswer('');
  };

  const openDeleteDialog = (id) => {
    setFaqToDelete(id);
    setDeleteDialogOpen(true);
  };

  const value = {
    faqs,
    filteredFaqs,
    loading,
    error,
    stats,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    tabValue,
    setTabValue,
    editFaq,
    editQuestion,
    setEditQuestion,
    editAnswer,
    setEditAnswer,
    newQuestion,
    setNewQuestion,
    newAnswer,
    setNewAnswer,
    deleteDialogOpen,
    setDeleteDialogOpen,
    fetchFaqs,
    handleAddFaq,
    handleDeleteFaq,
    handleEditFaq,
    handleSaveFaq,
    handleCancelEdit,
    openDeleteDialog,
  };

  return <FaqContext.Provider value={value}>{children}</FaqContext.Provider>;
};

export const useFaq = () => {
  const context = useContext(FaqContext);
  if (!context) {
    throw new Error('useFaq debe ser usado dentro de un FaqProvider');
  }
  return context;
};
