/** Transfers history (11.1): search, Status / Sending type / Date filters, cards grouped by month. */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { demoToday, demoTransfers } from '@shared/mock/account';
import { formatMoney } from '@shared/utils/format';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { RadioGroup, RadioOption } from '@/components/ui/radio-group';
import { Icon } from '@/components/Icon';
import { FilterChip, Screen, TabBar, TransferCard, type TransferCardProps } from '@/components/quicliq';
import { useLocale } from '@/i18n';

type Tx = (typeof demoTransfers)[number];
export const transferCard = (tx: Tx, t: TFunction): TransferCardProps => ({
  name: t(`home.recipientNames.${tx.recipient}`),
  method: tx.method,
  methodLabel: t(`home.methods.${tx.method}`),
  date: tx.date,
  amount: formatMoney(Number(tx.amount), 'GBP', { decimals: 'always' }),
  status: tx.status,
  statusLabel: t(`home.status.${tx.status}`),
});

const OPTIONS = { status: ['all', 'processing', 'delivered'], type: ['all', 'bank', 'cash'] } as const;
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
  const items = demoTransfers
    .map((tx) => ({ tx, card: transferCard(tx, t) }))
    .filter((x) => !q.trim() || x.card.name.toLowerCase().includes(q.trim().toLowerCase()))
    .filter(({ tx }) => picked.status === 'all' || tx.status === picked.status)
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
          {(Object.keys(OPTIONS) as Group[]).map((g) => (
            <FilterChip key={g} label={picked[g] === 'all' ? t(`${k}.groups.${g}`) : t(`${k}.options.${g}.${picked[g]}`)} selected={picked[g] !== 'all'} onClick={() => setOpen(g)} />
          ))}
          <FilterChip label={range ? `${fmt(range.from)} – ${fmt(range.to)}` : t(`${k}.groups.date`)} selected={!!range} onClick={() => { setDraft(range ?? { from: '', to: '' }); setOpen('date'); }} />
        </div>
        {months.length === 0 ? <p className="py-12 text-center text-body text-slate">{t(`${k}.empty`)}</p> : null}
        {months.map((m) => (
          <section key={m} className="flex flex-col gap-2">
            <h2 className="text-overline text-slate">{t(`${k}.months.${m}`)}</h2>
            {items.filter((x) => x.tx.month === m).map(({ tx, card }) => <TransferCard key={tx.id} {...card} onClick={() => nav('/soon/11.3')} />)}
          </section>
        ))}
      </Screen>
      <TabBar active="history" />
      <Sheet open={open === 'status' || open === 'type'} onOpenChange={(o) => !o && setOpen(null)}>
        {open === 'status' || open === 'type' ? (
          <SheetContent title={t(`${k}.groups.${open}`)}>
            <h2 className="text-h3">{t(`${k}.groups.${open}`)}</h2>
            <RadioGroup value={picked[open]} onValueChange={(v) => { setPicked((p) => ({ ...p, [open]: v })); setOpen(null); }}>
              {OPTIONS[open].map((o) => <RadioOption key={o} value={o} title={t(`${k}.options.${open}.${o}`)} />)}
            </RadioGroup>
          </SheetContent>
        ) : null}
      </Sheet>
      <Sheet open={open === 'date'} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent title={t(`${k}.groups.date`)}>
          <h2 className="text-h3">{t(`${k}.groups.date`)}</h2>
          <p className="text-body text-slate">{t(`${k}.pickRange`)}</p>
          <div className="grid grid-cols-2 gap-3">
            {(['from', 'to'] as const).map((f) => (
              <input key={f} type="date" max={demoToday} value={draft[f]} onChange={(e) => setDraft((d) => ({ ...d, [f]: e.target.value }))} className="h-14 rounded-md bg-fog px-3 text-body-lg outline-none focus:ring-[1.5px] focus:ring-ink" dir="ltr" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => { setRange(null); setOpen(null); }}>{t(`${k}.clear`)}</Button>
            <Button disabled={!draft.from} onClick={() => { setRange({ from: draft.from, to: draft.to || draft.from }); setOpen(null); }}>{t(`${k}.apply`)}</Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
