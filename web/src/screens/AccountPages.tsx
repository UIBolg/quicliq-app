/** Account inner pages: 12.2 personal details · 12.3 change password · 12.4 saved cards (+ add card) · 12.5 security ·
 *  12.6 language · 12.7 legal / 12.7a documents · 13.1 help · 13.2 notifications. */
import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoAccount, demoCards, demoDevice, demoNotifications, demoProfile, supportContacts } from '@shared/mock/account';
import { formatMoney, ltr } from '@shared/utils/format';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { RadioGroup, RadioOption } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Icon, type IconName } from '@/components/Icon';
import { Banner, IconBadge, ListGroup, ListRow, Screen, TextField, TopBar } from '@/components/quicliq';
import { Footer, PasswordRule, PhoneRow } from '@/components/forms';
import { useLocale, type Locale } from '@/i18n';
import { cn } from '@/lib/utils';

const ka = 'account';

/* 12.2 */
export function PersonalDetails() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const k = `${ka}.personal`;
  const [email, setEmail] = useState<string>(demoAccount.email);
  const [mobile] = useState<string>(demoProfile.mobile);
  const [editing, setEditing] = useState<'email' | 'mobile' | null>(null);
  const [draft, setDraft] = useState('');
  const Row = ({ icon, label, value, onEdit }: { icon: IconName; label: string; value: string; onEdit?: () => void }) => {
    const C = onEdit ? 'button' : 'div';
    return (
      <C onClick={onEdit} className={cn('flex min-h-14 w-full items-center gap-3 border-b border-dark-fog px-4 py-3 text-start last:border-b-0', onEdit && 'cursor-pointer hover:bg-dark-fog')}>
        <IconBadge icon={icon} size={40} />
        <span className="flex flex-1 flex-col"><span className="text-caption text-slate">{label}</span><span className="text-body-md text-ink">{value}</span></span>
        <Icon name={onEdit ? 'chevronRight' : 'lock'} size={16} className="text-slate" />
      </C>
    );
  };
  return (
    <Screen>
      <TopBar title={t(`${k}.title`)} />
      <div className="flex flex-col gap-6 px-6 pb-8">
        <div className="flex flex-col gap-2">
          <ListGroup title={t(`${k}.sections.identity`)}>
            <Row icon="user" label={t(`${k}.fullName`)} value={demoAccount.fullName} />
            <Row icon="calendar" label={t(`${k}.dob`)} value={demoProfile.dob} />
          </ListGroup>
          <p className="flex items-start gap-1.5 text-caption text-slate"><Icon name="lock" size={14} className="mt-0.5" />{t(`${k}.lockedNote`)}</p>
        </div>
        <ListGroup title={t(`${k}.sections.contact`)}>
          <Row icon="mail" label={t(`${k}.email`)} value={email} onEdit={() => { setDraft(email); setEditing('email'); }} />
          <Row icon="smartphone" label={t(`${k}.mobile`)} value={ltr(`+44 ${mobile}`)} onEdit={() => { setDraft(mobile); setEditing('mobile'); }} />
        </ListGroup>
        <ListGroup title={t(`${k}.sections.address`)}>
          <Row icon="pin" label={t(`${k}.address`)} value={ltr(demoProfile.address)} onEdit={() => nav('/verify/address')} />
        </ListGroup>
      </div>
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent title={editing ? t(`${k}.edit.${editing}`) : ''}>
          <h2 className="text-h3">{editing ? t(`${k}.edit.${editing}`) : ''}</h2>
          {editing === 'mobile' ? <PhoneRow><TextField label={t(`${k}.mobile`)} value={draft} onChange={setDraft} inputMode="tel" dirLtr helper={t(`${k}.mobileNote`)} /></PhoneRow> : <TextField label={t(`${k}.email`)} value={draft} onChange={setDraft} type="email" dirLtr />}
          <Button disabled={!draft.trim()} onClick={() => { if (editing === 'email') setEmail(draft.trim()); setEditing(null); }}>{t(`${k}.save`)}</Button>
        </SheetContent>
      </Sheet>
    </Screen>
  );
}

