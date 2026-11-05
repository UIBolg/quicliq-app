import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn('w-full min-w-0 bg-transparent text-body-lg text-ink outline-none placeholder:text-slate disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

export { Input };
