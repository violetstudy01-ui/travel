import { ArrowLeft, Calendar, Clock, Users, Zap, MapPin, Utensils, Coffee } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Platform, Linking } from 'react-native';
import { getDestination } from '@/data/destinations';

const interestOptions = [
  { id: 'sightseeing', label: 'Sightseeing' },
  { id: 'food', label: 'Local food' },
  { id: 'nature', label: 'Nature & relaxation' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'culture', label: 'Culture & history' },
  { id: 'spiritual', label: 'Spiritual' },
];

const paceOptions = [
  { id: 'relaxed', label: 'Relaxed', desc: 'One main activity per day' },
  { id: 'balanced', label: 'Balanced', desc: 'Two key activities with breaks' },
  { id: 'packed', label: 'Packed', desc: 'Make the most of every day' },
];

const companionOptions = [
  { id: 'solo', label: 'Solo' },
  { id: 'friends', label: 'Friends' },
  { id: 'family', label: 'Family' },
  { id: 'partner', label: 'Partner' },
];

const durationOptions = [1, 2, 3, 4, 5];

function triggerHaptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

function generateItinerary(destination, { duration, pace, interests }) {
  const days = [];
  const attractions = [...destination.attractions];
  const foods = destination.localFood || [];

  for (let day = 1; day <= duration; day++) {
    const activities = [];
    const itemsPerDay = pace === 'relaxed' ? 1 : pace === 'balanced' ? 2 : 3;

    for (let i = 0; i < itemsPerDay && attractions.length > 0; i++) {
      const attraction = attractions.shift();
      activities.push({
        type: 'attraction',
        title: attraction.name,
        description: attraction.description,
        mapQuery: attraction.mapQuery,
        time: i === 0 ? 'Morning' : i === 1 ? 'Afternoon' : 'Late afternoon',
      });
    }

    if (foods.length > 0) {
      const foodIndex = (day - 1) % foods.length;
      activities.push({
        type: 'food',
        title: `Try ${foods[foodIndex].name}`,
        description: foods[foodIndex].description,
        time: 'Lunch or dinner',
      });
    }

    if (pace !== 'packed' && day > 1) {
      activities.push({
        type: 'rest',
        title: 'Slow morning or rest break',
        description: 'Take it easy before heading out. Flexibility is part of the plan.',
        time: 'As needed',
      });
    }

    if (interests.includes('nature') && destination.categories.includes('Mountains')) {
      activities.push({
        type: 'note',
        title: 'Nature walk or viewpoint',
        description: 'Explore a nearby trail or viewpoint at your own pace.',
        time: 'Evening',
      });
    }

    days.push({ day, activities });
  }

  return days;
}

