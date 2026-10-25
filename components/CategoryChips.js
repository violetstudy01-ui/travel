import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { categories } from '@/data/destinations';

export default function CategoryChips({ selected, onSelect }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>{categories.map((category) => { const active = selected === category; return <Pressable key={category} onPress={() => onSelect(category)} style={[styles.chip, active && styles.activeChip]}><Text style={[styles.label, active && styles.activeLabel]}>{category}</Text></Pressable>; })}</ScrollView>;
}
const styles = StyleSheet.create({ content: { gap: 8, paddingVertical: 4, paddingRight: 20 }, chip: { borderWidth: 1, borderColor: '#E7E4DC', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF' }, activeChip: { backgroundColor: '#252720', borderColor: '#252720' }, label: { color: '#55574F', fontSize: 13, fontWeight: '600' }, activeLabel: { color: '#FFFFFF' } });
