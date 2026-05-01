import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const statusChipVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      status: {
        Admin: 'bg-brand-primary-light/10 text-brand-primary-light',
        Worker: 'bg-brand-primary/10 text-brand-primary',
        Client: 'bg-error/10 text-error',
        Active: 'bg-success/10 text-success',
        Inactive: 'bg-gray-100 text-gray-600',
        Pending: 'bg-warning/10 text-warning',
        Completed: 'bg-success/10 text-success',
        'In Progress': 'bg-info/10 text-info',
        Delayed: 'bg-error/10 text-error',
      },
      size: {
        small: 'text-[0.7rem] px-2 py-0.5',
        medium: 'text-xs px-2.5 py-1',
      },
    },
    defaultVariants: {
      status: 'Active',
      size: 'medium',
    },
  }
);

export function StatusChip({ status, size, label, className, children, ...props }) {
  return (
    <span
      className={cn(statusChipVariants({ status, size }), className)}
      {...props}
    >
      {children || label || status}
    </span>
  );
}
