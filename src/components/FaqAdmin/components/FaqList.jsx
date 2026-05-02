import { CircularProgress, Typography, Alert } from '@mui/material';
import { Help as HelpIcon } from '@mui/icons-material';
import FaqCard from './FaqCard';

export default function FaqList({ faqs, isLoading, error, searchTerm, setDeleteDialogOpen, setFaqToDelete }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>Error al cargar las preguntas frecuentes</Alert>;
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm">
        <HelpIcon className="text-5xl mb-4 text-gray-400" />
        <Typography variant="h6" className="text-lg mb-2 text-gray-800">No se encontraron preguntas</Typography>
        <Typography variant="body2" className="text-sm max-w-sm mx-auto">
          {searchTerm
            ? 'Intenta con otra búsqueda o'
            : 'Comienza'}{' '}
          añadiendo una nueva pregunta frecuente.
        </Typography>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 fluid-gap-lg">
      {faqs.map((faq) => (
        <FaqCard
          key={faq.faqId}
          faq={faq}
          onDelete={(id) => {
            setFaqToDelete(id);
            setDeleteDialogOpen(true);
          }}
        />
      ))}
    </div>
  );
}
