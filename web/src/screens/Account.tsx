/** 12.1 Account — profile card, Account / Preferences / Support lists, language sheet, log-out sheet. */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoAccount, demoLimit, demoSystem, limitTotal, nextLevel } from '@shared/mock/account';
import { formatMoney } from '@shared/utils/format';
import { Icon } from '@/components/Icon';
import { LimitSheet } from '@/screens/Home';
import { RaiseLimitSheet } from '@/screens/Verify';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, IconBadge, ListGroup, ListRow, Screen, TabBar } from '@/components/quicliq';
import { LanguageSheet } from '@/screens/Start';
import { useLocale } from '@/i18n';

export function Account() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { locale } = useLocale();
  const k = 'account';
  const [lang, setLang] = useState(false);
  const [logout, setLogout] = useState(false);
  const [limit, setLimit] = useState(false);
  const [raise, setRaise] = useState(false);
  const level = demoLimit.level;
  const next = nextLevel(level);
  return (
    <>
      <Screen className="gap-6 px-6 pt-4 pb-28">
        <h1 className="text-h2">{t(`${k}.title`)}</h1>
        <button onClick={() => nav('/account/personal')} className="flex cursor-pointer items-center gap-4 rounded-xl bg-fog p-4 text-start hover:bg-dark-fog">
          <Avatar initials={demoAccount.initials} tone="brand" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-title">{demoAccount.fullName}</span>
            <span className="truncate text-caption text-slate" dir="ltr">{demoAccount.email}</span>
          </div>
          <Icon name="chevronRight" size={16} className="text-slate" />
        </button>
        <ListGroup title={t(`${k}.groups.account`)}>
          <ListRow icon="card" title={t(`${k}.rows.cards`)} onClick={() => nav('/account/cards')} />
          <button onClick={() => setLimit(true)} className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-start hover:bg-dark-fog">
            <IconBadge icon="trendingUp" size={40} />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex items-center gap-2"><span className="text-body-md">{t(`${k}.rows.limit`)}</span><span className="rounded-full bg-red-10 px-2 text-caption text-red">{t('home.levelLink', { level })}</span></span>
              <span className="flex w-28 gap-1">{[1, 2, 3].map((n) => <span key={n} className={n <= level ? 'h-1 flex-1 rounded-full bg-red' : 'h-1 flex-1 rounded-full bg-ink-10'} />)}</span>
              {next ? <span className="text-caption text-red">{t(`home.nextStep.${next.key}.title`)} {t(`home.nextStep.${next.key}.body`, { amount: formatMoney(limitTotal(2)) })}</span> : null}
            </span>
            <span className="text-body-md text-ink" dir="ltr">{formatMoney(limitTotal(level))}</span>
            <Icon name="chevronRight" size={16} className="text-slate" />
          </button>
        </ListGroup>
        <ListGroup title={t(`${k}.groups.preferences`)}>
          <ListRow icon="shield" title={t(`${k}.rows.security`)} onClick={() => nav('/account/security')} />
          <ListRow icon="globe" title={t(`${k}.rows.language`)} value={locale === 'ar' ? 'العربية' : 'English'} onClick={() => nav('/account/language')} />
        </ListGroup>
        <ListGroup title={t(`${k}.groups.support`)}>
          <ListRow icon="help" title={t(`${k}.rows.help`)} onClick={() => nav('/help')} />
          <ListRow icon="file" title={t(`${k}.rows.legal`)} onClick={() => nav('/legal')} />
        </ListGroup>
        <ListGroup>
          <ListRow icon="arrowRight" title={t(`${k}.logOut`)} danger onClick={() => setLogout(true)} trailing={<span />} />
        </ListGroup>
        <p className="text-center text-caption text-slate">{t(`${k}.version`, { version: demoSystem.version })}</p>
      </Screen>
      <TabBar active="profile" />
      <LanguageSheet open={lang} onOpenChange={setLang} />
      <LimitSheet open={limit} onOpenChange={setLimit} level={level} onRaise={() => { setLimit(false); setRaise(true); }} />
      <RaiseLimitSheet open={raise} onOpenChange={setRaise} />
      <Sheet open={logout} onOpenChange={setLogout}>
        <SheetContent title={t(`${k}.logout.title`)}>
          <h2 className="text-h3">{t(`${k}.logout.title`)}</h2>
          <p className="text-body text-slate">{t(`${k}.logout.body`)}</p>
          <Button onClick={() => nav('/login', { replace: true })}>{t(`${k}.logout.confirm`)}</Button>
          <Button variant="ghost" onClick={() => setLogout(false)}>{t(`${k}.logout.cancel`)}</Button>
        </SheetContent>
      </Sheet>
    </>
  );
}