/* 12.3 */
const RULES = { length: (p: string) => p.length >= 8, upper: (p: string) => /[A-Z]/.test(p), lower: (p: string) => /[a-z]/.test(p), number: (p: string) => /\d/.test(p), special: (p: string) => /[^A-Za-z0-9]/.test(p) };
export function ChangePassword() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const k = `${ka}.password`;
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [error, setError] = useState<string>();
  const ok = Object.values(RULES).every((r) => r(next));
  const save = () => {
    if (cur !== demoAccount.password) return setError(t(`${k}.wrongCurrent`));
    if (next === cur) return setError(t(`${k}.reused`));
    nav(-1);
  };
  return (
    <Screen footer={<Footer><Button disabled={!cur || !ok} onClick={save}>{t(`${k}.save`)}</Button></Footer>}>
      <TopBar title={t(`${k}.title`)} />
      <div className="flex flex-col gap-4 px-6">
        <p className="text-body-lg text-slate">{t(`${k}.intro`)}</p>
        {error ? <Banner type="error">{error}</Banner> : null}
        <TextField label={t(`${k}.current`)} value={cur} onChange={(v) => { setCur(v); setError(undefined); }} type="password" />
        <TextField label={t(`${k}.new`)} value={next} onChange={(v) => { setNext(v); setError(undefined); }} type="password" />
        <div className="flex flex-col gap-1">{(Object.keys(RULES) as (keyof typeof RULES)[]).map((r) => <PasswordRule key={r} label={t(`registration.2_1.rules.${r}`)} met={RULES[r](next)} />)}</div>
      </div>
    </Screen>
  );
}

