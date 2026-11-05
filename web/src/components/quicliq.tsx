/** Quicliq components (same specs as the Expo app's src/components), built on Tailwind tokens + shadcn/ui. */
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { limitCardArt, limitCardArtXml } from '@shared/assets/artwork/limitCard';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Icon, type IconName } from '@/components/Icon';
import { useLocale } from '@/i18n';
import { cn } from '@/lib/utils';

/** Scrollable screen body. */
export function Screen({ children, className, footer }: { children: ReactNode; className?: string; footer?: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Children keep their size (no flex shrink) so long pages scroll instead of squashing rows. */}
      <div className={cn('flex min-h-0 flex-1 flex-col overflow-y-auto no-scrollbar [&>*]:shrink-0', className)}>{children}</div>
      {footer}
    </div>
  );
}

export function IconButton({ icon, label, onClick, className, plain }: { icon: IconName; label: string; onClick?: () => void; className?: string; plain?: boolean }) {
  return (
    <button onClick={onClick} aria-label={label} className={cn('grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink outline-none hover:bg-dark-fog focus-visible:ring-2 focus-visible:ring-ink', !plain && 'bg-fog', className)}>
      <Icon name={icon} size={20} />
    </button>
  );
}

export function BackButton({ onClick }: { onClick?: () => void }) {
  const nav = useNavigate();
  const { t } = useTranslation();
  return <IconButton icon="arrowLeft" label={t('common.back')} onClick={onClick ?? (() => nav(-1))} />;
}

export function TopBar({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-3 px-6 pt-2 pb-4">
      <BackButton onClick={onBack} />
      <h1 className="flex-1 truncate text-center text-title text-ink">{title}</h1>
      <span className="size-10" aria-hidden />
    </div>
  );
}

/** Filled Text Field (Figma 21:250): Fog, 64 high, label inside above the value; focused = white + Ink outline; error = Failure. */
export function TextField({ label, value, onChange, type = 'text', error, helper, trailing, inputMode, autoComplete, dirLtr }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; error?: string; helper?: string; trailing?: ReactNode;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; autoComplete?: string; dirLtr?: boolean;
}) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const id = `f-${label.replace(/\W+/g, '-')}`;
  const isPw = type === 'password';
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={cn(
          'flex h-16 cursor-text items-center gap-2 rounded-md border-[1.5px] px-4 transition-colors',
          error ? 'border-failure bg-failure-light' : 'border-transparent bg-fog focus-within:border-ink focus-within:bg-white',
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col">
          <span className={cn('text-caption', error ? 'text-failure' : 'text-slate')}>{label}</span>
          <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} type={isPw && !show ? 'password' : isPw ? 'text' : type} inputMode={inputMode} autoComplete={autoComplete} aria-invalid={!!error} dir={dirLtr ? 'ltr' : undefined} className={cn(dirLtr && 'rtl:text-right')} />
        </span>
        {isPw ? (
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={t(show ? 'common.hidePassword' : 'common.showPassword')} className="grid size-11 cursor-pointer place-items-center text-slate">
            <Icon name="eye" size={20} />
          </button>
        ) : trailing}
      </label>
      {error ? <p className="flex items-center gap-1 text-caption text-failure"><Icon name="alert" size={14} />{error}</p> : helper ? <p className="text-caption text-slate">{helper}</p> : null}
    </div>
  );
}

