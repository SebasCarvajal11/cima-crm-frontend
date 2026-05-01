import { StatusChip as UiStatusChip } from '../ui/StatusChip';

const StatusChip = ({ label, status, size = 'medium' }) => (
  <UiStatusChip status={status} label={label} size={size} />
);

export default StatusChip;