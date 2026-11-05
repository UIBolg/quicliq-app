/** Transfer details (11.3): status header, progress timeline (every status with its time, current step, what's next,
 *  refund), payment details and status-based actions. No rejection / cancellation reason or pickup code is shown. */
import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoAccount, demoCards, demoToday } from '@shared/mock/account';
import { receiveAmount, statusFlow, type TransferStatus } from '@shared/mock/transfers';
import { formatAmount, formatMoney, ltr } from '@shared/utils/format';
import { flagXml } from '@shared/assets/flags.generated';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Icon } from '@/components/Icon';
import { Banner, IconBadge, IconButton, ListGroup, Screen, StatusPill, TopBar } from '@/components/quicliq';
import { Footer } from '@/components/forms';
import { cancelTransfer, useTransfers, type Transfer } from '@/lib/transfers';
import { useLocale } from '@/i18n';
import { cn } from '@/lib/utils';

const k = 'transfer';
type RowState = 'done' | 'failed' | 'current' | 'upcoming';
type Row = { step: TransferStatus; state: RowState; at?: string };

/** Pending → Processing → Delivered; a transfer that stops ends on Cancelled / Rejected (nothing upcoming after it). */
function timeline(tx: Transfer): Row[] {
  const ev = tx.detail.events;
  const rows: Row[] = ev.map((e, i) => ({
    step: e.status,
    at: e.at,
    state: e.status === 'rejected' || e.status === 'cancelled' ? 'failed' : i === ev.length - 1 && e.status !== 'delivered' ? 'current' : 'done',
  }));
  if (rows.some((r) => r.state === 'failed')) return rows;
  statusFlow.slice(statusFlow.indexOf(ev[ev.length - 1].status) + 1).forEach((step) => rows.push({ step, state: 'upcoming' }));
  return rows;
}

