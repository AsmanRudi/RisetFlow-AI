import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Skeleton } from '@/components/ui/Skeleton';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { AISuggestedPrompts } from './AISuggestedPrompts';

interface Props {
  activeMode: 'belajar' | 'riset' | 'kerja';
  setActiveMode: (m: 'belajar' | 'riset' | 'kerja') => void;
  onSendPrompt: (prompt: string) => void;
}

export const AIWelcomeState: React.FC<Props> = ({ activeMode, setActiveMode, onSendPrompt }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoadingHistory(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Typography style={{ fontSize: 40, marginBottom: SPACING.sm }}>✨</Typography>
        <Typography variant="h1" weight="bold" style={{ marginBottom: SPACING.xs }}>Bagaimana saya bisa membantumu?</Typography>
        <Typography variant="body" color={COLORS.textSecondary}>Saya bisa membantu kamu belajar, meneliti, memahami dokumen, dan menyelesaikan pekerjaan.</Typography>
      </View>

      <View style={styles.modeSelector}>
        {(['belajar', 'riset', 'kerja'] as const).map(m => (
          <TouchableOpacity 
            key={m} 
            style={[
              styles.modePill, 
              { backgroundColor: activeMode === m ? COLORS.primary : (isDark ? COLORS.darkSurface : COLORS.surface) }
            ]}
            onPress={() => setActiveMode(m)}
          >
            <Typography variant="caption" weight="600" color={activeMode === m ? '#FFF' : COLORS.text}>
              {m === 'belajar' ? '📚 Belajar' : m === 'riset' ? '🔬 Riset' : '💼 Kerja'}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      <AISuggestedPrompts activeMode={activeMode} onSelectPrompt={onSendPrompt} />

      <View style={styles.historySection}>
        <Typography variant="body" weight="bold" style={{ marginBottom: SPACING.md }}>Percakapan Terbaru</Typography>
        {loadingHistory ? (
           [1, 2].map(i => <Skeleton key={i} width="100%" height={40} style={{ marginBottom: SPACING.sm }} />)
        ) : (
          <>
            <TouchableOpacity style={styles.historyItem}>
              <Typography variant="body">🔬 Analisis paper AI Pendidikan</Typography>
            </TouchableOpacity>
            <TouchableOpacity style={styles.historyItem}>
              <Typography variant="body">💼 Ringkasan Meeting Client</Typography>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { padding: SPACING.xl, alignItems: 'center' },
  modeSelector: { flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xl, paddingHorizontal: SPACING.lg },
  modePill: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20, marginHorizontal: SPACING.xs, elevation: 1 },
  historySection: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },
  historyItem: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border }
});
