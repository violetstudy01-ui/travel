import { ExternalLink } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Platform, Linking } from 'react-native';

export default function AttractionCard({ attraction, location }) {
  const [imageFailed, setImageFailed] = useState(false);

  const openMap = () => {
    if (!attraction.mapQuery) return;
    const query = location ? `${attraction.mapQuery} ${location}` : attraction.mapQuery;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    Linking.openURL(url);
  };

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={openMap} accessibilityRole="button" accessibilityLabel={`Open ${attraction.name} in Maps`}>
      <View style={styles.imageFrame}>
        {!imageFailed && <Image source={{ uri: attraction.image }} onError={() => setImageFailed(true)} style={styles.image} />}
        {imageFailed && <Text style={styles.fallback}>Travel Explorer</Text>}
        <View style={styles.linkBadge}>
          <ExternalLink size={12} color="#FFFFFF" />
          <Text style={styles.linkBadgeText}>Maps</Text>
        </View>
      </View>
      <View style={styles.copy}>
        <Text style={styles.name}>{attraction.name}</Text>
        <Text style={styles.description} numberOfLines={3}>{attraction.description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 210, backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#E7E4DC', overflow: 'hidden' },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  imageFrame: { width: '100%', height: 126, backgroundColor: '#E9DDC9', alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' },
  fallback: { color: '#9C765E', fontSize: 11, fontWeight: '700' },
  linkBadge: { position: 'absolute', bottom: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(37,39,32,0.78)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  linkBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  copy: { padding: 12 },
  name: { color: '#252720', fontSize: 14, fontWeight: '700' },
  description: { color: '#74766F', fontSize: 12, lineHeight: 18, marginTop: 5 },
});
