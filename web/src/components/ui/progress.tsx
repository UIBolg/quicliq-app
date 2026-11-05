import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

/** Progress bar; the fill grows from the start side (right in Arabic). */
function Progress({ className, value, indicatorClassName, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }) {
  return (
    <ProgressPrimitive.Root data-slot="progress" className={cn('relative h-1 w-full overflow-hidden rounded-full bg-dark-fog', className)} {...props}>
      <ProgressPrimitive.Indicator className={cn('h-full rounded-full bg-red transition-all', indicatorClassName)} style={{ width: `${Math.max(4, value ?? 0)}%` }} />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