export default function PlanTripScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const destination = getDestination(Array.isArray(id) ? id[0] : id);

  const [duration, setDuration] = useState(2);
  const [companions, setCompanions] = useState('solo');
  const [pace, setPace] = useState('balanced');
  const [interests, setInterests] = useState(['sightseeing', 'food']);
  const [generated, setGenerated] = useState(false);

  const itinerary = useMemo(() => {
    if (!generated || !destination) return [];
    return generateItinerary(destination, { duration, pace, interests });
  }, [generated, destination, duration, pace, interests]);

  if (!destination) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>We couldn't find that destination.</Text>
          <Pressable style={styles.backLink} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.backLinkText}>Back to Discover</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const toggleInterest = (interestId) => {
    setInterests((prev) => prev.includes(interestId) ? prev.filter((i) => i !== interestId) : [...prev, interestId]);
    triggerHaptic();
  };

  const openMap = (mapQuery) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery + ' ' + destination.location)}`;
    Linking.openURL(url);
  };

  if (generated) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.itineraryHeader}>
            <Pressable onPress={() => setGenerated(false)} style={styles.backBtn}>
              <ArrowLeft size={20} color="#252720" />
            </Pressable>
            <Text style={styles.eyebrow}>SUGGESTED ITINERARY</Text>
            <Text style={styles.itineraryTitle}>{duration}-day plan for {destination.name}</Text>
            <Text style={styles.itineraryNote}>This is a suggested plan, not a fixed schedule. Adjust based on weather, energy, and local conditions.</Text>
          </View>

          {destination.isRoute && destination.routeNote && (
            <View style={styles.routeWarning}>
              <Text style={styles.routeWarningText}>{destination.routeNote}</Text>
            </View>
          )}

          {itinerary.map((day) => (
            <View key={day.day} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <View style={styles.dayBadge}><Text style={styles.dayBadgeText}>DAY {day.day}</Text></View>
              </View>
              {day.activities.map((activity, i) => (
                <View key={i} style={styles.activityRow}>
                  <View style={styles.activityTime}>
                    <Text style={styles.activityTimeText}>{activity.time}</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <View style={styles.activityIconRow}>
                      {activity.type === 'attraction' && <MapPin size={15} color="#C76F4E" />}
                      {activity.type === 'food' && <Utensils size={15} color="#C76F4E" />}
                      {activity.type === 'rest' && <Coffee size={15} color="#C76F4E" />}
                      {activity.type === 'note' && <Zap size={15} color="#C76F4E" />}
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                    </View>
                    <Text style={styles.activityDesc}>{activity.description}</Text>
                    {activity.mapQuery && (
                      <Pressable style={styles.mapLink} onPress={() => openMap(activity.mapQuery)}>
                        <Text style={styles.mapLinkText}>Open in Maps</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ))}

          <View style={styles.itineraryFooter}>
            <Pressable style={styles.editBtn} onPress={() => setGenerated(false)}>
              <Text style={styles.editBtnText}>Edit preferences</Text>
            </Pressable>
            <Pressable style={styles.destBtn} onPress={() => router.push(`/destination/${destination.id}`)}>
              <Text style={styles.destBtnText}>Back to destination</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.formHeader}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#252720" />
          </Pressable>
          <Text style={styles.eyebrow}>PLAN YOUR TRIP</Text>
          <Text style={styles.formTitle}>Build your {destination.name} plan</Text>
        </View>

        <Image source={{ uri: destination.image }} style={styles.destPreview} />

        <View style={styles.formSection}>
          <View style={styles.sectionIconRow}><Calendar size={16} color="#C76F4E" /><Text style={styles.sectionLabel}>Trip duration</Text></View>
          <View style={styles.durationRow}>
            {durationOptions.map((d) => (
              <Pressable key={d} style={[styles.durationChip, duration === d && styles.chipSelected]} onPress={() => { setDuration(d); triggerHaptic(); }}>
                <Text style={[styles.durationChipText, duration === d && styles.chipTextSelected]}>{d} {d === 1 ? 'day' : 'days'}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionIconRow}><Users size={16} color="#C76F4E" /><Text style={styles.sectionLabel}>Travelling with</Text></View>
          <View style={styles.optionRow}>
            {companionOptions.map((opt) => (
              <Pressable key={opt.id} style={[styles.optionChip, companions === opt.id && styles.chipSelected]} onPress={() => { setCompanions(opt.id); triggerHaptic(); }}>
                <Text style={[styles.optionChipText, companions === opt.id && styles.chipTextSelected]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionIconRow}><Zap size={16} color="#C76F4E" /><Text style={styles.sectionLabel}>Preferred pace</Text></View>
          <View style={styles.paceWrap}>
            {paceOptions.map((opt) => (
              <Pressable key={opt.id} style={[styles.paceCard, pace === opt.id && styles.paceSelected]} onPress={() => { setPace(opt.id); triggerHaptic(); }}>
                <Text style={[styles.paceLabel, pace === opt.id && styles.paceLabelSelected]}>{opt.label}</Text>
                <Text style={styles.paceDesc}>{opt.desc}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionIconRow}><MapPin size={16} color="#C76F4E" /><Text style={styles.sectionLabel}>Interests & activities</Text></View>
          <View style={styles.interestWrap}>
            {interestOptions.map((opt) => (
              <Pressable key={opt.id} style={[styles.interestChip, interests.includes(opt.id) && styles.chipSelected]} onPress={() => toggleInterest(opt.id)}>
                <Text style={[styles.interestChipText, interests.includes(opt.id) && styles.chipTextSelected]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable style={styles.generateBtn} onPress={() => { setGenerated(true); triggerHaptic(); }}>
          <Text style={styles.generateBtnText}>Generate my itinerary</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { paddingHorizontal: 20, paddingBottom: 60 },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E7E4DC' },
  eyebrow: { color: '#C76F4E', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 16 },
  formHeader: { paddingTop: 8 },
  formTitle: { color: '#252720', fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 10 },
  destPreview: { width: '100%', height: 180, borderRadius: 20, marginTop: 20 },
  formSection: { marginTop: 28 },
  sectionIconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionLabel: { color: '#252720', fontSize: 15, fontWeight: '700' },
  durationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  durationChip: { borderWidth: 1.5, borderColor: '#E7E4DC', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  chipSelected: { borderColor: '#C76F4E', backgroundColor: '#C76F4E' },
  durationChipText: { color: '#252720', fontSize: 13, fontWeight: '600' },
  chipTextSelected: { color: '#FFFFFF' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  optionChip: { borderWidth: 1.5, borderColor: '#E7E4DC', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  optionChipText: { color: '#252720', fontSize: 13, fontWeight: '600' },
  paceWrap: { gap: 10, marginTop: 14 },
  paceCard: { borderWidth: 1.5, borderColor: '#E7E4DC', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF' },
  paceSelected: { borderColor: '#C76F4E', backgroundColor: '#FBEDE6' },
  paceLabel: { color: '#252720', fontSize: 15, fontWeight: '700' },
  paceLabelSelected: { color: '#C76F4E' },
  paceDesc: { color: '#74766F', fontSize: 12, marginTop: 4 },
  interestWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  interestChip: { borderWidth: 1.5, borderColor: '#E7E4DC', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  interestChipText: { color: '#252720', fontSize: 13, fontWeight: '600' },
  generateBtn: { backgroundColor: '#252720', borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 34 },
  generateBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  itineraryHeader: { paddingTop: 8, paddingBottom: 20 },
  itineraryTitle: { color: '#252720', fontSize: 24, fontWeight: '800', letterSpacing: -0.3, marginTop: 10 },
  itineraryNote: { color: '#74766F', fontSize: 13, lineHeight: 20, marginTop: 10 },
  routeWarning: { backgroundColor: '#FBEDE6', borderRadius: 14, borderWidth: 1, borderColor: '#C76F4E', padding: 14, marginBottom: 20 },
  routeWarningText: { color: '#9C554C', fontSize: 13, lineHeight: 20 },
  dayCard: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E7E4DC', padding: 18, marginBottom: 16 },
  dayHeader: { marginBottom: 14 },
  dayBadge: { backgroundColor: '#252720', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' },
  dayBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  activityRow: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F0EEE8' },
  activityTime: { width: 80, paddingTop: 2 },
  activityTimeText: { color: '#C76F4E', fontSize: 11, fontWeight: '700' },
  activityContent: { flex: 1 },
  activityIconRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  activityTitle: { color: '#252720', fontSize: 14, fontWeight: '700' },
  activityDesc: { color: '#74766F', fontSize: 13, lineHeight: 19, marginTop: 5 },
  mapLink: { marginTop: 8, alignSelf: 'flex-start' },
  mapLinkText: { color: '#C76F4E', fontSize: 12, fontWeight: '700' },
  itineraryFooter: { alignItems: 'center', gap: 12, paddingTop: 10 },
  editBtn: { borderWidth: 1.5, borderColor: '#252720', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 32 },
  editBtnText: { color: '#252720', fontSize: 15, fontWeight: '700' },
  destBtn: { backgroundColor: '#C76F4E', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 32 },
  destBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  notFoundText: { color: '#74766F', fontSize: 16 },
  backLink: { marginTop: 20 },
  backLinkText: { color: '#C76F4E', fontSize: 15, fontWeight: '700' },
});