export function Banner({ type = 'info', icon, children }: { type?: 'info' | 'error' | 'security' | 'success'; icon?: IconName; children: ReactNode }) {
  const look = {
    info: ['bg-fog text-ink', 'info'],
    error: ['bg-failure-light text-failure-dark', 'alert'],
    security: ['bg-failure-light text-failure-dark', 'lock'],
    success: ['bg-success-light text-success-dark', 'check'],
  }[type];
  return (
    <div role={type === 'error' || type === 'security' ? 'alert' : undefined} className={cn('flex items-start gap-2 rounded-md p-4 text-body', look[0])}>
      <Icon name={icon ?? look[1]} size={20} className="mt-px" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

/** Home "Verify your ID and address" alert (Info blue). */
export function ActionBanner({ icon, title, message, onClick }: { icon: IconName; title: string; message?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-md bg-info-light p-3 text-start text-info-dark outline-none hover:brightness-[0.98] focus-visible:ring-2 focus-visible:ring-ink">
      <Icon name={icon} size={20} className="text-info" />
      <span className="flex-1 text-body"><span className="text-body-md">{title}</span>{message ? ` ${message}` : ''}</span>
      <Icon name="chevronRight" size={16} />
    </button>
  );
}

export function IconBadge({ icon, size = 40, tone = 'redTint' }: { icon: IconName; size?: 32 | 40 | 56; tone?: 'redTint' | 'white' | 'success' | 'grey' }) {
  const toneCls = { redTint: 'bg-red-10 text-red', white: 'bg-white text-ink', success: 'bg-success text-white', grey: 'bg-dark-fog text-slate' }[tone];
  return <span className={cn('grid shrink-0 place-items-center rounded-full', toneCls)} style={{ width: size, height: size }}><Icon name={icon} size={size >= 56 ? 28 : size >= 40 ? 20 : 16} /></span>;
}

export function Avatar({ initials, tone = 'tint', size = 56 }: { initials: string; tone?: 'brand' | 'tint'; size?: 44 | 56 }) {
  return (
    <span className={cn('grid shrink-0 place-items-center rounded-full font-[900]', tone === 'brand' ? 'bg-red text-white' : 'bg-red-10 text-red', size === 56 ? 'text-title' : 'text-body-md')} style={{ width: size, height: size, fontFamily: 'var(--font-en)' }}>
      {initials}
    </span>
  );
}

export function ListGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      {title ? <h2 className="text-overline text-slate">{title}</h2> : null}
      <div className="overflow-hidden rounded-lg bg-fog">{children}</div>
    </section>
  );
}

export function ListRow({ icon, title, subtitle, value, onClick, danger, trailing }: { icon: IconName; title: string; subtitle?: string; value?: string; onClick?: () => void; danger?: boolean; trailing?: ReactNode }) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp onClick={onClick} className={cn('flex min-h-14 w-full items-center gap-3 border-b border-dark-fog px-4 py-3 text-start last:border-b-0', onClick && 'cursor-pointer hover:bg-dark-fog')}>
      <IconBadge icon={icon} size={40} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn('text-body-md', danger ? 'text-red' : 'text-ink')}>{title}</span>
        {subtitle ? <span className="text-caption text-slate">{subtitle}</span> : null}
      </span>
      {value ? <span className="text-body text-slate">{value}</span> : null}
      {trailing ?? (onClick ? <Icon name="chevronRight" size={16} className="text-slate" /> : null)}
    </Comp>
  );
}

