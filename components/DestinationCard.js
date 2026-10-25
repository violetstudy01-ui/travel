import { Heart } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function DestinationCard({ destination, saved, onPress, onToggleSaved, compact = false, width }) {
  const [imageFailed, setImageFailed] = useState(false);
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.card, compact && styles.compactCard, width && { width }, pressed && styles.pressed]}>
    <View style={[styles.imageFrame, compact && styles.compactImage]}>{!imageFailed && <Image source={{ uri: destination.image }} onError={() => setImageFailed(true)} style={styles.image} accessibilityLabel={`${destination.name} destination`} />}{imageFailed && <Text style={styles.imageFallback}>Travel Explorer</Text>}</View>
    <Pressable onPress={(event) => { event.stopPropagation(); onToggleSaved(); }} accessibilityRole="button" accessibilityLabel={saved ? `Remove ${destination.name} from wishlist` : `Save ${destination.name} to wishlist`} style={styles.heart}><Heart size={17} color={saved ? '#C76F4E' : '#252720'} fill={saved ? '#C76F4E' : 'transparent'} strokeWidth={2.2} /></Pressable>
    <View style={styles.details}><Text style={styles.name} numberOfLines={2}>{destination.name}</Text><Text style={styles.location} numberOfLines={1}>{destination.location}</Text>{!compact && <Text style={styles.category} numberOfLines={1}>{destination.category}</Text>}</View>
  </Pressable>;
}
const styles = StyleSheet.create({ card: { backgroundColor: '#FFFFFF', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#E7E4DC', shadowColor: '#252720', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 }, compactCard: { width: 154 }, pressed: { opacity: 0.86, transform: [{ scale: 0.985 }] }, imageFrame: { width: '100%', aspectRatio: 1.22, backgroundColor: '#E9DDC9', alignItems: 'center', justifyContent: 'center' }, compactImage: { aspectRatio: 1.16 }, image: { width: '100%', height: '100%' }, imageFallback: { color: '#9C765E', fontSize: 11, fontWeight: '700' }, heart: { position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.96)', alignItems: 'center', justifyContent: 'center' }, details: { padding: 12, minHeight: 86 }, name: { color: '#252720', fontSize: 16, lineHeight: 20, fontWeight: '700' }, location: { color: '#74766F', fontSize: 12, marginTop: 5 }, category: { color: '#C76F4E', fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginTop: 9, textTransform: 'uppercase' } });
