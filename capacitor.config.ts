
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.a65026fe04a54433ad5e8423a0d5d3ed',
  appName: 'ExamBrowser',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://a65026fe-04a5-4433-ad5e-8423a0d5d3ed.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e40af',
      showSpinner: false
    }
  }
};

export default config;
