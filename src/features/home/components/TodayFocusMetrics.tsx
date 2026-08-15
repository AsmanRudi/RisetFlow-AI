import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Skeleton } from '@/components/ui/Skeleton';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface MetricProps {
  isLoading: boolean;
  metrics: { title: string; count: string; subtitle: string; progress?: string }[];
}

export const TodayFocusMetrics: React.FC<MetricProps> = ({ isLoading, metrics }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Typography variant="h3" weight="bold" style={styles.title}>Fokus Hari Ini</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {isLoading ? (
          [1, 2, 3].map(i => (
            <View key={i} style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
              <Skeleton width={30} height={24} style={{ marginBottom: SPACING.xs }} />
              <Skeleton width={80} height={16} style={{ marginBottom: SPACING.sm }} />
              <Skeleton width={100} height={12} />
            </View>
          ))
        ) : (
          metrics.map((m, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}
              onPress={() => router.push('/(tabs)/workspace')}
            >
              <Typography variant="h1" color={COLORS.primary} weight="bold">{m.count}</Typography>
              <Typography variant="body" weight="600">{m.title}</Typography>
              <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: SPACING.xs }}>
                {m.subtitle} {m.progress && `• ${m.progress}`}
              </Typography>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  title: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.sm },
  card: { width: 140, padding: SPACING.md, borderRadius: 12, marginRight: SPACING.md, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }
});
