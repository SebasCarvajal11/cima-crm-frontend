import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-primary text-white hover:bg-brand-primary-light focus-visible:ring-brand-primary',
        secondary: 'bg-brand-secondary text-white hover:bg-brand-secondary-light focus-visible:ring-brand-secondary',
        outline: 'border border-brand-primary text-brand-primary hover:bg-brand-primary/10 focus-visible:ring-brand-primary',
        ghost: 'text-brand-primary hover:bg-brand-primary/10 focus-visible:ring-brand-primary',
        danger: 'bg-error text-white hover:bg-error/90 focus-visible:ring-error',
        success: 'bg-success text-white hover:bg-success/90 focus-visible:ring-success',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export function Button({ className, variant, size, children, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
