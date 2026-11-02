/**
 * 7.5 Offline (EN 82:9735): Illustration/offline 160, "You're offline", Primary "Try again" with refresh icon
 * (footer pb spacing/40). Try again re-checks the connection and returns to Log in when it is back.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Illustration } from '../../components';
import { isOffline } from '../../platform/network';
import { MessageLayout } from '../common/MessageLayout';
import type { RootStackParamList } from '../../navigation/routes';

export function OfflineScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '7.5'>) {
  const { t: tr } = useTranslation();
  const [checking, setChecking] = useState(false);
  const retry = async () => {
    setChecking(true);
    const offline = await isOffline();
    setChecking(false);
    if (!offline) navigation.goBack();
  };
  return (
    <MessageLayout
      illustration={<Illustration name="offline" />}
      title={tr('login.7_5.title')}
      body={tr('login.7_5.body')}
      footer={<Button type={checking ? 'loading' : 'primary'} icon="refresh" label={tr('login.7_5.retry')} onPress={retry} testID="retry" />}
    />
  );
}
