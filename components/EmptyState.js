import { Compass, SearchX } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function EmptyState({ title, message, actionLabel, onAction, search = false }) {
  const Icon = search ? SearchX : Compass;
  return <View style={styles.wrap}><View style={styles.icon}><Icon size={26} color="#C76F4E" /></View><Text style={styles.title}>{title}</Text><Text style={styles.message}>{message}</Text>{actionLabel && <Pressable onPress={onAction} style={styles.button}><Text style={styles.buttonLabel}>{actionLabel}</Text></Pressable>}</View>;
}
const styles = StyleSheet.create({ wrap: { alignItems: 'center', justifyContent: 'center', padding: 36, marginTop: 30 }, icon: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#E9DDC9', alignItems: 'center', justifyContent: 'center' }, title: { color: '#252720', fontSize: 20, fontWeight: '700', marginTop: 18 }, message: { color: '#74766F', fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 8, maxWidth: 260 }, button: { marginTop: 22, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, backgroundColor: '#252720' }, buttonLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' } });
