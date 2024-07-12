import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'sama.client',
  appName: 'Sama',
  webDir: 'build',
  backgroundColor: '#1b1b1d',
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
  },
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Native,
      style: KeyboardStyle.Dark,
      resizeOnFullScreen: true,
    },
  },
};

export default config;
