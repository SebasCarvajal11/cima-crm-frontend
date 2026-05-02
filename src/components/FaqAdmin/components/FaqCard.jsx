import { Card, CardContent, Typography, Button, TextField, Chip } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useFaq } from '../../../context/FaqContext';

export default function FaqCard({ faq }) {
  const {
    editFaq,
    editQuestion, setEditQuestion,
    editAnswer, setEditAnswer,
    loading,
    handleEditFaq,
    handleSaveFaq,
    handleCancelEdit,
    openDeleteDialog,
  } = useFaq();

  const isEditing = editFaq === faq.faqId;

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
              startIcon={<SaveIcon />}
              onClick={() => handleSaveFaq(faq.faqId)}
              disabled={loading}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={handleCancelEdit}
              sx={{ ml: 1 }}
              disabled={loading}
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
            onClick={() => handleEditFaq(faq)}
            size="small"
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => openDeleteDialog(faq.faqId)}
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
