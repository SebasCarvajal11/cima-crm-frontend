import { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useCreateFaqMutation } from '../../../redux/api';
import { useNotification } from '../../../hooks/useNotification';
import { MESSAGES } from '../../../constants';

export default function FaqForm({ onCreated }) {
  const notify = useNotification();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [createFaq, { isLoading }] = useCreateFaqMutation();

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) {
      notify.warning('Por favor, completa todos los campos');
      return;
    }

    try {
      await createFaq({ question, answer }).unwrap();
      setQuestion('');
      setAnswer('');
      notify.success(MESSAGES.SUCCESS.FAQ.CREATE);
      if (onCreated) onCreated();
    } catch (err) {
      notify.error(MESSAGES.ERROR.FAQ.CREATE, err);
    }
  };

  return (
    <Paper className="mb-6 bg-white rounded-xl fluid-padding shadow-md border-l-4 border-info">
      <Typography variant="h6" component="h2" gutterBottom>
        <AddIcon /> Añadir Nueva Pregunta Frecuente
      </Typography>
      <TextField
        fullWidth
        label="Pregunta"
        variant="outlined"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        margin="normal"
        placeholder="Escribe la pregunta aquí..."
      />
      <TextField
        fullWidth
        label="Respuesta"
        variant="outlined"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        margin="normal"
        multiline
        rows={4}
        placeholder="Escribe la respuesta detallada aquí..."
      />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={isLoading ? <CircularProgress size={20} /> : <AddIcon />}
          onClick={handleSubmit}
          disabled={isLoading || !question.trim() || !answer.trim()}
        >
          Añadir Pregunta
        </Button>
      </Box>
    </Paper>
  );
}
