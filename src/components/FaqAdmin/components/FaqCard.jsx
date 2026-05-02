import { useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, Chip, CircularProgress } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useUpdateFaqMutation } from '../../../redux/api';
import { useNotification } from '../../../hooks/useNotification';
import { MESSAGES } from '../../../constants';

export default function FaqCard({ faq, onDelete }) {
  const notify = useNotification();
  const [updateFaq, { isLoading }] = useUpdateFaqMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const handleEdit = () => {
    setEditQuestion(faq.question || '');
    setEditAnswer(faq.answer || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditQuestion('');
    setEditAnswer('');
  };

  const handleSave = async () => {
    if (!editQuestion.trim() || !editAnswer.trim()) {
      notify.warning('Por favor, completa todos los campos');
      return;
    }

    try {
      await updateFaq({ id: faq.faqId, question: editQuestion, answer: editAnswer }).unwrap();
      setIsEditing(false);
      notify.success(MESSAGES.SUCCESS.FAQ.UPDATE);
    } catch (err) {
      notify.error(MESSAGES.ERROR.FAQ.UPDATE, err);
    }
  };

  if (isEditing) {
    return (
      <Card className="transition-all bg-white rounded-xl overflow-hidden shadow-sm border-t-3 border-gray-200">
        <CardContent className="mb-6 bg-white rounded-xl fluid-padding shadow-md border-l-4 border-info">
          <Typography variant="h6" gutterBottom>Editar Pregunta</Typography>
          <TextField
            fullWidth
            label="Pregunta"
            variant="outlined"
            value={editQuestion}
            onChange={(e) => setEditQuestion(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Respuesta"
            variant="outlined"
            value={editAnswer}
            onChange={(e) => setEditAnswer(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
          <div className="flex mt-4 justify-end border-t border-gray-100 pt-4">
            <Button
              variant="contained"
              color="primary"
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={isLoading}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              sx={{ ml: 1 }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all bg-white rounded-xl overflow-hidden shadow-sm border-t-3 border-gray-200 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="fluid-padding">
        <Chip
          label={faq.isDeleted ? 'Borrador' : 'Activa'}
          color={faq.isDeleted ? 'default' : 'success'}
          size="small"
          className="mb-3"
        />
        <Typography variant="h6" component="h2" className="text-gray-800 font-semibold mb-3">{faq.question}</Typography>
        <Typography variant="body1" component="p" className="text-gray-600 whitespace-pre-line leading-relaxed">{faq.answer}</Typography>
        <div className="flex mt-4 justify-end border-t border-gray-100 pt-4">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            size="small"
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(faq.faqId)}
            size="small"
            sx={{ ml: 1 }}
          >
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
