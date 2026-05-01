import { CircularProgress, Typography, Alert } from '@mui/material';
import { Help as HelpIcon } from '@mui/icons-material';
import { useFaq } from '../../../context/FaqContext';
import FaqCard from './FaqCard';

export default function FaqList() {
  const { loading, error, filteredFaqs, searchTerm } = useFaq();

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (filteredFaqs.length === 0) {
    return (
      <div className="faq-empty-state">
        <HelpIcon />
        <Typography variant="h6">No se encontraron preguntas</Typography>
        <Typography variant="body2">
          {searchTerm
            ? 'Intenta con otra búsqueda o'
            : 'Comienza'}{' '}
          añadiendo una nueva pregunta frecuente.
        </Typography>
      </div>
    );
  }

  return (
    <div className="faq-list">
      {filteredFaqs.map((faq) => (
        <FaqCard key={faq.faqId} faq={faq} />
      ))}
    </div>
  );
}
