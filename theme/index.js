export const colors = {
  ivory: '#F8F7F2',
  white: '#FFFFFF',
  charcoal: '#252720',
  secondary: '#74766F',
  body: '#62645E',
  border: '#E7E4DC',
  accent: '#C76F4E',
  sand: '#E9DDC9',
  sandDeep: '#9C765E',
  error: '#9B554C',
  accentSoft: '#F5D8C8',
  accentTint: '#FBEDE6',
  success: '#5A8A6A',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 28,
  pill: 999,
};

export const typography = {
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, color: colors.accent },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -1, color: colors.charcoal },
  sectionTitle: { fontSize: 21, fontWeight: '800', letterSpacing: -0.3, color: colors.charcoal },
  body: { fontSize: 15, lineHeight: 24, color: colors.body },
  caption: { fontSize: 13, color: colors.secondary },
};

export const shadow = {
  card: { shadowColor: colors.charcoal, shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  soft: { shadowColor: colors.charcoal, shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
};
