import { ArrowLeft, ArrowRight, Check } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { formatProgress, matcherQuestions, scoreDestinations } from '@/data/matcher';
import { destinations } from '@/data/destinations';

const introImages = [
  'https://images.pexels.com/photos/4428274/pexels-photo-4428274.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/29494184/pexels-photo-29494184.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
  'https://images.pexels.com/photos/5827456/pexels-photo-5827456.jpeg?auto=compress&cs=tinysrgb&h=400&w=400',
];

function triggerHaptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export default function MatcherScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});

  const total = matcherQuestions.length;
  const isIntro = step === -1;
  const isResults = step === total;

  const toggleSingle = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    triggerHaptic();
  };

  const toggleMulti = (questionId, optionId, max) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [questionId]: current.filter((id) => id !== optionId) };
      }
      if (current.length >= max) return prev;
      return { ...prev, [questionId]: [...current, optionId] };
    });
    triggerHaptic();
  };

  const canContinue = () => {
    if (isIntro) return true;
    const question = matcherQuestions[step];
    const answer = answers[question.id];
    if (question.id === 'escapeType' && answer === 'surprise') return true;
    return answer && (Array.isArray(answer) ? answer.length > 0 : true);
  };

  const handleContinue = () => {
    if (step < total) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > -1) {
      setStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleSkip = () => {
    setStep((prev) => prev + 1);
  };

  if (isResults) {
    const results = scoreDestinations(answers);
    const topMatch = results[0]?.destination;
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.resultsHeader}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <ArrowLeft size={20} color="#252720" />
            </Pressable>
            <Text style={styles.eyebrow}>YOUR MATCHES</Text>
            <Text style={styles.resultsTitle}>Here is where we would send you.</Text>
            <Text style={styles.subtitle}>Based on your answers, these destinations fit best. Tap any to explore further.</Text>
          </View>
          {results.map((result, index) => (
            <Pressable
              key={result.destination.id}
              style={({ pressed }) => [styles.resultCard, pressed && styles.pressed]}
              onPress={() => router.push(`/destination/${result.destination.id}`)}
            >
              <Image source={{ uri: result.destination.image }} style={styles.resultImage} />
              <View style={styles.resultShade} />
              <View style={styles.resultBadge}>
                <Text style={styles.resultBadgeText}>#{index + 1}</Text>
              </View>
              <View style={styles.resultCopy}>
                <Text style={styles.resultName}>{result.destination.name}</Text>
                <Text style={styles.resultLocation}>{result.destination.location}</Text>
                {result.matchPercent > 0 && (
                  <View style={styles.matchRow}>
                    <Text style={styles.matchScore}>{result.matchPercent}% preference match</Text>
                  </View>
                )}
                {result.reasons.length > 0 && (
                  <Text style={styles.resultReasons}>{result.reasons.join(' · ')}</Text>
                )}
                <View style={styles.resultActions}>
                  <Pressable
                    style={styles.exploreBtn}
                    onPress={(e) => { e.stopPropagation(); router.push(`/destination/${result.destination.id}`); }}
                  >
                    <Text style={styles.exploreBtnText}>Explore</Text>
                  </Pressable>
                  <Pressable
                    style={styles.planBtn}
                    onPress={(e) => { e.stopPropagation(); router.push(`/plan-trip/${result.destination.id}`); }}
                  >
                    <Text style={styles.planBtnText}>Plan Your Trip</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
          <View style={styles.resultsFooter}>
            <Pressable style={styles.retakeBtn} onPress={() => { setAnswers({}); setStep(-1); }}>
              <Text style={styles.retakeBtnText}>Start over</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isIntro) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.introWrap}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#252720" />
          </Pressable>
          <Text style={styles.eyebrow}>HELP ME CHOOSE</Text>
          <Text style={styles.introTitle}>No destination in mind?{"\n"}Excellent.{"\n"}That's literally our job.</Text>
          <Text style={styles.subtitle}>Answer eight quick questions and we will match you with three destinations that fit your mood, time, and travel style.</Text>
          <View style={styles.introImageRow}>
            {introImages.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.introImage} />
            ))}
          </View>
          <Text style={styles.introNote}>No sign-up. No AI magic show. Just a straightforward preference match from our curated list.</Text>
          <Pressable style={styles.startBtn} onPress={handleContinue}>
            <Text style={styles.startBtnText}>Let's go</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const question = matcherQuestions[step];
  const answer = answers[question.id];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.quizWrap}>
        <View style={styles.quizHeader}>
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft size={20} color="#252720" />
          </Pressable>
          <Text style={styles.progress}>{formatProgress(step, total)}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((step + 1) / total) * 100}%` }]} />
        </View>
        <ScrollView contentContainerStyle={styles.quizContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.quizTitle}>{question.title}</Text>
          <Text style={styles.quizSubtitle}>{question.subtitle}</Text>
          <View style={styles.optionsWrap}>
            {question.options.map((option) => {
              const selected = question.type === 'single'
                ? answer === option.id
                : Array.isArray(answer) && answer.includes(option.id);
              return (
                <Pressable
                  key={option.id}
                  style={[styles.optionCard, selected && styles.optionSelected]}
                  onPress={() => question.type === 'single'
                    ? toggleSingle(question.id, option.id)
                    : toggleMulti(question.id, option.id, question.max)}
                >
                  {option.emoji && <Text style={styles.optionEmoji}>{option.emoji}</Text>}
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{option.label}</Text>
                  {selected && <Check size={18} color="#C76F4E" />}
                </Pressable>
              );
            })}
          </View>
          {question.type === 'multi' && (
            <Text style={styles.multiHint}>Choose up to {question.max}</Text>
          )}
        </ScrollView>
        <View style={styles.quizFooter}>
          <Pressable onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Skip</Text>
          </Pressable>
          <Pressable
            style={[styles.continueBtn, !canContinue() && styles.continueDisabled]}
            onPress={handleContinue}
            disabled={!canContinue()}
          >
            <Text style={styles.continueBtnText}>{step === total - 1 ? 'See my matches' : 'Continue'}</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { paddingHorizontal: 20, paddingBottom: 60 },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E7E4DC' },
  eyebrow: { color: '#C76F4E', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 20 },
  introWrap: { flex: 1, paddingHorizontal: 24, paddingTop: 12 },
  introTitle: { color: '#252720', fontSize: 32, lineHeight: 40, fontWeight: '800', letterSpacing: -1, marginTop: 16 },
  subtitle: { color: '#74766F', fontSize: 15, lineHeight: 23, marginTop: 14 },
  introImageRow: { flexDirection: 'row', gap: 10, marginTop: 28 },
  introImage: { flex: 1, height: 110, borderRadius: 16 },
  introNote: { color: '#74766F', fontSize: 13, lineHeight: 20, marginTop: 28 },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#252720', borderRadius: 24, paddingVertical: 16, marginTop: 28, marginBottom: 20 },
  startBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  quizWrap: { flex: 1, paddingHorizontal: 24 },
  quizHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 },
  progress: { color: '#74766F', fontSize: 13, fontWeight: '700' },
  progressBar: { height: 4, backgroundColor: '#E7E4DC', borderRadius: 2, marginTop: 16 },
  progressFill: { height: 4, backgroundColor: '#C76F4E', borderRadius: 2 },
  quizContent: { paddingTop: 28, paddingBottom: 20 },
  quizTitle: { color: '#252720', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  quizSubtitle: { color: '#74766F', fontSize: 14, lineHeight: 21, marginTop: 10 },
  optionsWrap: { marginTop: 24, gap: 10 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1.5, borderColor: '#E7E4DC', paddingHorizontal: 16, paddingVertical: 16 },
  optionSelected: { borderColor: '#C76F4E', backgroundColor: '#FBEDE6' },
  optionEmoji: { fontSize: 22 },
  optionLabel: { flex: 1, color: '#252720', fontSize: 15, fontWeight: '600' },
  optionLabelSelected: { color: '#252720', fontWeight: '700' },
  multiHint: { color: '#74766F', fontSize: 12, marginTop: 14, textAlign: 'center' },
  quizFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingTop: 8 },
  skipBtn: { paddingVertical: 14, paddingHorizontal: 16 },
  skipBtnText: { color: '#74766F', fontSize: 14, fontWeight: '600' },
  continueBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#252720', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 24 },
  continueDisabled: { backgroundColor: '#B5B6AE' },
  continueBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  resultsHeader: { paddingTop: 8, paddingBottom: 24 },
  resultsTitle: { color: '#252720', fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 12 },
  resultCard: { height: 300, borderRadius: 24, overflow: 'hidden', backgroundColor: '#E9DDC9', marginBottom: 18 },
  resultImage: { width: '100%', height: '100%' },
  resultShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(37,39,32,0.38)' },
  resultBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  resultBadgeText: { color: '#252720', fontSize: 13, fontWeight: '800' },
  resultCopy: { position: 'absolute', left: 18, right: 18, bottom: 18 },
  resultName: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  resultLocation: { color: '#F0F5EE', fontSize: 13, marginTop: 4 },
  matchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  matchScore: { color: '#F5D8C8', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  resultReasons: { color: '#E9DDC9', fontSize: 12, lineHeight: 18, marginTop: 6 },
  resultActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  exploreBtn: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 18 },
  exploreBtnText: { color: '#252720', fontSize: 13, fontWeight: '700' },
  planBtn: { backgroundColor: '#C76F4E', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 18 },
  planBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  resultsFooter: { alignItems: 'center', paddingTop: 10, paddingBottom: 20 },
  retakeBtn: { borderWidth: 1.5, borderColor: '#252720', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 32 },
  retakeBtnText: { color: '#252720', fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
});
