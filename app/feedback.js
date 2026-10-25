import { ArrowLeft, Check, MessageSquareWarning } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FEEDBACK_KEY = '@travel-explorer/feedback';

export default function FeedbackScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('destination');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'destination', label: 'Missing destination' },
    { id: 'content', label: 'Incorrect information' },
    { id: 'feature', label: 'Feature request' },
    { id: 'other', label: 'Other' },
  ];

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please write a short note before submitting.');
      return;
    }
    setError(null);
    try {
      const existing = await AsyncStorage.getItem(FEEDBACK_KEY);
      const list = existing ? JSON.parse(existing) : [];
      list.push({ category, message: message.trim(), date: new Date().toISOString() });
      await AsyncStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
      setSubmitted(true);
    } catch {
      setError('Could not save your feedback right now. Please try again.');
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centerWrap}>
          <View style={styles.successIcon}><Check size={30} color="#5A8A6A" /></View>
          <Text style={styles.successTitle}>Thank you for telling us.</Text>
          <Text style={styles.successMsg}>Your note has been saved on this device. We read every piece of feedback to improve the app.</Text>
          <Text style={styles.successNote}>Note: feedback is stored locally on your device. There is no server to send it to right now, so it will not reach a team member automatically.</Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
            <Text style={styles.primaryBtnText}>Back to exploring</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#252720" />
          </Pressable>
          <View style={styles.headerIcon}><MessageSquareWarning size={22} color="#C76F4E" /></View>
          <Text style={styles.eyebrow}>TELL US</Text>
          <Text style={styles.title}>Something missing?</Text>
          <Text style={styles.subtitle}>Stay with us. We'll do better. Let us know what is off or what you wish existed.</Text>
        </View>

        <Text style={styles.label}>What is it about?</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <Pressable key={cat.id} style={[styles.catChip, category === cat.id && styles.catSelected]} onPress={() => setCategory(cat.id)}>
              <Text style={[styles.catChipText, category === cat.id && styles.catTextSelected]}>{cat.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Your note</Text>
        <TextInput
          style={styles.textArea}
          value={message}
          onChangeText={setMessage}
          placeholder="Tell us what is missing, incorrect, or could be better..."
          placeholderTextColor="#9A9F98"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Save feedback</Text>
        </Pressable>

        <Text style={styles.privacyNote}>Your feedback is stored only on this device. It is not sent to any server.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { paddingHorizontal: 20, paddingBottom: 60 },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E7E4DC' },
  header: { paddingTop: 8 },
  headerIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FBEDE6', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  eyebrow: { color: '#C76F4E', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 16 },
  title: { color: '#252720', fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 8 },
  subtitle: { color: '#74766F', fontSize: 14, lineHeight: 21, marginTop: 10 },
  label: { color: '#252720', fontSize: 15, fontWeight: '700', marginTop: 28 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  catChip: { borderWidth: 1.5, borderColor: '#E7E4DC', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  catSelected: { borderColor: '#C76F4E', backgroundColor: '#C76F4E' },
  catChipText: { color: '#252720', fontSize: 13, fontWeight: '600' },
  catTextSelected: { color: '#FFFFFF' },
  textArea: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E7E4DC', borderRadius: 16, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, fontSize: 15, color: '#252720', minHeight: 140, marginTop: 14, outlineStyle: 'none' },
  error: { color: '#9B554C', fontSize: 13, marginTop: 12 },
  submitBtn: { backgroundColor: '#252720', borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  privacyNote: { color: '#74766F', fontSize: 12, lineHeight: 18, marginTop: 18, textAlign: 'center' },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  successIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E9F0EB', alignItems: 'center', justifyContent: 'center' },
  successTitle: { color: '#252720', fontSize: 22, fontWeight: '800', marginTop: 20 },
  successMsg: { color: '#74766F', fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 10 },
  successNote: { color: '#9A9F98', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 16 },
  primaryBtn: { backgroundColor: '#252720', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 32, marginTop: 28 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
