
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3fd63411784d4c1e90d81a67242d4edc',
  appName: 'fyke-connect-india',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://3fd63411-784d-4c1e-90d8-1a67242d4edc.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'beep.wav'
    }
  }
};

export default config;
