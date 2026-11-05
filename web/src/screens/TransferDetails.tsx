/** Transfer details (11.3): status header, progress timeline (every status with its time, current step, what's next,
 *  rejection / cancellation reason and refund), pickup code for cash, payment details and status-based actions. */
import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoAccount, demoCards, demoToday } from '@shared/mock/account';
import { cancelReasons, receiveAmount, statusFlow, type StopReason, type TransferStatus } from '@shared/mock/transfers';
import { formatMoney, ltr } from '@shared/utils/format';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { RadioGroup, RadioOption } from '@/components/ui/radio-group';
import { Icon } from '@/components/Icon';
import { Banner, IconBadge, ListGroup, Screen, StatusPill, TopBar } from '@/components/quicliq';
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
  const [reason, setReason] = useState<StopReason>('byWrongAmount');
  const [note, setNote] = useState<string | null>(null);

  if (!tx) {
    return (
      <Screen>
        <TopBar title={t(`${k}.title`)} />
        <p className="px-6 py-12 text-center text-body text-slate">{t(`${k}.notFound`)}</p>
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
  const readyToCollect = tx.status === 'delivered' && tx.method === 'cash';
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
  const share = async (text: string) => {
    try { if (navigator.share) { await navigator.share({ text }); return; } } catch { return; }
    await copy(text, t(`${k}.pickup.copied`));
  };
  const confirmCancel = () => {
    const clock = new Date().toTimeString().slice(0, 5);
    const refundBy = new Date(`${demoToday}T00:00`);
    refundBy.setDate(refundBy.getDate() + 3);
    const at = [`${demoToday}T${clock}`, last.at].sort()[1]; // never before the last event in the demo
    cancelTransfer(tx, reason, at, `${refundBy.toISOString().slice(0, 10)}T18:00`);
    setCancelOpen(false);
    setNote(t(`${k}.cancelledToast`));
  };

  const actions: ReactNode = {
    pending: <Button variant="secondary" className="text-red" onClick={() => setCancelOpen(true)}>{t(`${k}.actions.cancel`)}</Button>,
    processing: null,
    delivered: (
      <>
        {readyToCollect && d.pickupCode ? <Button onClick={() => share(`${t(`${k}.pickup.title`)}: ${d.pickupCode} (${d.reference})`)}>{t(`${k}.pickup.share`)}</Button> : null}
        <Button variant={readyToCollect ? 'secondary' : 'default'} onClick={() => nav('/soon/Send money')}>{t(`${k}.actions.sendAgain`)}</Button>
        <Button variant="secondary" onClick={() => nav('/soon/Receipt')}>{t(`${k}.actions.receipt`)}</Button>
      </>
    ),
    rejected: <Button onClick={() => nav('/soon/Send money')}>{t(`${k}.actions.fixAndSend`)}</Button>,
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
        <TopBar title={t(`${k}.title`)} />
        <div className="flex flex-col gap-6 px-6 pb-6 [&>*]:shrink-0">
          {note ? <Banner type="success">{note}</Banner> : null}

          {/* Summary card: who, how much, status, what it means; Cancelled / Rejected show the reason here. */}
          <section className="flex flex-col items-center gap-3 rounded-xl border border-dark-fog bg-fog px-5 pt-6 pb-5 text-center">
            <IconBadge icon={tx.method === 'bank' ? 'bank' : 'cash'} size={56} />
            <div className="flex flex-col items-center gap-0.5">
              <p className="text-body text-slate">{t(`${k}.toName`, { name })}</p>
              <p className="text-numeric-l text-ink" dir="ltr" style={{ fontFamily: 'var(--font-en)' }}>{money(sent)}</p>
              <p className="text-caption text-slate">{t(`${k}.rows.receive`, { name })} <span className="text-body-md text-ink">{vars.receive}</span></p>
            </div>
            <StatusPill status={tx.status} label={t(`home.status.${tx.status}`)} className="px-3 py-1 text-body-md" />
            {stopped && d.reason ? (
              <div className="flex w-full items-start gap-2 rounded-md bg-failure-light p-3 text-start text-body text-failure-dark" role="note">
                <Icon name="alert" size={20} className="mt-px text-failure" />
                <span><span className="text-body-md">{t(`${k}.reasonTitle`)}: </span>{t(`${k}.reasons.${d.reason}`, vars)}</span>
              </div>
            ) : <p className="text-body text-slate">{headline}</p>}
          </section>

          {stopped && (d.refundedAt || d.eta) ? (
            <Banner type={d.refundedAt ? 'success' : 'info'} icon="wallet">
              {d.refundedAt ? t(`${k}.headline.refundDone`, { ...vars, date: dayOnly(d.refundedAt) }) : t(`${k}.headline.refundPending`, { ...vars, eta: d.eta ? dayOnly(d.eta) : '' })}
            </Banner>
          ) : null}

          {readyToCollect && d.pickupCode ? (
            <section className="flex flex-col gap-3 rounded-lg bg-info-light p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-body-md text-info-dark">{t(`${k}.pickup.title`)}</h2>
                <CopyButton label={t(`${k}.copyShort`)} aria={t(`${k}.pickup.title`)} onClick={() => copy(d.pickupCode!, t(`${k}.pickup.copied`))} />
              </div>
              <p className="text-numeric-l tracking-[0.2em] text-ink" dir="ltr" style={{ fontFamily: 'var(--font-en)', textAlign: 'center' }}>{d.pickupCode}</p>
              <p className="text-caption text-info-dark">{t(`${k}.pickup.hint`, vars)}</p>
            </section>
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
                  body={r.state === 'failed' ? t(`${k}.reasonsShort.${d.reason ?? 'byOther'}`) : t(`${k}.steps.${r.step}.${tx.method}`, vars)}
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
            <DetailRow label={t(`${k}.rows.receive`, { name })} value={vars.receive} ltr strong />
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
          <RadioGroup value={reason} onValueChange={(v) => setReason(v as StopReason)}>
            {cancelReasons.map((r) => <RadioOption key={r} value={r} title={t(`${k}.cancelReasons.${r}`)} />)}
          </RadioGroup>
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
