import { destinations } from '@/data/destinations';

export const matcherQuestions = [
  {
    id: 'escapeType',
    title: 'What kind of escape sounds best?',
    subtitle: 'Pick the mood that feels closest to what you need right now.',
    type: 'single',
    options: [
      { id: 'Beaches', label: 'Beaches', emoji: '🏖️' },
      { id: 'Mountains', label: 'Mountains', emoji: '🏔️' },
      { id: 'Rivers', label: 'Rivers & waterfalls', emoji: '🌊' },
      { id: 'Pilgrimage', label: 'Pilgrimage & spirituality', emoji: '🛕' },
      { id: 'Heritage', label: 'Heritage & culture', emoji: '🏛️' },
      { id: 'Scenic Rides', label: 'Scenic bike rides', emoji: '🏍️' },
      { id: 'surprise', label: 'Surprise me', emoji: '✨' },
    ],
  },
  {
    id: 'vibe',
    title: "What's your ideal vibe?",
    subtitle: 'Choose up to two that fit your mood.',
    type: 'multi',
    max: 2,
    options: [
      { id: 'peaceful', label: 'Peaceful', emoji: '🌿' },
      { id: 'adventurous', label: 'Adventurous', emoji: '🪂' },
      { id: 'spiritual', label: 'Spiritual', emoji: '🕉️' },
      { id: 'fun', label: 'Fun and lively', emoji: '🎉' },
      { id: 'romantic', label: 'Romantic', emoji: '💛' },
      { id: 'history', label: 'History & culture', emoji: '📜' },
    ],
  },
  {
    id: 'duration',
    title: 'How much time do you have?',
    subtitle: 'Be honest. We will plan around it.',
    type: 'single',
    options: [
      { id: 'one-day', label: 'One day' },
      { id: 'weekend', label: 'Weekend' },
      { id: '3-5', label: '3–5 days' },
      { id: 'week-plus', label: 'A week or more' },
    ],
  },
  {
    id: 'budget',
    title: "What's your approximate budget per person?",
    subtitle: 'A rough preference — not a verified quote. We use it only to narrow suggestions.',
    type: 'single',
    options: [
      { id: 'under-3000', label: 'Under ₹3,000' },
      { id: '3000-7000', label: '₹3,000–₹7,000' },
      { id: '7000-15000', label: '₹7,000–₹15,000' },
      { id: '15000-plus', label: '₹15,000+' },
      { id: 'unsure', label: 'Not sure' },
    ],
  },
  {
    id: 'companions',
    title: 'Who are you travelling with?',
    subtitle: 'It helps us think about pace and activities.',
    type: 'single',
    options: [
      { id: 'solo', label: 'Solo', emoji: '🚶' },
      { id: 'friends', label: 'Friends', emoji: '👥' },
      { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
      { id: 'partner', label: 'Partner', emoji: '💞' },
    ],
  },
  {
    id: 'activities',
    title: 'What do you enjoy most?',
    subtitle: 'Pick up to three things you love doing on a trip.',
    type: 'multi',
    max: 3,
    options: [
      { id: 'trekking', label: 'Trekking & outdoor adventure', emoji: '🥾' },
      { id: 'photography', label: 'Photography & sightseeing', emoji: '📸' },
      { id: 'food', label: 'Local food', emoji: '🍽️' },
      { id: 'temples', label: 'Temples & spiritual experiences', emoji: '🛕' },
      { id: 'rides', label: 'Scenic drives & bike rides', emoji: '🏍️' },
      { id: 'relaxing', label: 'Relaxing in nature', emoji: '🌿' },
      { id: 'history', label: 'History & architecture', emoji: '🏛️' },
      { id: 'water-activities', label: 'Water activities', emoji: '🏄' },
    ],
  },
  {
    id: 'travelMode',
    title: 'How would you prefer to travel?',
    subtitle: 'Tell us how you like to get around.',
    type: 'single',
    options: [
      { id: 'public', label: 'Public transport', emoji: '🚌' },
      { id: 'own-vehicle', label: 'My own vehicle', emoji: '🚗' },
      { id: 'flexible', label: 'Flexible', emoji: '🧭' },
    ],
  },
  {
    id: 'popularity',
    title: 'What kind of destination would you prefer?',
    subtitle: 'Some places are iconic. Some let you disappear.',
    type: 'single',
    options: [
      { id: 'popular', label: 'Popular and iconic', emoji: '🌟' },
      { id: 'quiet', label: 'Quiet and less crowded', emoji: '🍃' },
      { id: 'mixed', label: 'A mix of both', emoji: '⚖️' },
    ],
  },
];

const activityIdMap = {
  trekking: 'trekking',
  photography: 'photography',
  food: 'food',
  temples: 'temples',
  rides: 'adventure',
  relaxing: 'relaxing',
  history: 'history',
  'water-activities': 'water-activities',
};

export function scoreDestinations(answers) {
  const isSurprise = answers.escapeType === 'surprise';
  const scored = destinations.map((destination) => {
    let score = 0;
    const reasons = [];

    if (!isSurprise && answers.escapeType && destination.categories.includes(answers.escapeType)) {
      score += 5;
      reasons.push(`matches your ${answers.escapeType.toLowerCase()} preference`);
    } else if (isSurprise && answers.vibe && destination.vibes?.some((v) => answers.vibe.includes(v))) {
      score += 3;
    }

    if (answers.vibe && answers.vibe.length > 0) {
      const matchedVibes = destination.vibes?.filter((v) => answers.vibe.includes(v)) || [];
      if (matchedVibes.length > 0) {
        score += Math.round((3 / answers.vibe.length) * matchedVibes.length);
        reasons.push(`${matchedVibes.length === 1 ? 'matches' : 'matches'} your vibe`);
      }
    }

    if (answers.duration && destination.duration?.includes(answers.duration)) {
      score += 3;
      reasons.push('fits your available time');
    }

    if (answers.budget && answers.budget !== 'unsure' && destination.budget?.includes(answers.budget)) {
      score += 3;
      reasons.push('fits your budget preference');
    }

    if (answers.activities && answers.activities.length > 0) {
      const mapped = answers.activities.map((a) => activityIdMap[a]).filter(Boolean);
      const matched = destination.activities?.filter((a) => mapped.includes(a)) || [];
      if (matched.length > 0) {
        score += Math.round((2 / answers.activities.length) * matched.length);
        reasons.push('offers activities you enjoy');
      }
    }

    if (answers.travelMode && destination.travelMode?.includes(answers.travelMode)) {
      score += 1;
      reasons.push('works with your travel mode');
    }

    if (answers.popularity && destination.popularity === answers.popularity) {
      score += 1;
      reasons.push('matches your crowd preference');
    } else if (answers.popularity === 'mixed' && destination.popularity === 'mixed') {
      score += 1;
      reasons.push('balances popular and quiet');
    }

    return { destination, score, reasons: reasons.slice(0, 3), maxScore: 18 };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  return sorted.slice(0, 3).map((item) => ({
    ...item,
    matchPercent: item.score > 0 ? Math.round((item.score / item.maxScore) * 100) : 0,
  }));
}

export function formatProgress(current, total) {
  return `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
}
