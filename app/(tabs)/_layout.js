import { Tabs } from 'expo-router';
import { Compass, Heart, Search } from 'lucide-react-native';

export default function TabsLayout() {
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#C76F4E', tabBarInactiveTintColor: '#74766F', tabBarStyle: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E7E4DC', height: 76, paddingTop: 10, paddingBottom: 14 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '700' } }}>
    <Tabs.Screen name="index" options={{ title: 'Discover', tabBarIcon: ({ color, size }) => <Compass size={size} color={color} /> }} />
    <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ color, size }) => <Search size={size} color={color} /> }} />
    <Tabs.Screen name="wishlist" options={{ title: 'Wishlist', tabBarIcon: ({ color, size }) => <Heart size={size} color={color} /> }} />
  </Tabs>;
}
