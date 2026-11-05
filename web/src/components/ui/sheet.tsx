import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

/** shadcn/ui Sheet, bottom side only (Quicliq Bottom Sheet: radius 3xl top, grabber, gutter 24). Portals into the phone frame. */
function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}
const SheetClose = SheetPrimitive.Close;

function SheetContent({ className, children, title, ...props }: React.ComponentProps<typeof SheetPrimitive.Content> & { title: string }) {
  const container = typeof document !== 'undefined' ? document.getElementById('phone') : null;
  return (
    <SheetPrimitive.Portal container={container}>
      <SheetPrimitive.Overlay className="absolute inset-0 z-40 bg-ink-50 data-[state=open]:animate-in data-[state=open]:fade-in" />
      <SheetPrimitive.Content
        aria-describedby={undefined}
        className={cn(
          'absolute inset-x-0 bottom-0 z-50 flex max-h-[90%] flex-col gap-4 overflow-y-auto rounded-t-3xl bg-white px-6 pt-4 pb-10 outline-none no-scrollbar',
          className,
        )}
        {...props}
      >
        <div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-silver" aria-hidden />
        <SheetPrimitive.Title className="sr-only">{title}</SheetPrimitive.Title>
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export { Sheet, SheetClose, SheetContent };
