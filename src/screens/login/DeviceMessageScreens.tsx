/**
 * 7.8c We couldn't verify you (New Designs 57:28389): Illustration/locked 160 · Primary "Contact support" → 7.7c ·
 * Ghost "Back to log in" → 7.1.
 * 7.11 Device verified (57:28344): Illustration/newDevice 160 · Primary "Continue" → Home (the API registers this
 * phone as the trusted device).
 */
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Illustration } from '../../components';
import { MessageLayout } from '../common/MessageLayout';
import type { RootStackParamList } from '../../navigation/routes';

export function VerifyLockedScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '7.8c'>) {
  const { t: tr } = useTranslation();
  return (
    <MessageLayout
      illustration={<Illustration name="locked" />}
      title={tr('login.7_8c.title')}
      body={tr('login.7_8c.body')}
      footer={
        <>
          <Button label={tr('login.7_7c.title')} onPress={() => navigation.navigate('7.7c')} testID="contact-support" />
          <Button type="ghost" label={tr('login.7_8c.back')} onPress={() => navigation.popTo('7.1')} testID="back-to-login" />
        </>
      }
    />
  );
}

export function DeviceVerifiedScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '7.11'>) {
  const { t: tr } = useTranslation();
  return (
    <MessageLayout
      illustration={<Illustration name="newDevice" />}
      title={tr('login.7_11.title')}
      body={tr('login.7_11.body')}
      footer={<Button label={tr('common.continue')} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} testID="continue" />}
    />
  );
}