/* 12.4 Saved cards — card faces as in the artifact (Visa dark, Mastercard red), default tag / switch, remove, add with flip. */
function PaymentCard({ brand, last4, expires, flipped, cvv, number }: { brand: string; last4?: string; expires: string; flipped?: boolean; cvv?: string; number?: string }) {
  const { t } = useTranslation();
  const dark = brand === 'Visa';
  return (
    <div className="aspect-[1.586] w-full [perspective:1000px]">
      <div className={cn('relative size-full transition-transform duration-500 [transform-style:preserve-3d]', flipped && '[transform:rotateY(180deg)]')}>
        <div className={cn('absolute inset-0 flex flex-col justify-between overflow-hidden rounded-xl p-5 text-white [backface-visibility:hidden]', dark ? 'bg-gradient-to-br from-ink to-slate' : 'bg-gradient-to-br from-red to-red-shade')} dir="ltr">
          <span className="pointer-events-none absolute -top-20 -right-16 size-[220px] rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <span className="h-[30px] w-10 rounded-md bg-white-80" />
            <Icon name="zap" size={20} className="text-white-80" />
          </div>
          <span className="relative text-title tracking-[1.5px]" style={{ fontFamily: 'var(--font-en)' }}>{number || `•••• •••• •••• ${last4}`}</span>
          <div className="relative flex items-end justify-between">
            <span className="flex flex-col"><span className="text-overline text-white-80">{t(`${ka}.cards.expiresLabel`)}</span><span className="text-body-md" style={{ fontFamily: 'var(--font-en)' }}>{expires || 'MM/YY'}</span></span>
            <span className="text-h3 italic" style={{ fontFamily: 'var(--font-en)' }}>{brand === 'Visa' ? 'VISA' : brand}</span>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col gap-4 overflow-hidden rounded-xl bg-ink pt-6 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]" dir="ltr">
          <span className="h-10 w-full bg-ink-50" />
          <span className="mx-5 flex h-9 items-center justify-end rounded-sm bg-white px-3 text-body-md text-ink" style={{ fontFamily: 'var(--font-en)' }}>{cvv || '•••'}</span>
        </div>
      </div>
    </div>
  );
}
export function SavedCards() {
  const { t } = useTranslation();
  const k = `${ka}.cards`;
  const [cards, setCards] = useState([...demoCards]);
  const [def, setDef] = useState('c1');
  const [remove, setRemove] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ number: '', expiry: '', cvv: '' });
  const [cvvFocus, setCvvFocus] = useState(false);
  const card = cards.find((c) => c.id === remove);
  return (
    <Screen footer={<Footer><Button variant="secondary" onClick={() => setAdding(true)}><Icon name="plus" size={20} />{t(`${k}.add`)}</Button></Footer>}>
      <TopBar title={t(`${k}.title`)} />
      <div className="flex flex-col gap-6 px-6 pb-6">
        <p className="text-body text-slate">{t(`${k}.intro`)}</p>
        {cards.length === 0 ? <p className="text-body text-slate">{t(`${k}.empty`)}</p> : null}
        {cards.map((c) => (
          <div key={c.id} className="flex flex-col gap-3">
            <PaymentCard brand={c.brand} last4={c.last4} expires={c.expires} />
            <div className="flex items-center justify-between gap-2">
              {def === c.id
                ? <span className="flex items-center gap-1.5 rounded-full bg-success-light px-2 py-1 text-caption text-success"><Icon name="check" size={14} />{t(`${k}.default`)}</span>
                : <label className="flex cursor-pointer items-center gap-2 text-body-md">{t(`${k}.setDefault`)}<Switch checked={false} onCheckedChange={() => setDef(c.id)} aria-label={t(`${k}.setDefault`)} /></label>}
              <button onClick={() => setRemove(c.id)} className="flex cursor-pointer items-center gap-1.5 text-body-md text-red hover:underline"><Icon name="trash" size={16} />{t(`${k}.remove`)}</button>
            </div>
          </div>
        ))}
      </div>
      <Sheet open={!!remove} onOpenChange={(o) => !o && setRemove(null)}>
        <SheetContent title={t(`${k}.sheetTitle`)}>
          <h2 className="text-h3">{t(`${k}.sheetTitle`)}</h2>
          <p className="text-body text-slate">{t(`${k}.sheetBody`, { card: card ? ltr(`${card.brand} •••• ${card.last4}`) : '' })}</p>
          <Button onClick={() => { setCards((cs) => cs.filter((c) => c.id !== remove)); setRemove(null); }}>{t(`${k}.confirm`)}</Button>
          <Button variant="ghost" onClick={() => setRemove(null)}>{t(`${k}.cancel`)}</Button>
        </SheetContent>
      </Sheet>
      <Sheet open={adding} onOpenChange={setAdding}>
        <SheetContent title={t(`${ka}.addCard.title`)}>
          <h2 className="text-h3">{t(`${ka}.addCard.title`)}</h2>
          <PaymentCard brand="Visa" number={f.number.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()} expires={f.expiry} cvv={f.cvv} flipped={cvvFocus} />
          <TextField label={t(`${ka}.addCard.number`)} value={f.number} onChange={(v) => setF((p) => ({ ...p, number: v.slice(0, 19) }))} inputMode="numeric" dirLtr />
          <div className="grid grid-cols-2 gap-3">
            <TextField label={t(`${ka}.addCard.expiry`)} value={f.expiry} onChange={(v) => setF((p) => ({ ...p, expiry: v.slice(0, 5) }))} inputMode="numeric" dirLtr />
            <div onFocus={() => setCvvFocus(true)} onBlur={() => setCvvFocus(false)}><TextField label={t(`${ka}.addCard.cvv`)} value={f.cvv} onChange={(v) => setF((p) => ({ ...p, cvv: v.replace(/\D/g, '').slice(0, 4) }))} inputMode="numeric" dirLtr /></div>
          </div>
          <Button disabled={f.number.replace(/\D/g, '').length < 16 || f.expiry.length < 5 || f.cvv.length < 3} onClick={() => { setCards((cs) => [...cs, { id: `c${Date.now()}`, brand: 'Visa', last4: f.number.replace(/\D/g, '').slice(-4), expires: f.expiry }]); setF({ number: '', expiry: '', cvv: '' }); setAdding(false); }}>{t(`${ka}.addCard.saveCard`)}</Button>
        </SheetContent>
      </Sheet>
    </Screen>
  );
}

/* 12.5 */
export function Security() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const k = `${ka}.security`;
  const [face, setFace] = useState(true);
  return (
    <Screen>
      <TopBar title={t(`${k}.title`)} />
      <div className="flex flex-col gap-6 px-6">
        <p className="text-body-lg text-slate">{t(`${k}.intro`)}</p>
        <ListGroup>
          <ListRow icon="faceId" title={t(`${k}.faceId`)} subtitle={t(`${k}.faceIdHint`)} trailing={<Switch checked={face} onCheckedChange={setFace} aria-label={t(`${k}.faceId`)} />} />
          <ListRow icon="lock" title={t(`${k}.changePassword`)} onClick={() => nav('/account/password')} />
        </ListGroup>
        <ListGroup title={t(`${k}.device`)}>
          <ListRow icon="smartphone" title={demoDevice.name} subtitle={t(`${k}.thisDevice`)} />
        </ListGroup>
        <p className="-mt-4 text-caption text-slate">{t(`${k}.deviceHint`)}</p>
      </div>
    </Screen>
  );
}