export function TransferDetails() {
  const { id = '' } = useParams();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const nav = useNavigate();
  const tx = useTransfers().find((x) => x.id === id);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  if (!tx) {
    return (
      <Screen>
        <TopBar title={t(`${k}.title`)} />
        <p className="px-4 py-12 text-center text-body text-slate">{t(`${k}.notFound`)}</p>
      </Screen>
    );
  }

  const d = tx.detail;
  const lang = locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB';
  const dayOnly = (iso: string) => new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short' }).format(new Date(iso));
  const dateTime = (iso: string) => new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso));
  const sent = Number(tx.amount);
  const card = demoCards.find((c) => c.id === d.cardId)!;
  const name = t(`home.recipientNames.${tx.recipient}`);
  const money = (n: number) => formatMoney(n, 'GBP', { decimals: 'always' });
  const vars = {
    name,
    amount: money(sent + d.fee),
    receive: formatMoney(receiveAmount(sent), 'JOD', { decimals: 'always' }),
    card: ltr(t(`${k}.cardValue`, { brand: card.brand, last4: card.last4 })),
    bank: 'bank' in d.payout ? t(`${k}.banks.${d.payout.bank}`) : '',
    agent: 'agent' in d.payout ? t(`${k}.agents.${d.payout.agent}`) : '',
    eta: d.eta ? dateTime(d.eta) : '',
  };
  const last = d.events[d.events.length - 1];
  const stopped = tx.status === 'rejected' || tx.status === 'cancelled';
  const headline = {
    pending: t(`${k}.headline.pending`),
    processing: t(`${k}.headline.processing`, vars),
    delivered: t(`${k}.headline.${tx.method === 'bank' ? 'deliveredBank' : 'deliveredCash'}`, { ...vars, date: dateTime(last.at) }),
    rejected: t(`${k}.headline.rejected`),
    cancelled: t(`${k}.headline.cancelled`),
  }[tx.status];

  const copy = async (text: string, msg: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard blocked */ }
    setNote(msg);
  };
  const share = async (text: string, copiedMsg: string) => {
    try { if (navigator.share) { await navigator.share({ title: t(`${k}.title`), text }); return; } } catch { return; }
    await copy(text, copiedMsg);
  };
  /** Plain-text summary for the share sheet (no card number). */
  const shareTransfer = () => share(
    t(`${k}.shareText`, {
      ...vars,
      ref: d.reference,
      sent: money(sent),
      method: t(`home.methods.${tx.method}`),
      status: t(`home.status.${tx.status}`),
      date: dateTime(d.events[0].at),
    }),
    t(`${k}.shareCopied`),
  );
  const confirmCancel = () => {
    const clock = new Date().toTimeString().slice(0, 5);
    const refundBy = new Date(`${demoToday}T00:00`);
    refundBy.setDate(refundBy.getDate() + 3);
    const at = [`${demoToday}T${clock}`, last.at].sort()[1]; // never before the last event in the demo
    cancelTransfer(tx, at, `${refundBy.toISOString().slice(0, 10)}T18:00`);
    setCancelOpen(false);
    setNote(t(`${k}.cancelledToast`));
  };

  const actions: ReactNode = {
    pending: <Button variant="secondary" className="text-red" onClick={() => setCancelOpen(true)}>{t(`${k}.actions.cancel`)}</Button>,
    processing: null,
    delivered: (
      <>
        <Button onClick={() => nav('/soon/Send money')}>{t(`${k}.actions.sendAgain`)}</Button>
        <Button variant="secondary" onClick={() => nav('/soon/Receipt')}>{t(`${k}.actions.receipt`)}</Button>
      </>
    ),
    rejected: <Button onClick={() => nav('/soon/Send money')}>{t(`${k}.actions.sendAgain`)}</Button>,
    cancelled: <Button onClick={() => nav('/soon/Send money')}>{t(`${k}.actions.sendAgain`)}</Button>,
  }[tx.status];

  return (
    <>
      <Screen
        footer={
          <Footer border>
            {actions}
            <Button variant="ghost" onClick={() => nav('/support')}>{t(`${k}.actions.help`)}</Button>
          </Footer>
        }
      >
        <TopBar title={t(`${k}.title`)} action={<IconButton icon="share" label={t(`${k}.actions.share`)} onClick={shareTransfer} />} />
        <div className="flex flex-col gap-6 px-4 pb-6 [&>*]:shrink-0">
          {note ? <Banner type="success">{note}</Banner> : null}

          {/* Summary card: who, how much, status, what it means. */}
          <section className="flex flex-col items-center gap-3 rounded-xl border border-dark-fog bg-fog px-5 pt-6 pb-5 text-center">
            <IconBadge icon={tx.method === 'bank' ? 'bank' : 'cash'} size={56} />
            <div className="flex flex-col items-center gap-0.5">
              <p className="text-body text-slate">{t(`${k}.toName`, { name })}</p>
              <p className="text-numeric-l text-ink" dir="ltr" style={{ fontFamily: 'var(--font-en)' }}>{money(sent)}</p>
              <p className="text-caption text-slate">{t(`${k}.rows.receive`, { name })} <span className="text-body-md text-ink">{vars.receive}</span></p>
            </div>
            <StatusPill status={tx.status} label={t(`home.status.${tx.status}`)} className="px-3 py-1 text-body-md" />
            <p className="text-body text-slate">{headline}</p>
          </section>

          {stopped && (d.refundedAt || d.eta) ? (
            <Banner type={d.refundedAt ? 'success' : 'info'} icon="wallet">
              {d.refundedAt ? t(`${k}.headline.refundDone`, { ...vars, date: dayOnly(d.refundedAt) }) : t(`${k}.headline.refundPending`, { ...vars, eta: d.eta ? dayOnly(d.eta) : '' })}
            </Banner>
          ) : null}

          {/* Progress timeline */}
          <section className="flex flex-col gap-2">
            <h2 className="text-overline text-slate">{t(`${k}.progress`)}</h2>
            <ol className="flex flex-col rounded-lg border border-dark-fog bg-white p-4">
              {timeline(tx).map((r, i, all) => (
                <TimelineRow
                  key={r.step + i}
                  row={r}
                  last={i === all.length - 1}
                  title={t(`home.status.${r.step}`)}
                  body={r.state === 'failed' ? '' : t(`${k}.steps.${r.step}.${tx.method}`, vars)}
                  when={r.at ? dateTime(r.at) : i === all.findIndex((x) => x.state === 'upcoming') && d.eta ? t(`${k}.expected`, vars) : ''}
                />
              ))}
            </ol>
          </section>

          {/* Details, grouped */}
          <ListGroup title={t(`${k}.groups.payment`)}>
            <DetailRow label={t(`${k}.rows.sent`)} value={money(sent)} ltr />
            <DetailRow label={t(`${k}.rows.fee`)} value={money(d.fee)} ltr />
            <DetailRow label={t(`${k}.rows.total`)} value={vars.amount} ltr strong />
            <DetailRow label={t(`${k}.rows.rate`)} value={t(`${k}.rateValue`, { rate: demoAccount.rate.jod })} ltr />
            <DetailRow label={t(`${k}.rows.received`)} value={formatAmount(receiveAmount(sent))} ltr strong
              trailing={<CurrencyTag flag="JO" code="JOD" label={t(`${k}.currencyJOD`)} />} />
            <DetailRow label={t(`${k}.rows.card`)} value={vars.card} ltr />
          </ListGroup>
          <ListGroup title={t(`${k}.groups.recipient`)}>
            <DetailRow label={t(`${k}.rows.name`)} value={name} />
            <DetailRow label={t(`${k}.rows.method`)} value={t(`home.methods.${tx.method}`)} />
            {'bank' in d.payout ? (
              <>
                <DetailRow label={t(`${k}.rows.bank`)} value={vars.bank} />
                <DetailRow label={t(`${k}.rows.account`)} value={t(`${k}.accountValue`, { last4: d.payout.last4 })} ltr />
              </>
            ) : <DetailRow label={t(`${k}.rows.agent`)} value={vars.agent} />}
          </ListGroup>
          <ListGroup title={t(`${k}.groups.transfer`)}>
            <DetailRow label={t(`${k}.rows.reference`)} value={d.reference} ltr trailing={<CopyButton label={t(`${k}.copyShort`)} aria={t(`${k}.copy`)} onClick={() => copy(d.reference, t(`${k}.copied`))} />} />
            <DetailRow label={t(`${k}.rows.created`)} value={dateTime(d.events[0].at)} />
          </ListGroup>
        </div>
      </Screen>

      <Sheet open={cancelOpen} onOpenChange={setCancelOpen}>
        <SheetContent title={t(`${k}.cancelSheet.title`)}>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-h3">{t(`${k}.cancelSheet.title`)}</h2>
            <p className="text-body text-slate">{t(`${k}.cancelSheet.subtitle`, vars)}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={confirmCancel}>{t(`${k}.cancelSheet.confirm`)}</Button>
            <Button variant="secondary" onClick={() => setCancelOpen(false)}>{t(`${k}.cancelSheet.keep`)}</Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/** One status in the timeline: marker (done ✓ green, stopped ✕ red, current ring in the status colour — Pending amber,
 *  Processing blue — upcoming dashed grey) + connector line. */
function TimelineRow({ row, last, title, body, when }: { row: Row; last: boolean; title: string; body: string; when: string }) {
  const marker = {
    done: <IconBadge icon="check" size={32} tone="success" />,
    failed: <span className="grid size-8 shrink-0 place-items-center rounded-full bg-failure text-white"><Icon name="x" size={16} /></span>,
    current: row.step === 'pending'
      ? <span className="grid size-8 shrink-0 place-items-center rounded-full bg-warning-light ring-[1.5px] ring-warning"><span className="size-2.5 animate-pulse rounded-full bg-warning" /></span>
      : <span className="grid size-8 shrink-0 place-items-center rounded-full bg-info-light ring-[1.5px] ring-info"><span className="size-2.5 animate-pulse rounded-full bg-info" /></span>,
    upcoming: <span className="size-8 shrink-0 rounded-full border-[1.5px] border-dashed border-silver bg-white" />,
  }[row.state];
  return (
    <li className="flex gap-3" aria-current={row.state === 'current' ? 'step' : undefined}>
      <div className="flex flex-col items-center">
        {marker}
        {!last ? <span className={cn('w-0.5 flex-1 min-h-4', row.state === 'done' ? 'bg-success' : 'bg-dark-fog')} /> : null}
      </div>
      <div className={cn('flex flex-1 flex-col gap-0.5 pt-1', !last && 'pb-5')}>
        <div className="flex items-baseline justify-between gap-2">
          <span className={cn('text-body-md', row.state === 'failed' ? 'text-failure' : row.state === 'upcoming' ? 'text-slate' : 'text-ink')}>{title}</span>
          {when ? <span className={cn('shrink-0 text-caption', row.state === 'upcoming' ? 'text-ink' : 'text-slate')}>{when}</span> : null}
        </div>
        {body && row.state !== 'upcoming' ? <p className={cn('text-caption', row.state === 'failed' ? 'text-failure' : 'text-slate')}>{body}</p> : null}
      </div>
    </li>
  );
}

function DetailRow({ label, value, ltr, strong, trailing }: { label: string; value: string; ltr?: boolean; strong?: boolean; trailing?: ReactNode }) {
  return (
    <div className="flex min-h-12 items-center gap-3 border-b border-dark-fog px-4 py-2 last:border-b-0">
      <span className="flex-1 text-body text-slate">{label}</span>
      <span className={cn('text-end', strong ? 'text-body-md text-ink' : 'text-body text-ink')} dir={ltr ? 'ltr' : undefined} style={ltr ? { fontFamily: 'var(--font-en)' } : undefined}>{value}</span>
      {trailing}
    </div>
  );
}

function CopyButton({ label, aria, onClick }: { label: string; aria: string; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={aria} className="flex min-h-11 cursor-pointer items-center gap-1 rounded-full px-2 text-body-md text-red outline-none hover:bg-red-4 focus-visible:ring-2 focus-visible:ring-ink">
      {label}
    </button>
  );
}

/** Currency indicator next to an amount: flag + ISO code in a small pill (flags never mirror). */
function CurrencyTag({ flag, code, label }: { flag: 'JO' | 'UK'; code: string; label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-dark-fog bg-white py-0.5 ps-1 pe-2" title={label} aria-label={label} role="img">
      <span className="h-3 w-4 overflow-hidden rounded-[2px] [&>svg]:size-full" aria-hidden dangerouslySetInnerHTML={{ __html: flagXml[flag] }} />
      <span className="text-caption text-ink" style={{ fontFamily: 'var(--font-en)' }}>{code}</span>
    </span>
  );
}
