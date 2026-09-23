import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    PoppinsRegular: require('../assets/fonts/Poppins_400Regular.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins_500Medium.ttf'),
    PoppinsSemiBold: require('../assets/fonts/Poppins_600SemiBold.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins_700Bold.ttf'),
  });

  const isReady = fontsLoaded || !!fontError;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady]);

  // Sem as fontes o app segue com a fonte do sistema em vez de ficar preso na splash.
  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Slot />
    </SafeAreaProvider>
  );
}
