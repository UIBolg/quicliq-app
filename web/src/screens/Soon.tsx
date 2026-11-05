/** Placeholder for flows not in this web preview yet (shows the Figma screen ID). */
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Illustration } from '@/components/Art';
import { Screen, TopBar } from '@/components/quicliq';

export function Soon() {
  const { id = '' } = useParams();
  const { t } = useTranslation();
  const nav = useNavigate();
  return (
    <Screen footer={<div className="px-6 pb-10"><Button onClick={() => nav(-1)}>{t('common.back')}</Button></div>}>
      <TopBar title={id} />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <Illustration name="idCard" size={144} />
        <h1 className="text-h2">{t('notBuilt.title', { id })}</h1>
        <p className="text-body-lg text-slate">{t('notBuilt.body', { id })}</p>
      </div>
    </Screen>
  );
}
