// app/_layout.tsx

import 'react-native-get-random-values';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { ConvexProvider } from 'convex/react';
import { convex } from '../lib/convex';

// 1. Import font hooks
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native'; // Import View

// 2. Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 3. Load the fonts
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // 4. Hide the splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 5. If fonts are not loaded, show a blank screen
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // 6. Render the app
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexProvider client={convex}>
        <ThemeProvider>
          {/* We add a main View to set the default font for the whole app */}
          <View style={{ flex: 1, fontFamily: 'Inter_400Regular' }}>
            <Slot />
          </View>
        </ThemeProvider>
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}