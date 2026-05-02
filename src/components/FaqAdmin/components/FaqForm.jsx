import { Paper, Typography, TextField, Button, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useFaq } from '../../../context/FaqContext';

export default function FaqForm() {
  const {
    newQuestion, setNewQuestion,
    newAnswer, setNewAnswer,
    loading,
    handleAddFaq,
  } = useFaq();

  return (
    <Paper className="mb-6 bg-white rounded-xl fluid-padding shadow-md border-l-4 border-info">
      <Typography variant="h6" component="h2" gutterBottom>
        <AddIcon /> Añadir Nueva Pregunta Frecuente
      </Typography>
      <TextField
        fullWidth
        label="Pregunta"
        variant="outlined"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        margin="normal"
        placeholder="Escribe la pregunta aquí..."
      />
      <TextField
        fullWidth
        label="Respuesta"
        variant="outlined"
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
        margin="normal"
        multiline
        rows={4}
        placeholder="Escribe la respuesta detallada aquí..."
      />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddFaq}
          disabled={loading || !newQuestion.trim() || !newAnswer.trim()}
        >
          Añadir Pregunta
        </Button>
      </Box>
    </Paper>
  );
}
