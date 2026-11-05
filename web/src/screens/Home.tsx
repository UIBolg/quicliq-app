/** Home — level banner, Limit Card (opens the sending-limit sheet), Send money, recent beneficiaries, recent transfers. */
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoAccount, demoLimit, demoRecipients, limitLevels, limitTotal, nextLevel, type LimitLevel } from '@shared/mock/account';
import { formatMoney } from '@shared/utils/format';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Icon } from '@/components/Icon';
import { ActionBanner, Avatar, IconBadge, IconButton, LimitCard, Screen, TabBar, TransferCard } from '@/components/quicliq';
import { transferCard } from '@/screens/transfers';
import { useTransfers } from '@/lib/transfers';
import { RaiseLimitSheet } from '@/screens/Verify';
import { cn } from '@/lib/utils';

const k = 'home';

export function useLevel(): LimitLevel {
  const [q] = useSearchParams();
  const l = Number(q.get('level'));
  return (l === 2 || l === 3 ? l : 1) as LimitLevel;
}

export function Home() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const level = useLevel();
  const [sheet, setSheet] = useState(false);
  const [raise, setRaise] = useState(false);
  const total = limitTotal(level);
  const left = Math.max(0, total - demoLimit.sent);
  const next = nextLevel(level);
  const soon = (id: string) => () => nav(`/soon/${id}`);
  const transfers = useTransfers();
  return (
    <>
      <Screen className="gap-6 px-6 pt-4 pb-28">
        <header className="flex items-center gap-3">
          <Avatar initials={demoAccount.initials} size={44} tone="brand" />
          <div className="flex-1">
            <p className="text-caption text-slate">{t(`${k}.greeting`)}</p>
            <h1 className="text-title">{demoAccount.firstName}</h1>
          </div>
          <IconButton icon="bell" label={t(`${k}.notifications`)} onClick={() => nav('/notifications')} />
        </header>

        {next ? (
          <ActionBanner icon={next.icon} title={t(`${k}.nextStep.${next.key}.title`)} message={t(`${k}.nextStep.${next.key}.body`, { amount: formatMoney(limitTotal(2)) })} onClick={() => (next?.key === 'idAddress' ? setRaise(true) : soon('Source of funds')())} />
        ) : null}

        <div className="flex flex-col gap-2">
          <LimitCard
            level={level}
            label={t(`${k}.limit.title`)}
            levelName={t(`${k}.levels.${level}`)}
            amount={level === 3 ? t(`${k}.limit.unlimited`) : formatMoney(left)}
            caption={level === 3 ? t(`${k}.limit.noCap`) : t(`${k}.limit.caption`, { total: formatMoney(total) })}
            value={(demoLimit.sent / total) * 100}
            onClick={() => setSheet(true)}
          />
          <button onClick={soon('Send money')} className="flex cursor-pointer items-center gap-3 rounded-xl bg-red p-4 text-start text-white hover:bg-red-shade">
            <Icon name="send" size={28} />
            <span className="flex flex-1 flex-col"><span className="text-title">{t(`${k}.sendMoney`)}</span><span className="text-caption text-white-80">{t(`${k}.sendMoneyHint`)}</span></span>
            <Icon name="chevronRight" size={20} />
          </button>
        </div>

        <section className="flex flex-col gap-3">
          <SectionHeader title={t(`${k}.recipients`)} action={t(`${k}.seeAll`)} onAction={soon('Recipients')} />
          <div className="-mx-6 flex gap-1 overflow-x-auto px-6 no-scrollbar">
            <Tile label={t(`${k}.addRecipient`)} onClick={soon('Add recipient')}>
              <span className="grid size-14 place-items-center rounded-full border-[1.5px] border-dashed border-red text-red"><Icon name="plus" size={24} /></span>
            </Tile>
            {demoRecipients.map((r) => (
              <Tile key={r.id} label={t(`${k}.recipientShort.${r.id}`)} onClick={soon('Send money')}><Avatar initials={r.initials} /></Tile>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeader title={t(`${k}.recent`)} action={t(`${k}.seeAll`)} onAction={() => nav(`/history?level=${level}`)} />
          <div className="flex flex-col gap-2">
            {transfers.slice(0, 3).map((tx) => <TransferCard key={tx.id} {...transferCard(tx, t)} onClick={() => nav(`/history/${tx.id}`)} />)}
          </div>
        </section>
      </Screen>
      <TabBar active="home" />
      <LimitSheet open={sheet} onOpenChange={setSheet} level={level} onRaise={() => { setSheet(false); if (level === 1) setRaise(true); else soon('Source of funds')(); }} />
      <RaiseLimitSheet open={raise} onOpenChange={setRaise} />
    </>
  );
}

function SectionHeader({ title, action, onAction }: { title: string; action: string; onAction: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-h3">{title}</h2>
      <button onClick={onAction} className="cursor-pointer text-body-md text-red hover:underline">{action}</button>
    </div>
  );
}

function Tile({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex w-[72px] shrink-0 cursor-pointer flex-col items-center gap-2 rounded-md py-1 hover:bg-fog">
      {children}
      <span className="w-full truncate text-center text-caption text-ink">{label}</span>
    </button>
  );
}

export function LimitSheet({ open, onOpenChange, level, onRaise }: { open: boolean; onOpenChange: (o: boolean) => void; level: LimitLevel; onRaise: () => void }) {
  const { t } = useTranslation();
  const ks = `${k}.limitSheet`;
  const total = limitTotal(level);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t(`${ks}.title`)}>
        <h2 className="text-h3">{t(`${ks}.title`)}</h2>
        {level < 3 ? <p className="text-body text-slate">{t(`${ks}.usage`, { used: formatMoney(demoLimit.sent), left: formatMoney(Math.max(0, total - demoLimit.sent)) })}</p> : null}
        <div className="flex flex-col">
          {limitLevels.map((step, i) => {
            const n = i + 1;
            const status = n <= level ? 'done' : n === level + 1 ? 'current' : 'locked';
            return (
              <div key={step.key} className="flex items-center gap-3 py-3">
                {status === 'done' ? <IconBadge icon="check" size={32} tone="success" /> : status === 'locked' ? <IconBadge icon="lock" size={32} tone="grey" /> : <span className="grid size-8 place-items-center rounded-full bg-red-10"><span className="size-2.5 rounded-full bg-red" /></span>}
                <span className="flex flex-1 flex-col">
                  <span className="text-body-md">{t(`${ks}.steps.${step.key}.title`)}</span>
                  <span className={cn('text-caption', status === 'current' ? 'text-red' : 'text-slate')}>{t(`${ks}.steps.${step.key}.${status === 'locked' ? 'locked' : 'current'}`)}</span>
                </span>
                <span className="flex flex-col items-end">
                  <span className="text-body-md" dir="ltr">{step.total ? formatMoney(step.total) : t(`${ks}.over`, { amount: formatMoney(limitTotal(2)) })}</span>
                  <span className="text-caption text-slate">{t(`${ks}.total`)}</span>
                </span>
              </div>
            );
          })}
        </div>
        {level < 3 ? <Button onClick={onRaise}>{t(`${ks}.raise`)}</Button> : <p className="text-body text-slate">{t(`${ks}.allDone`)}</p>}
      </SheetContent>
    </Sheet>
  );
}
