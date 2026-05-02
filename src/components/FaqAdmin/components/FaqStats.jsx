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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 fluid-gap mb-6">
      <div className="bg-white rounded-xl fluid-padding shadow-sm text-center hover:-translate-y-1 hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-blue-50 text-blue-600">
          <FaqIcon />
        </div>
        <Typography variant="h3">{stats.total}</Typography>
        <Typography variant="body2" color="text.secondary">Total de preguntas</Typography>
      </div>
      <div className="bg-white rounded-xl fluid-padding shadow-sm text-center hover:-translate-y-1 hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-teal-50 text-teal-600">
          <CheckCircleIcon />
        </div>
        <Typography variant="h3">{stats.active}</Typography>
        <Typography variant="body2" color="text.secondary">Preguntas activas</Typography>
      </div>
      <div className="bg-white rounded-xl fluid-padding shadow-sm text-center hover:-translate-y-1 hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-gray-100 text-gray-500">
          <PendingIcon />
        </div>
        <Typography variant="h3">{stats.draft}</Typography>
        <Typography variant="body2" color="text.secondary">Preguntas en borrador</Typography>
      </div>
    </div>
  );
}
