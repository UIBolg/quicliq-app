import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** shadcn/ui Button with the Quicliq variants (Figma Button 12:16): Large 56 full width, Small 32. */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:pointer-events-none cursor-pointer select-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-red-shade active:bg-red-shade disabled:bg-dark-fog disabled:text-silver',
        secondary: 'bg-white text-ink border-[1.5px] border-silver hover:bg-fog active:bg-dark-fog',
        ghost: 'bg-transparent text-red hover:bg-red-4 active:bg-red-10',
        tonal: 'bg-red-10 text-red hover:bg-red-12',
        link: 'text-red underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-14 w-full rounded-md px-6 text-title',
        sm: 'h-8 rounded-full px-3 text-body-md',
        icon: 'size-10 rounded-full',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
