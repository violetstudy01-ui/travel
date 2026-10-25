import { Heart, Sparkles, MessageSquareWarning, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { destinations } from '@/data/destinations';

export default function QuickActionsMenu({ visible, onClose }) {
  const router = useRouter();

  const surpriseMe = () => {
    onClose();
    const random = destinations[Math.floor(Math.random() * destinations.length)];
    router.push(`/destination/${random.id}`);
  };

  const openWishlist = () => {
    onClose();
    router.push('/(tabs)/wishlist');
  };

  const openFeedback = () => {
    onClose();
    router.push('/feedback');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Quick actions</Text>
          <Text style={styles.subtitle}>A few shortcuts to get you moving.</Text>

          <Pressable style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]} onPress={surpriseMe}>
            <View style={styles.actionIcon}><Sparkles size={20} color="#C76F4E" /></View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Surprise me!</Text>
              <Text style={styles.actionDesc}>Jump straight to a random destination.</Text>
            </View>
          </Pressable>

          <Pressable style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]} onPress={openWishlist}>
            <View style={styles.actionIcon}><Heart size={20} color="#C76F4E" /></View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>My saved escapes</Text>
              <Text style={styles.actionDesc}>See the places you have bookmarked.</Text>
            </View>
          </Pressable>

          <Pressable style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]} onPress={openFeedback}>
            <View style={styles.actionIcon}><MessageSquareWarning size={20} color="#C76F4E" /></View>
            <View style={styles.actionCopy}>
              <Text style={styles.actionTitle}>Something missing? Tell us!</Text>
              <Text style={styles.actionDesc}>Stay with us. We'll do better.</Text>
            </View>
          </Pressable>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(37,39,32,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 34 },
  handle: { width: 40, height: 4, backgroundColor: '#E7E4DC', borderRadius: 2, alignSelf: 'center' },
  title: { color: '#252720', fontSize: 22, fontWeight: '800', marginTop: 18 },
  subtitle: { color: '#74766F', fontSize: 14, marginTop: 4 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#F0EEE8', marginTop: 8 },
  pressed: { opacity: 0.85 },
  actionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FBEDE6', alignItems: 'center', justifyContent: 'center' },
  actionCopy: { flex: 1 },
  actionTitle: { color: '#252720', fontSize: 16, fontWeight: '700' },
  actionDesc: { color: '#74766F', fontSize: 13, marginTop: 3 },
  closeBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 8 },
  closeBtnText: { color: '#74766F', fontSize: 15, fontWeight: '600' },
});
