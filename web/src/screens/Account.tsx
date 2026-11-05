/** 12.1 Account — profile card, Account / Preferences / Support lists, language sheet, log-out sheet. */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoAccount, demoSystem } from '@shared/mock/account';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, ListGroup, ListRow, Screen, TabBar } from '@/components/quicliq';
import { LanguageSheet } from '@/screens/Start';
import { useLocale } from '@/i18n';

export function Account() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { locale } = useLocale();
  const k = 'account';
  const [lang, setLang] = useState(false);
  const [logout, setLogout] = useState(false);
  const soon = (id: string) => () => nav(`/soon/${id}`);
  return (
    <>
      <Screen className="gap-6 px-6 pt-4 pb-28">
        <h1 className="text-h2">{t(`${k}.title`)}</h1>
        <div className="flex items-center gap-4 rounded-xl bg-fog p-4">
          <Avatar initials={demoAccount.initials} tone="brand" />
          <div className="flex min-w-0 flex-col">
            <span className="text-title">{demoAccount.fullName}</span>
            <span className="truncate text-caption text-slate" dir="ltr">{demoAccount.email}</span>
          </div>
        </div>
        <ListGroup title={t(`${k}.groups.account`)}>
          <ListRow icon="user" title={t(`${k}.rows.personal`)} onClick={soon('12.2')} />
          <ListRow icon="card" title={t(`${k}.rows.cards`)} onClick={soon('12.4')} />
          <ListRow icon="trendingUp" title={t(`${k}.rows.limit`)} subtitle={t('home.levels.1')} onClick={() => nav('/home?level=1')} />
          <ListRow icon="shield" title={t(`${k}.rows.security`)} onClick={soon('12.5')} />
        </ListGroup>
        <ListGroup title={t(`${k}.groups.preferences`)}>
          <ListRow icon="globe" title={t(`${k}.rows.language`)} value={locale === 'ar' ? 'العربية' : 'English'} onClick={() => setLang(true)} />
        </ListGroup>
        <ListGroup title={t(`${k}.groups.support`)}>
          <ListRow icon="help" title={t(`${k}.rows.help`)} onClick={soon('13.1')} />
          <ListRow icon="file" title={t(`${k}.rows.legal`)} onClick={soon('12.7')} />
        </ListGroup>
        <ListGroup>
          <ListRow icon="x" title={t(`${k}.logOut`)} danger onClick={() => setLogout(true)} trailing={<span />} />
        </ListGroup>
        <p className="text-center text-caption text-slate">{t(`${k}.version`, { version: demoSystem.version })}</p>
      </Screen>
      <TabBar active="profile" />
      <LanguageSheet open={lang} onOpenChange={setLang} />
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
