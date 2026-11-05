import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption whitespace-nowrap', {
  variants: {
    variant: {
      success: 'bg-success-light text-success',
      warning: 'bg-info-light text-info',
      neutral: 'bg-fog text-slate',
      red: 'bg-red-10 text-red',
    },
  },
  defaultVariants: { variant: 'neutral' },
});

function Badge({ className, variant, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
