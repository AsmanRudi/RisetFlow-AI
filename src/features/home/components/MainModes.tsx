import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export const MainModes = () => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const router = useRouter();

  const modes = [
    { title: 'Belajar', emoji: '📚', desc: 'AI Tutor, Quiz, Flashcard', color: COLORS.success, route: '/study' },
    { title: 'Riset', emoji: '🔬', desc: 'Paper, Lit Review, Citation', color: COLORS.primary, route: '/research' },
    { title: 'Kerja', emoji: '💼', desc: 'Task, Meeting, Document', color: COLORS.warning, route: '/work' },
  ];

  return (
    <View style={styles.container}>
      <Typography variant="h3" weight="bold" style={styles.title}>Mode Utama</Typography>
      {modes.map((m, idx) => (
        <TouchableOpacity 
          key={idx} 
          style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]} 
          activeOpacity={0.8}
          onPress={() => router.push(m.route as any)}
        >
          <View style={[styles.iconBox, { backgroundColor: m.color + '20' }]}>
            <Typography style={{ fontSize: 24 }}>{m.emoji}</Typography>
          </View>
          <View style={styles.content}>
            <Typography variant="body" weight="bold">{m.title}</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>{m.desc}</Typography>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  title: { marginBottom: SPACING.sm },
  card: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.sm, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  content: { marginLeft: SPACING.md, flex: 1 }
});
