import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils';

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid gap-3', className)} {...props} />;
}

/** Quicliq Radio Option: Fog card radius lg; selected = soft red tint fill + soft red border, filled red dot. */
function RadioOption({ className, title, subtitle, leading, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item> & { title: string; subtitle?: string; leading?: React.ReactNode }) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-lg border-[1.5px] border-transparent px-4 py-3 text-start outline-none focus-visible:ring-2 focus-visible:ring-ink data-[state=checked]:border-red-25 data-[state=checked]:bg-red-6',
        className,
      )}
      {...props}
    >
      {leading}
      <span className="flex flex-1 flex-col">
        <span className="text-body-md text-ink">{title}</span>
        {subtitle ? <span className="text-caption text-slate">{subtitle}</span> : null}
      </span>
      <span className="grid size-5 place-items-center rounded-full border-[1.5px] border-silver group-data-[state=checked]:border-red [[data-state=checked]_&]:border-red">
        <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-red" />
      </span>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioOption };
