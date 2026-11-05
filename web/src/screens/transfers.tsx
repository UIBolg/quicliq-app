/** Transfers history (11.1): search, Status / Sending type / Date filters, cards grouped by month. */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { demoToday } from '@shared/mock/account';
import { useTransfers, type Transfer } from '@/lib/transfers';
import { formatMoney } from '@shared/utils/format';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { RadioGroup, RadioOption } from '@/components/ui/radio-group';
import { Icon } from '@/components/Icon';
import { FilterChip, Screen, TabBar, TransferCard, type TransferCardProps } from '@/components/quicliq';
import { cn } from '@/lib/utils';
import { useLocale } from '@/i18n';

export const transferCard = (tx: Transfer, t: TFunction): TransferCardProps => ({
  name: t(`home.recipientNames.${tx.recipient}`),
  method: tx.method,
  methodLabel: t(`home.methods.${tx.method}`),
  date: tx.date,
  amount: formatMoney(Number(tx.amount), 'GBP', { decimals: 'always' }),
  status: tx.status,
  statusLabel: t(`home.status.${tx.status}`),
});

const OPTIONS = { status: ['all', 'pending', 'processing', 'stopped', 'delivered'], type: ['all', 'bank', 'cash'] } as const;
type Group = keyof typeof OPTIONS;

export function History() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const nav = useNavigate();
  const k = 'activity';
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState<{ status: string; type: string }>({ status: 'all', type: 'all' });
  const [open, setOpen] = useState<Group | 'date' | null>(null);
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);
  const [draft, setDraft] = useState({ from: '', to: '' });
  const [month, setMonth] = useState(demoToday.slice(0, 7));
  const items = useTransfers()
    .map((tx) => ({ tx, card: transferCard(tx, t) }))
    .filter((x) => !q.trim() || x.card.name.toLowerCase().includes(q.trim().toLowerCase()))
    .filter(({ tx }) => picked.status === 'all' || tx.status === picked.status || (picked.status === 'stopped' && (tx.status === 'rejected' || tx.status === 'cancelled')))
    .filter(({ tx }) => picked.type === 'all' || tx.method === picked.type)
    .filter(({ tx }) => !range || (tx.on >= range.from && tx.on <= range.to));
  const months = [...new Set(items.map((x) => x.tx.month))];
  const fmt = (iso: string) => new Intl.DateTimeFormat(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short' }).format(new Date(iso));
  return (
    <>
      <Screen className="gap-4 px-6 pt-4 pb-28">
        <h1 className="text-h2">{t(`${k}.title`)}</h1>
        <label className="flex h-14 items-center gap-2 rounded-md bg-fog px-4 focus-within:ring-[1.5px] focus-within:ring-ink">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(`${k}.search`)} aria-label={t(`${k}.search`)} className="flex-1 bg-transparent text-body-lg outline-none placeholder:text-slate" />
          <Icon name="search" size={20} className="text-slate" />
        </label>
        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 no-scrollbar">
          <FilterChip label={range ? `${fmt(range.from)} – ${fmt(range.to)}` : t(`${k}.groups.date`)} selected={!!range} onClick={() => { setDraft(range ?? { from: '', to: '' }); setMonth((range?.from ?? demoToday).slice(0, 7)); setOpen('date'); }} />
          {(Object.keys(OPTIONS) as Group[]).map((g) => (
            <FilterChip key={g} label={picked[g] === 'all' ? t(`${k}.groups.${g}`) : t(`${k}.options.${g}.${picked[g]}`)} selected={picked[g] !== 'all'} onClick={() => setOpen(g)} />
          ))}
        </div>
        {months.length === 0 ? <p className="py-12 text-center text-body text-slate">{t(`${k}.empty`)}</p> : null}
        {months.map((m) => (
          <section key={m} className="flex flex-col gap-2">
            <h2 className="text-overline text-slate">{t(`${k}.months.${m}`)}</h2>
            {items.filter((x) => x.tx.month === m).map(({ tx, card }) => <TransferCard key={tx.id} {...card} onClick={() => nav(`/history/${tx.id}`)} />)}
          </section>
        ))}
      </Screen>
      <TabBar active="history" />
      <Sheet open={open === 'status' || open === 'type'} onOpenChange={(o) => !o && setOpen(null)}>
        {open === 'status' || open === 'type' ? (
          <SheetContent title={t(`${k}.groups.${open}`)}>
            <SheetHead title={t(`${k}.groups.${open}`)} subtitle={t(`${k}.hints.${open}`)} onClose={() => setOpen(null)} />
            <RadioGroup value={picked[open]} onValueChange={(v) => { setPicked((p) => ({ ...p, [open]: v })); setOpen(null); }}>
              {OPTIONS[open].map((o) => <RadioOption key={o} value={o} title={t(`${k}.options.${open}.${o}`)} />)}
            </RadioGroup>
          </SheetContent>
        ) : null}
      </Sheet>
      <Sheet open={open === 'date'} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent title={t(`${k}.groups.date`)}>
          <SheetHead title={t(`${k}.groups.date`)} subtitle={t(`${k}.pickRange`)} onClose={() => setOpen(null)} />
          <RangeCalendar month={month} onMonth={setMonth} from={draft.from} to={draft.to} max={demoToday} onChange={(from, to) => setDraft({ from, to })} />
          <p className="text-center text-body text-slate">{draft.from ? `${fmt(draft.from)} – ${fmt(draft.to || draft.from)}` : t(`${k}.pickRange`)}</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => { setRange(null); setOpen(null); }}>{t(`${k}.clear`)}</Button>
            <Button disabled={!draft.from} onClick={() => { setRange({ from: draft.from, to: draft.to || draft.from }); setOpen(null); }}>{t(`${k}.apply`)}</Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/** Sheet Header (Figma 69:461): H3 title, Primary/Red body subtitle, 32 Fog close button. */
