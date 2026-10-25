import { ArrowLeft, Calendar, Heart, Lightbulb, MapPin, Utensils, Sparkles } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AttractionCard from '@/components/AttractionCard';
import DestinationCard from '@/components/DestinationCard';
import EmptyState from '@/components/EmptyState';
import { getDestination, getRecommendations } from '@/data/destinations';
import { useWishlist } from '@/hooks/useWishlist';

export default function DestinationDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const destination = getDestination(Array.isArray(id) ? id[0] : id);
  const { isSaved, toggleSaved } = useWishlist();
  const [imageFailed, setImageFailed] = useState(false);

  if (!destination) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState title="This place moved on." message="We couldn't find that destination." actionLabel="Back to Discover" onAction={() => router.replace('/(tabs)')} />
      </SafeAreaView>
    );
  }

  const recommendations = getRecommendations(destination);
  const saved = isSaved(destination.id);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          {!imageFailed && <Image key={destination.image} source={{ uri: destination.image }} onError={() => setImageFailed(true)} style={styles.heroImage} />}
          {imageFailed && <View style={styles.heroFallback}><Text style={styles.heroFallbackText}>Travel Explorer</Text></View>}
          <View style={styles.heroOverlay} />
          <Pressable onPress={() => router.back()} style={styles.back} accessibilityLabel="Go back">
            <ArrowLeft size={21} color="#252720" />
          </Pressable>
          <Pressable onPress={() => toggleSaved(destination.id)} style={styles.save} accessibilityLabel={saved ? `Remove ${destination.name} from wishlist` : `Save ${destination.name} to wishlist`}>
            <Heart size={20} color="#252720" fill={saved ? '#C76F4E' : 'transparent'} />
          </Pressable>
          <View style={styles.heroLabel}>
            <Text style={styles.heroCategory}>{destination.primaryCategory?.toUpperCase() || destination.category.toUpperCase()}</Text>
            <Text style={styles.heroName}>{destination.name}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.location}>
            <MapPin size={16} color="#C76F4E" />
            <Text style={styles.locationText}>{destination.location}</Text>
          </View>

          {destination.isRoute && (
            <View style={styles.routeInfo}>
              <View style={styles.routeRow}><Text style={styles.routeLabel}>Start</Text><Text style={styles.routeValue}>{destination.routeStart}</Text></View>
              <View style={styles.routeDivider} />
              <View style={styles.routeRow}><Text style={styles.routeLabel}>End</Text><Text style={styles.routeValue}>{destination.routeEnd}</Text></View>
            </View>
          )}

          <Text style={styles.sectionTitle}>About this place</Text>
          <Text style={styles.description}>{destination.description}</Text>

          <Text style={styles.sectionTitle}>Plan your visit</Text>
          <View style={styles.planRow}>
            <View style={styles.planCard}>
              <View style={styles.planIconRow}><Calendar size={14} color="#C76F4E" /><Text style={styles.planLabel}>BEST TIME TO VISIT</Text></View>
              <Text style={styles.planValue}>{destination.bestTimeToVisit}</Text>
            </View>
            <View style={styles.planCard}>
              <View style={styles.planIconRow}><MapPin size={14} color="#C76F4E" /><Text style={styles.planLabel}>SUGGESTED DURATION</Text></View>
              <Text style={styles.planValue}>{destination.suggestedDuration}</Text>
            </View>
          </View>

          {destination.fact && (
            <View style={styles.factCard}>
              <View style={styles.factHeader}><Lightbulb size={18} color="#C76F4E" /><Text style={styles.factTitle}>Did You Know?</Text></View>
              <Text style={styles.factText}>{destination.fact}</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Popular attractions</Text>
          <Text style={styles.sectionHint}>Tap any attraction to open it in Google Maps.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.attractions}>
            {destination.attractions.map((attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} location={destination.location} />
            ))}
          </ScrollView>

          {destination.localFood && destination.localFood.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Local food to try</Text>
              <View style={styles.foodWrap}>
                {destination.localFood.map((dish, i) => (
                  <View key={i} style={styles.foodCard}>
                    <View style={styles.foodIcon}><Utensils size={15} color="#C76F4E" /></View>
                    <View style={styles.foodCopy}>
                      <Text style={styles.foodName}>{dish.name}</Text>
                      <Text style={styles.foodDesc}>{dish.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.actionRow}>
            <Pressable style={styles.planTripBtn} onPress={() => router.push(`/plan-trip/${destination.id}`)}>
              <Sparkles size={18} color="#FFFFFF" />
              <Text style={styles.planTripBtnText}>Plan Your Trip</Text>
            </Pressable>
            <Pressable style={[styles.wishlistBtn, saved && styles.wishlistBtnActive]} onPress={() => toggleSaved(destination.id)}>
              <Heart size={18} color={saved ? '#FFFFFF' : '#252720'} fill={saved ? '#FFFFFF' : 'transparent'} />
              <Text style={[styles.wishlistBtnText, saved && styles.wishlistBtnTextActive]}>{saved ? 'Saved' : 'Save'}</Text>
            </Pressable>
          </View>

          <View style={styles.recommendHeader}>
            <Text style={styles.sectionTitle}>You might also love</Text>
            <Text style={styles.recommendHint}>Similar destinations</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendations}>
            {recommendations.map((item) => (
              <DestinationCard key={item.id} destination={item} compact saved={isSaved(item.id)} onPress={() => router.push(`/destination/${item.id}`)} onToggleSaved={() => toggleSaved(item.id)} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { paddingBottom: 100 },
  hero: { height: 360, marginHorizontal: 12, borderRadius: 28, overflow: 'hidden', backgroundColor: '#E9DDC9' },
  heroImage: { width: '100%', height: '100%' },
  heroFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroFallbackText: { color: '#9C765E', fontSize: 16, fontWeight: '700' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(37,39,32,0.22)' },
  back: { position: 'absolute', top: 16, left: 16, width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  save: { position: 'absolute', top: 16, right: 16, width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  heroLabel: { position: 'absolute', left: 22, bottom: 22 },
  heroCategory: { color: '#F5D8C8', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  heroName: { color: '#FFFFFF', fontSize: 42, lineHeight: 46, fontWeight: '800', letterSpacing: -1, marginTop: 4 },
  body: { paddingHorizontal: 20 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20 },
  locationText: { color: '#C76F4E', fontSize: 14, fontWeight: '600' },
  routeInfo: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E7E4DC', padding: 16, marginTop: 16 },
  routeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  routeLabel: { color: '#74766F', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  routeValue: { color: '#252720', fontSize: 14, fontWeight: '700' },
  routeDivider: { height: 1, backgroundColor: '#F0EEE8', marginVertical: 10 },
  sectionTitle: { color: '#252720', fontSize: 21, fontWeight: '800', letterSpacing: -0.3, marginTop: 28 },
  sectionHint: { color: '#74766F', fontSize: 12, marginTop: 5 },
  description: { color: '#62645E', fontSize: 15, lineHeight: 24, marginTop: 10, maxWidth: 720 },
  planRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  planCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 17, borderWidth: 1, borderColor: '#E7E4DC', padding: 14, minHeight: 90 },
  planIconRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  planLabel: { color: '#74766F', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  planValue: { color: '#252720', fontSize: 14, lineHeight: 20, fontWeight: '700', marginTop: 8 },
  factCard: { backgroundColor: '#FBEDE6', borderRadius: 18, padding: 18, marginTop: 20, borderLeftWidth: 3, borderLeftColor: '#C76F4E' },
  factHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  factTitle: { color: '#C76F4E', fontSize: 14, fontWeight: '800' },
  factText: { color: '#62645E', fontSize: 14, lineHeight: 22, marginTop: 10 },
  attractions: { gap: 12, paddingTop: 14, paddingRight: 20 },
  foodWrap: { gap: 10, marginTop: 14 },
  foodCard: { flexDirection: 'row', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E7E4DC', padding: 14 },
  foodIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FBEDE6', alignItems: 'center', justifyContent: 'center' },
  foodCopy: { flex: 1 },
  foodName: { color: '#252720', fontSize: 15, fontWeight: '700' },
  foodDesc: { color: '#74766F', fontSize: 13, lineHeight: 19, marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 28 },
  planTripBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#C76F4E', borderRadius: 24, paddingVertical: 16 },
  planTripBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  wishlistBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 24, paddingVertical: 16, paddingHorizontal: 22, borderWidth: 1.5, borderColor: '#E7E4DC' },
  wishlistBtnActive: { backgroundColor: '#252720', borderColor: '#252720' },
  wishlistBtnText: { color: '#252720', fontSize: 15, fontWeight: '700' },
  wishlistBtnTextActive: { color: '#FFFFFF' },
  recommendHeader: { marginTop: 6 },
  recommendHint: { color: '#74766F', fontSize: 13, marginTop: 5 },
  recommendations: { gap: 12, paddingTop: 14, paddingRight: 20 },
});
