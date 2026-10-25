import { Search, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryChips from '@/components/CategoryChips';
import DestinationCard from '@/components/DestinationCard';
import EmptyState from '@/components/EmptyState';
import { destinations, getDestinationsByCategory, searchDestinations } from '@/data/destinations';
import { useWishlist } from '@/hooks/useWishlist';

export default function SearchScreen() {
  const router = useRouter();
  const { isSaved, toggleSaved } = useWishlist();
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(0, (width - 52) / 2);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [focused, setFocused] = useState(false);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let list = getDestinationsByCategory(category);
    if (normalized) list = list.filter((item) => item.name.toLowerCase().includes(normalized) || item.location.toLowerCase().includes(normalized) || item.categories.some((c) => c.toLowerCase().includes(normalized)));
    return list;
  }, [category, query]);
  const clearAll = () => { setQuery(''); setCategory('All'); };
  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <Text style={styles.eyebrow}>TAKE THE SCENIC ROUTE</Text><Text style={styles.title}>Search places</Text><Text style={styles.subtitle}>A shortcut to somewhere you’ll want to remember.</Text>
    <View style={[styles.inputWrap, focused && styles.inputFocused]}><Search size={20} color="#C76F4E" /><TextInput value={query} onChangeText={setQuery} placeholder="Where do you want to go?" placeholderTextColor="#9A9F98" style={styles.input} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} returnKeyType="search" autoCorrect={false} />{query.length > 0 && <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search"><X size={18} color="#74766F" /></Pressable>}</View>
    <Text style={styles.filterLabel}>BROWSE BY MOOD</Text><CategoryChips selected={category} onSelect={setCategory} />
    <View style={styles.resultsHeader}><Text style={styles.resultsTitle}>{query.trim() || category !== 'All' ? `${results.length} ${results.length === 1 ? 'place' : 'places'} found` : 'All destinations'}</Text>{(query || category !== 'All') && <Pressable onPress={clearAll}><Text style={styles.clear}>Reset</Text></Pressable>}</View>
    {results.length > 0 ? <View style={styles.grid}>{results.map((destination) => <DestinationCard key={destination.id} width={cardWidth} destination={destination} saved={isSaved(destination.id)} onPress={() => router.push(`/destination/${destination.id}`)} onToggleSaved={() => toggleSaved(destination.id)} />)}</View> : <EmptyState search title="No places found." message="Try another destination or category." actionLabel="Clear filters" onAction={clearAll} />}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#F8F7F2' }, content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 100 }, eyebrow: { color: '#C76F4E', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 }, title: { color: '#252720', fontSize: 34, fontWeight: '800', letterSpacing: -1, marginTop: 10 }, subtitle: { color: '#74766F', fontSize: 14, lineHeight: 21, marginTop: 8 }, inputWrap: { height: 54, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7E4DC', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 24 }, inputFocused: { borderColor: '#C76F4E' }, input: { flex: 1, color: '#252720', fontSize: 15, marginLeft: 10, outlineStyle: 'none' }, filterLabel: { color: '#74766F', fontSize: 10, fontWeight: '800', letterSpacing: 1.3, marginTop: 26, marginBottom: 4 }, resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26 }, resultsTitle: { color: '#252720', fontSize: 19, fontWeight: '800' }, clear: { color: '#C76F4E', fontSize: 13, fontWeight: '700' }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16, marginTop: 14 } });