/* 12.6 */
export function Language() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  return (
    <Screen>
      <TopBar title={t(`${ka}.language.title`)} />
      <div className="flex flex-col gap-6 px-6">
        <p className="text-body-lg text-slate">{t(`${ka}.language.intro`)}</p>
        <RadioGroup value={locale} onValueChange={(v) => setLocale(v as Locale)}>
          {(['en', 'ar'] as const).map((l) => <RadioOption key={l} value={l} title={t(`onboarding.language.${l}.title`)} subtitle={t(`onboarding.language.${l}.subtitle`)} />)}
        </RadioGroup>
      </div>
    </Screen>
  );
}

/* 12.7 / 12.7a */
type Block =
  | { type: 'points' | 'do' | 'dont' | 'steps'; title: string; items: string[]; note?: string }
  | { type: 'list'; title: string; icon: IconName; items: string[] }
  | { type: 'section'; title: string; body: string; link?: string }
  | { type: 'cards'; title: string; icons: IconName[]; items: [string, string][]; after?: string; link?: string }
  | { type: 'contact'; title: string; link: string; line: string }
  | { type: 'company'; title: string; lines: string[] }
  | { type: 'banner'; text: string };
type Doc = { icon: IconName; title: string; intro: string; blocks: Block[] };
const DocLink = ({ v }: { v: string }) => <a href={v.includes('@') ? `mailto:${v}` : `https://${v}`} target="_blank" rel="noreferrer" className="self-start text-body-md text-red hover:underline" dir="ltr">{v}</a>;
const ItemCard = ({ items, icon }: { items: string[]; icon: (i: number) => ReactNode }) => (
  <div className="flex flex-col gap-3 rounded-lg bg-fog p-4">{items.map((it, i) => <p key={it} className="flex items-center gap-2 text-body-md">{icon(i)}<span className="flex-1">{it}</span></p>)}</div>
);
function DocBlock({ b }: { b: Block }) {
  const head = 'title' in b && b.type !== 'company' ? <h2 className="text-h3">{b.title}</h2> : null;
  switch (b.type) {
    case 'banner': return <Banner type="error">{b.text}</Banner>;
    case 'points': case 'do': case 'dont':
      return <div className="flex flex-col gap-3">{head}<ItemCard items={b.items} icon={() => <IconBadge icon={b.type === 'dont' ? 'x' : 'check'} size={32} tone={b.type === 'points' ? 'redTint' : 'white'} />} />{b.note ? <p className="text-body text-slate">{b.note}</p> : null}</div>;
    case 'list': return <div className="flex flex-col gap-3">{head}<ItemCard items={b.items} icon={() => <IconBadge icon={b.icon} size={32} tone="white" />} /></div>;
    case 'steps': return <div className="flex flex-col gap-3">{head}<ItemCard items={b.items} icon={(i) => <span className="grid size-8 shrink-0 place-items-center rounded-full bg-red text-body-md text-white">{i + 1}</span>} /></div>;
    case 'section': return <div className="flex flex-col gap-2">{head}<p className="text-body text-slate">{b.body}</p>{b.link ? <DocLink v={b.link} /> : null}</div>;
    case 'cards': return (
      <div className="flex flex-col gap-3">{head}
        <div className="flex flex-col gap-2">{b.items.map(([title, body], i) => <div key={title} className="flex gap-3 rounded-lg border border-dark-fog bg-fog p-4"><IconBadge icon={b.icons[i] ?? 'info'} size={32} /><div className="flex flex-1 flex-col gap-0.5"><span className="text-body-md">{title}</span><span className="text-body text-slate">{body}</span></div></div>)}</div>
        {b.after ? <p className="text-body text-slate">{b.after}</p> : null}{b.link ? <DocLink v={b.link} /> : null}
      </div>);
    case 'contact': return <div className="flex flex-col gap-3">{head}<p className="flex items-center gap-2"><IconBadge icon="mail" size={32} /><DocLink v={b.link} /></p><p className="text-caption text-slate">{b.line}</p></div>;
    case 'company': return <div className="flex flex-col gap-1 border-t border-dark-fog pt-4"><p className="text-body-md">{b.title}</p>{b.lines.map((l) => <p key={l} className="text-caption text-slate">{l}</p>)}</div>;
  }
}
export function Legal() {
  const { t } = useTranslation();
  const nav = useNavigate();
  return (
    <Screen>
      <TopBar title={t(`${ka}.legal.title`)} />
      <div className="flex flex-col gap-4 px-6">
        <p className="text-body text-slate">{t(`${ka}.legal.intro`)}</p>
        <ListGroup>{(['privacy', 'fraud', 'terms'] as const).map((d) => <ListRow key={d} icon="file" title={t(`${ka}.legal.${d}`)} onClick={() => nav(`/legal/${d}`)} />)}</ListGroup>
      </div>
    </Screen>
  );
}
export function LegalDoc() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { doc = 'privacy' } = useParams();
  const content = doc === 'terms' ? null : (t(`${ka}.legal.docs.${doc}`, { returnObjects: true }) as Doc);
  return (
    <Screen footer={content ? <Footer><Button onClick={() => nav(-1)}>{t(`${ka}.legal.done`)}</Button></Footer> : undefined}>
      <TopBar title={t(`${ka}.legal.${doc}`)} />
      <div className="flex flex-col gap-8 px-6 pt-2 pb-6">
        {content ? <>
          <div className="flex flex-col gap-3"><IconBadge icon={content.icon} size={56} /><h1 className="text-h2">{content.title}</h1><p className="text-body-lg text-slate">{content.intro}</p></div>
          {content.blocks.map((b, i) => <DocBlock key={i} b={b} />)}
        </> : <Banner type="info">{t(`${ka}.legal.placeholder`)}</Banner>}
      </div>
    </Screen>
  );
}

