/**
 * The bottom tabs shared by the main screens (Home, 12.1 Account). Tabs without a screen yet open NotBuilt.
 * Switching tabs replaces the current screen so the stack doesn't grow while hopping between tabs.
 */
import { useTranslation } from 'react-i18next';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TabBarItem } from '../components';
import type { RootStackParamList } from './routes';

export type MainTab = 'home' | 'send' | 'history' | 'profile';

export function useMainTabs(navigation: Pick<NativeStackNavigationProp<RootStackParamList>, 'navigate' | 'replace'>) {
  const { t: tr } = useTranslation();
  const items: TabBarItem[] = [
    { key: 'home', icon: 'home', label: tr('home.tabs.home') },
    { key: 'send', icon: 'send', label: tr('home.tabs.send') },
    { key: 'history', icon: 'history', label: tr('home.tabs.history') },
    { key: 'profile', icon: 'user', label: tr('home.tabs.profile') },
  ];
  const onSelect = (key: string) => {
    if (key === 'home') navigation.replace('Home');
    else if (key === 'history') navigation.replace('11.1');
    else if (key === 'profile') navigation.replace('12.1');
    else navigation.navigate('NotBuilt', { screenId: items.find((x) => x.key === key)?.label ?? key });
  };
  return { items, onSelect };
}