/** Limit Card — 3 level looks (Basic light red, Plus red, Premium burgundy), plane artwork at the end side. */
export function LimitCard({ level, label, amount, caption, value, levelName, onClick }: { level: 1 | 2 | 3; label: string; amount: string; caption: string; value: number; levelName: string; onClick?: () => void }) {
  const { isRTL } = useLocale();
  const look = {
    1: { card: 'bg-red-10 border border-red-12 text-ink', sub: 'text-slate', tag: 'bg-red-12 text-red', art: { glow: '#E0101814', trail: '#E0101840', plane: '#E01018', planeShade: '#B80D14', coin: '#E01018', coinText: '#FFFFFF' }, bar: 'bg-red-12', fill: 'bg-red' },
    2: { card: 'bg-red text-white', sub: 'text-white-80', tag: 'bg-white-20 text-white', art: { glow: '#FFFFFF24', trail: '#FFFFFF80', plane: '#FFFFFF', planeShade: '#FFFFFFB3', coin: '#FFFFFF', coinText: '#E01018' }, bar: 'bg-white-20', fill: 'bg-white' },
    3: { card: 'bg-failure-dark text-white', sub: 'text-white-80', tag: 'bg-red text-white', art: { glow: '#E0101840', trail: '#FFFFFF80', plane: '#FFFFFF', planeShade: '#FFFFFFB3', coin: '#FFFFFF', coinText: '#7A1A12' }, bar: '', fill: '' },
  }[level];
  return (
    <button onClick={onClick} className={cn('relative flex h-[132px] w-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl p-5 text-start outline-none focus-visible:ring-2 focus-visible:ring-ink', look.card)}>
      <span aria-hidden className="pointer-events-none absolute -top-2.5 ltr:-right-6 rtl:-left-6" style={{ width: limitCardArt.width, height: limitCardArt.height }} dangerouslySetInnerHTML={{ __html: limitCardArtXml(look.art, 'Avenir', isRTL) }} />
      <span className="relative flex flex-col gap-0.5">
        <span className={cn('flex items-center gap-2 text-body', look.sub)}>{label}<span className={cn('rounded-full px-2 py-0.5 text-caption', look.tag)}>{levelName}</span></span>
        <span className="text-numeric-l" dir="ltr" style={{ textAlign: isRTL ? 'right' : 'left' }}>{amount}</span>
      </span>
      <span className="relative flex w-[170px] flex-col gap-1.5">
        {level < 3 ? <Progress value={value} className={cn('h-1', look.bar)} indicatorClassName={look.fill} /> : null}
        <span className={cn('text-caption', look.sub)}>{caption}</span>
      </span>
    </button>
  );
}

export type TransferCardProps = { name: string; method: 'bank' | 'cash'; methodLabel: string; date: string; amount: string; status: 'delivered' | 'processing'; statusLabel: string; onClick?: () => void };
export function TransferCard({ name, method, methodLabel, date, amount, status, statusLabel, onClick }: TransferCardProps) {
  return (
    <button onClick={onClick} className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-dark-fog bg-fog p-3 text-start hover:bg-dark-fog">
      <IconBadge icon={method === 'bank' ? 'bank' : 'cash'} size={40} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body-md text-ink">{name}</span>
        <span className="text-caption text-slate">{methodLabel} · {date}</span>
      </span>
      <span className="flex flex-col items-end gap-1">
        <span className="text-body-md text-ink" dir="ltr" style={{ fontFamily: 'var(--font-en)' }}>{amount}</span>
        <span className={cn('rounded-full px-2 text-caption', status === 'delivered' ? 'bg-success-light text-success' : 'text-slate')}>{statusLabel}</span>
      </span>
    </button>
  );
}

export function FilterChip({ label, selected, onClick }: { label: string; selected?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={selected} className={cn('flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-full border px-3 text-body-md', selected ? 'border-red bg-red text-white' : 'border-dark-fog bg-white text-ink hover:bg-fog')}>
      {label}
      <Icon name="chevronDown" size={16} />
    </button>
  );
}

/** Floating light tab bar: Home · Send · Transfers history · Account. */
export function TabBar({ active }: { active: 'home' | 'send' | 'history' | 'profile' }) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const items: { key: typeof active; icon: IconName; to: string }[] = [
    { key: 'home', icon: 'home', to: '/home' },
    { key: 'send', icon: 'send', to: '/soon/Send money' },
    { key: 'history', icon: 'history', to: '/history' },
    { key: 'profile', icon: 'user', to: '/account' },
  ];
  return (
    <nav className="absolute inset-x-4 bottom-4 z-30 flex items-center justify-around rounded-full bg-white px-4 py-2 shadow-[0_8px_24px_rgba(23,23,23,0.12)]" aria-label="Main">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => nav(it.to)}
          aria-label={t(`home.tabs.${it.key}`)}
          aria-current={active === it.key ? 'page' : undefined}
          className={cn('grid size-12 cursor-pointer place-items-center rounded-full', active === it.key ? 'bg-red text-white' : 'text-slate hover:bg-fog')}
        >
          <Icon name={it.icon} size={24} />
        </button>
      ))}
    </nav>
  );
}
