/** Icon set from the Expo app (src/assets/icons.generated.ts, Figma "Icons" page). Uses currentColor; directional icons mirror in RTL. */
import { iconXml } from '@shared/assets/icons.generated';
import { cn } from '@/lib/utils';

export type IconName = keyof typeof iconXml;
const DIRECTIONAL = new Set(['arrowLeft', 'arrowRight', 'chevronLeft', 'chevronRight', 'arrowUpRight', 'send']);

export function Icon({ name, size = 24, className, label }: { name: IconName | string; size?: number; className?: string; label?: string }) {
  const xml = iconXml[name as IconName] ?? '';
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('inline-block shrink-0 [&>svg]:size-full', DIRECTIONAL.has(name) && 'rtl:-scale-x-100', className)}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: xml }}
    />
  );
}
