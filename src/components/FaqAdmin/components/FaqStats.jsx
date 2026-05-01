import { Typography } from '@mui/material';
import {
  QuestionAnswer as FaqIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import { useFaq } from '../../../context/FaqContext';

export default function FaqStats() {
  const { stats } = useFaq();

  return (
    <div className="faq-stats">
      <div className="faq-stat-card">
        <div className="stat-icon total">
          <FaqIcon />
        </div>
        <Typography variant="h3">{stats.total}</Typography>
        <Typography variant="body2">Total de preguntas</Typography>
      </div>
      <div className="faq-stat-card">
        <div className="stat-icon active">
          <CheckCircleIcon />
        </div>
        <Typography variant="h3">{stats.active}</Typography>
        <Typography variant="body2">Preguntas activas</Typography>
      </div>
      <div className="faq-stat-card">
        <div className="stat-icon draft">
          <PendingIcon />
        </div>
        <Typography variant="h3">{stats.draft}</Typography>
        <Typography variant="body2">Preguntas en borrador</Typography>
      </div>
    </div>
  );
}
