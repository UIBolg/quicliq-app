import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/Icon';

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn('grid size-6 shrink-0 cursor-pointer place-items-center rounded-xs border-[1.5px] border-silver bg-white outline-none focus-visible:ring-2 focus-visible:ring-ink data-[state=checked]:border-red data-[state=checked]:bg-red', className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="text-white">
        <Icon name="check" size={16} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
