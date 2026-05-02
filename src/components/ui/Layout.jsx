import { cn } from '../../utils/cn';

export function Section({ className, children, ...props }) {
  return (
    <section
      className={cn('py-6 md:py-8', className)}
      {...props}
    >
      {children}
    </section>
  );
}

export function Container({ className, children, ...props }) {
  return (
    <div
      className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function GridStack({ className, children, gap = 'gap-6', ...props }) {
  return (
    <div
      className={cn('flex flex-col', gap, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Grid({ className, children, cols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', gap = 'gap-6', ...props }) {
  return (
    <div
      className={cn('grid', cols, gap, className)}
      {...props}
    >
      {children}
    </div>
  );
}
