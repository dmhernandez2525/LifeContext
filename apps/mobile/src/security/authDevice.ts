import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getDeviceName = (): string => {
  const name = Constants.deviceName;
  if (!name) {
    return `${Platform.OS} device`;
  }

  return name;
};

export const getDeviceLabel = (): string => {
  return `${getDeviceName()} (${Platform.OS})`;
};

export const getDeviceId = (): string => {
  const appOwnership = Constants.appOwnership ?? 'unknown';
  return `${Platform.OS}-${appOwnership}-${getDeviceName().toLowerCase().replace(/\\s+/g, '-')}`;
};