/* 13.1 */
export function Help() {
  const { t } = useTranslation();
  const k = `${ka}.help`;
  return (
    <Screen>
      <TopBar title={t(`${k}.title`)} />
      <div className="flex flex-col gap-6 px-6">
        <div className="flex flex-col gap-2"><h1 className="text-h2">{t(`${k}.heading`)}</h1><p className="text-body-lg text-slate">{t(`${k}.intro`)}</p></div>
        <ListGroup>
          <ListRow icon="phoneCall" title={t(`${k}.call`)} subtitle={ltr(supportContacts.phoneDisplay)} onClick={() => { location.href = `tel:${supportContacts.phone}`; }} />
          <ListRow icon="mail" title={t(`${k}.email`)} subtitle={supportContacts.email} onClick={() => { location.href = `mailto:${supportContacts.email}`; }} />
          <ListRow icon="help" title={t(`${k}.articles`)} onClick={() => window.open(supportContacts.articlesUrl, '_blank')} />
        </ListGroup>
      </div>
    </Screen>
  );
}

/* 13.2 */
export function Notifications() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const k = `${ka}.notifications`;
  const [allowed, setAllowed] = useState(false);
  const row = (n: (typeof demoNotifications)[number]) => (
    <button key={n.id} onClick={() => nav(n.opens === '4.1' ? '/verify/hub?stage=submitted' : `/soon/${n.opens}`)} className="flex w-full cursor-pointer items-center gap-3 py-3 text-start hover:bg-fog">
      <IconBadge icon={(n.kind === 'sent' ? 'send' : 'shield') as IconName} size={40} />
      <span className="flex flex-1 flex-col">
        <span className="text-body-md">{n.kind === 'sent' ? t(`${k}.sent`, { amount: formatMoney(n.amount, 'GBP', { decimals: 'always' }), name: n.name }) : t(`${k}.idDone`)}</span>
        <span className="text-caption text-slate">{n.when === 'today' ? t(`${k}.today`, { time: ltr(n.time ?? '') }) : t(`${k}.yesterday`)}</span>
      </span>
      {n.when === 'today' ? <span className="size-2 rounded-full bg-red" aria-hidden /> : null}
    </button>
  );
  return (
    <Screen>
      <TopBar title={t(`${k}.title`)} />
      <div className="flex flex-col gap-4 px-6">
        {!allowed ? <div className="flex items-center gap-3 rounded-lg bg-fog p-4"><Icon name="bell" size={20} /><span className="flex-1 text-body">{t(`${k}.prompt`)}</span><button onClick={() => setAllowed(true)} className="cursor-pointer text-body-md text-red">{t(`${k}.allow`)}</button></div> : null}
        <section><h2 className="text-overline text-slate">{t(`${k}.today_h`)}</h2>{demoNotifications.filter((n) => n.when === 'today').map(row)}</section>
        <section><h2 className="text-overline text-slate">{t(`${k}.earlier`)}</h2>{demoNotifications.filter((n) => n.when !== 'today').map(row)}</section>
      </div>
    </Screen>
  );
}
