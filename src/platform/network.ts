/** Whether the device can reach the internet right now (7.5 Offline). Unknown counts as online. */
import { getNetworkStateAsync } from 'expo-network';

export async function isOffline(): Promise<boolean> {
  try {
    const s = await getNetworkStateAsync();
    return s.isConnected === false || s.isInternetReachable === false;
  } catch {
    return false;
  }
}
