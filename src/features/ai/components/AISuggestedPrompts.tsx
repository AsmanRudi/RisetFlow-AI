import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface Props {
  activeMode: 'belajar' | 'riset' | 'kerja';
  onSelectPrompt: (prompt: string) => void;
}

export const AISuggestedPrompts: React.FC<Props> = ({ activeMode, onSelectPrompt }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const prompts = {
    belajar: ['📚 Jelaskan materi ini', '🧠 Buat quiz', '📝 Buat flashcard', '📅 Buat study plan'],
    riset: ['🔬 Ringkas paper ini', '⚖️ Bandingkan penelitian', '📊 Buat research matrix', '🎯 Temukan research gap'],
    kerja: ['💼 Ringkas meeting', '✅ Buat action items', '📋 Pecah project jadi task', '📄 Ringkas dokumen']
  };

  return (
    <View style={styles.container}>
      <Typography variant="caption" weight="600" color={COLORS.textSecondary} style={{ marginBottom: SPACING.sm, paddingHorizontal: SPACING.lg }}>Mulai dari sini</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {prompts[activeMode].map((prompt, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}
            onPress={() => onSelectPrompt(prompt.split(' ').slice(1).join(' '))}
          >
            <Typography variant="caption" weight="600">{prompt}</Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  scroll: { paddingHorizontal: SPACING.lg },
  card: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20, borderWidth: 1, marginRight: SPACING.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }
});
