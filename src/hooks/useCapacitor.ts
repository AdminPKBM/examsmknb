
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const setupCapacitor = async () => {
      if (Capacitor.isNativePlatform()) {
        setIsNative(true);
        
        try {
          // Hide splash screen
          await SplashScreen.hide();
          
          // Handle back button - completely disable it during exam
          App.addListener('backButton', ({ canGoBack }) => {
            // Always prevent back button in native app during exam
            console.log('Back button pressed - blocked for exam security');
            return;
          });

          // Prevent app from going to background
          App.addListener('appStateChange', ({ isActive }) => {
            if (!isActive) {
              // Try to bring app back to foreground
              console.log('App went to background - attempting to restore');
            }
          });
        } catch (error) {
          console.log('Capacitor setup error:', error);
        }
      }
    };

    setupCapacitor();
  }, []);

  return { isNative };
};
