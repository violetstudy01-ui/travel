import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DestinationCard from '@/components/DestinationCard';
import EmptyState from '@/components/EmptyState';
import { destinations } from '@/data/destinations';
import { useWishlist } from '@/hooks/useWishlist';

export default function WishlistScreen() {
  const router = useRouter();
  const { savedIds, isLoading, isSaved, toggleSaved, storageError } = useWishlist();
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(0, (width - 52) / 2);
  const savedDestinations = destinations.filter((destination) => savedIds.includes(destination.id));
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><Text style={styles.eyebrow}>YOUR LITTLE LIST</Text><Text style={styles.title}>Your Wishlist</Text><Text style={styles.subtitle}>Places worth coming back to.</Text>{storageError && <Text style={styles.error}>{storageError}</Text>}{isLoading ? <View style={styles.loading}><Text style={styles.loadingText}>Restoring your saved places…</Text></View> : savedDestinations.length === 0 ? <EmptyState title="Your next adventure starts here." message="Save the places you would love to explore." actionLabel="Explore destinations" onAction={() => router.push('/(tabs)')} /> : <View style={styles.grid}>{savedDestinations.map((destination) => <DestinationCard key={destination.id} width={cardWidth} destination={destination} saved={isSaved(destination.id)} onPress={() => router.push(`/destination/${destination.id}`)} onToggleSaved={() => toggleSaved(destination.id)} />)}</View>}</ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#F8F7F2' }, content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 100 }, eyebrow: { color: '#C76F4E', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 }, title: { color: '#252720', fontSize: 34, fontWeight: '800', letterSpacing: -1, marginTop: 10 }, subtitle: { color: '#74766F', fontSize: 14, marginTop: 8 }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16, marginTop: 28 }, loading: { alignItems: 'center', paddingVertical: 80 }, loadingText: { color: '#74766F', fontSize: 14 }, error: { color: '#9B554C', fontSize: 13, marginTop: 18, lineHeight: 19 } });
