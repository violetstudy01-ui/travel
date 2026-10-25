import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { WishlistProvider } from '@/hooks/useWishlist';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <WishlistProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </WishlistProvider>
  );
}