function SheetHead({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-1 flex-col gap-0.5"><h2 className="text-h3">{title}</h2><p className="text-body text-red">{subtitle}</p></div>
      <button onClick={onClose} aria-label={t('common.close')} className="grid size-8 cursor-pointer place-items-center rounded-full bg-fog hover:bg-dark-fog"><Icon name="x" size={16} /></button>
    </div>
  );
}

/** Date range calendar (Figma 69:1650): month header with 40 Fog arrows, Mon-first weekdays (Caption Slate),
 *  44-high day cells; start / end = 40 Primary/Red circle with white digit, days between = Alpha/Red 8% band. */
function RangeCalendar({ month, onMonth, from, to, max, onChange }: { month: string; onMonth: (m: string) => void; from: string; to: string; max: string; onChange: (from: string, to: string) => void }) {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const [y, m] = month.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  const iso = (d: number) => `${month}-${String(d).padStart(2, '0')}`;
  const shift = (n: number) => { const d = new Date(Date.UTC(y, m - 1 + n, 1)); onMonth(d.toISOString().slice(0, 7)); };
  const title = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first);
  const weekdays = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en-GB', { weekday: 'narrow', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i))));
  const pick = (d: string) => {
    if (!from || to || d < from) onChange(d, '');
    else onChange(from, d);
  };
  const end = to || from;
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <button onClick={() => shift(-1)} aria-label={t('activity.prevMonth')} className="grid size-10 cursor-pointer place-items-center rounded-full bg-fog hover:bg-dark-fog"><Icon name="chevronLeft" size={24} /></button>
        <span className="text-title">{title}</span>
        <button onClick={() => shift(1)} disabled={`${month}-01` > max} aria-label={t('activity.nextMonth')} className="grid size-10 cursor-pointer place-items-center rounded-full bg-fog hover:bg-dark-fog disabled:opacity-40"><Icon name="chevronRight" size={24} /></button>
      </div>
      <div className="grid grid-cols-7">{weekdays.map((w, i) => <span key={i} className="text-center text-caption text-slate">{w}</span>)}</div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (!d) return <span key={i} className="h-11" />;
          const v = iso(d);
          const edge = v === from || v === end;
          const inRange = !!from && !!to && v > from && v < to;
          const band = !!from && !!to && from !== to && (inRange || (v === from && v < to) || (v === to && v > from));
          const disabled = v > max;
          return (
            <span key={i} className={cn('flex h-11 items-center justify-center', band && 'bg-red-8', band && v === from && 'ltr:rounded-l-full rtl:rounded-r-full', band && v === to && 'ltr:rounded-r-full rtl:rounded-l-full')}>
              <button disabled={disabled} onClick={() => pick(v)} aria-pressed={edge} className={cn('grid size-10 cursor-pointer place-items-center rounded-full text-body-md disabled:cursor-default disabled:text-silver', edge ? 'bg-red text-white' : 'text-ink hover:bg-fog')} style={{ fontFamily: 'var(--font-en)' }}>{d}</button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
