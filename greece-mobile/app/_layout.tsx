import {
  Cinzel_400Regular,
  Cinzel_700Bold,
  Cinzel_900Black,
} from "@expo-google-fonts/cinzel";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CartProvider } from "@/contexts/CartContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="product/[slug]"
        options={{
          headerShown: false,
          presentation: "card",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen name="track" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="contact" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="story" options={{ headerShown: false }} />
      <Stack.Screen name="culture" options={{ headerShown: false }} />
      <Stack.Screen name="faq" options={{ headerShown: false }} />
      <Stack.Screen name="shipping" options={{ headerShown: false }} />
      <Stack.Screen name="size-guide" options={{ headerShown: false }} />
      <Stack.Screen name="community" options={{ headerShown: false }} />
      <Stack.Screen name="careers" options={{ headerShown: false }} />
      <Stack.Screen name="checkout-success" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Cinzel_400Regular,
    Cinzel_700Bold,
    Cinzel_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </CartProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
