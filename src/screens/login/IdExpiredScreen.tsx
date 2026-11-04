/**
 * 7.6 ID expired (EN 82:9762), shown after login when the customer's ID has expired: Illustration/idCard 144,
 * "Your ID has expired", Primary "Verify my identity" + Ghost "Remind me later" (content pt spacing/32 pb spacing/24,
 * footer pb spacing/32). Figma draws it as a full screen (the build doc calls it a sheet).
 */
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Illustration } from '../../components';
import { useTheme } from '../../theme';
import { MessageLayout } from '../common/MessageLayout';
import type { RootStackParamList } from '../../navigation/routes';

export function IdExpiredScreen({ navigation }: NativeStackScreenProps<RootStackParamList, '7.6'>) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <MessageLayout
      illustration={<Illustration name="idCard" size={t.sizes.illustration.small} />}
      title={tr('login.7_6.title')}
      body={tr('login.7_6.body')}
      contentPadTop="spacing/32"
      contentPadBottom="spacing/24"
      footerPadBottom="spacing/32"
      footer={
        <>
          <Button label={tr('login.7_6.verify')} onPress={() => navigation.navigate('4.1a')} />
          <Button type="ghost" label={tr('login.7_6.later')} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} />
        </>
      }
    />
  );
}
