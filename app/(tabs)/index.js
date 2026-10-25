import { Compass, Heart, Sparkles, Zap } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryChips from '@/components/CategoryChips';
import DestinationCard from '@/components/DestinationCard';
import QuickActionsMenu from '@/components/QuickActionsMenu';
import { categories, destinations, getDestination, getDestinationsByCategory } from '@/data/destinations';
import { useWishlist } from '@/hooks/useWishlist';

export default function DiscoverScreen() {
  const router = useRouter();
  const { isSaved, toggleSaved } = useWishlist();
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(0, (width - 52) / 2);
  const [category, setCategory] = useState('All');
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const featured = getDestination('goa');
  const visibleDestinations = useMemo(() => getDestinationsByCategory(category), [category]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.brandMark}><Compass size={17} color="#FFFFFF" /></View>
            <Text style={styles.brandName}>TRAVEL EXPLORER</Text>
          </View>
          <Pressable onPress={() => setQuickActionsOpen(true)} style={styles.headerAction} accessibilityLabel="Quick actions" accessibilityRole="button">
            <Zap size={19} color="#252720" />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>CURATED FOR CURIOUS MINDS</Text>
          <Text style={styles.title}>Somewhere{`\n`}worth going.</Text>
          <Text style={styles.subtitle}>Find your next favourite place, one beautiful detour at a time.</Text>
        </View>

        {featured && (
          <Pressable onPress={() => router.push(`/destination/${featured.id}`)} style={({ pressed }) => [styles.featured, pressed && styles.pressed]}>
            <Image source={{ uri: featured.image }} style={styles.featuredImage} />
            <View style={styles.featuredShade} />
            <View style={styles.featuredCopy}>
              <Text style={styles.featuredKicker}>FEATURED ESCAPE</Text>
              <Text style={styles.featuredName}>{featured.name}</Text>
              <Text style={styles.featuredLocation}>{featured.location}  ·  {featured.primaryCategory || featured.category}</Text>
            </View>
            <Pressable onPress={(event) => { event.stopPropagation(); toggleSaved(featured.id); }} style={styles.featuredHeart} accessibilityLabel={isSaved(featured.id) ? 'Remove Goa from wishlist' : 'Save Goa to wishlist'}>
              <Heart size={19} color="#252720" fill={isSaved(featured.id) ? '#C76F4E' : 'transparent'} />
            </Pressable>
          </Pressable>
        )}

        <Pressable onPress={() => router.push('/matcher')} style={({ pressed }) => [styles.confusedCard, pressed && styles.pressed]}>
          <View style={styles.confusedIcon}><Sparkles size={22} color="#FFFFFF" /></View>
          <View style={styles.confusedCopy}>
            <Text style={styles.confusedTitle}>I'm Confused</Text>
            <Text style={styles.confusedSubtitle}>Not sure where to go? Answer eight quick questions and we'll match you.</Text>
          </View>
          <Text style={styles.confusedArrow}>→</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Find your kind of escape</Text>
            <Text style={styles.sectionCaption}>A little inspiration for your next plan.</Text>
          </View>
        </View>
        <CategoryChips selected={category} onSelect={setCategory} />
        <View style={styles.grid}>
          {visibleDestinations.map((destination) => (
            <DestinationCard key={destination.id} width={cardWidth} destination={destination} saved={isSaved(destination.id)} onPress={() => router.push(`/destination/${destination.id}`)} onToggleSaved={() => toggleSaved(destination.id)} />
          ))}
        </View>
      </ScrollView>
      <QuickActionsMenu visible={quickActionsOpen} onClose={() => setQuickActionsOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#252720', alignItems: 'center', justifyContent: 'center' },
  brandName: { color: '#252720', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  headerAction: { backgroundColor: '#FFFFFF', width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E7E4DC' },
  hero: { paddingTop: 40, paddingBottom: 24 },
  eyebrow: { color: '#C76F4E', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#252720', fontSize: 42, lineHeight: 45, fontWeight: '800', letterSpacing: -1.5, marginTop: 10 },
  subtitle: { color: '#74766F', fontSize: 15, lineHeight: 23, maxWidth: 290, marginTop: 12 },
  featured: { height: 228, borderRadius: 24, overflow: 'hidden', backgroundColor: '#252720', marginBottom: 20 },
  featuredImage: { width: '100%', height: '100%' },
  featuredShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(37,39,32,0.34)' },
  featuredCopy: { position: 'absolute', left: 20, bottom: 20 },
  featuredKicker: { color: '#F5D8C8', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  featuredName: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 6 },
  featuredLocation: { color: '#F0F5EE', fontSize: 13, marginTop: 5 },
  featuredHeart: { position: 'absolute', top: 16, right: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  confusedCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#252720', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 18, marginBottom: 30 },
  confusedIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#C76F4E', alignItems: 'center', justifyContent: 'center' },
  confusedCopy: { flex: 1 },
  confusedTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  confusedSubtitle: { color: '#C9CBC4', fontSize: 12, lineHeight: 18, marginTop: 4 },
  confusedArrow: { color: '#C76F4E', fontSize: 20, fontWeight: '700' },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: { color: '#252720', fontSize: 21, fontWeight: '800', letterSpacing: -0.4 },
  sectionCaption: { color: '#74766F', fontSize: 13, marginTop: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16, marginTop: 18 },
  pressed: { opacity: 0.9 },
});
