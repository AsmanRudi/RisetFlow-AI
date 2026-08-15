import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Skeleton } from '@/components/ui/Skeleton';

export const WeeklyProgress = ({ isLoading = false }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const tasks = useWorkspaceStore(state => state.tasks);
  const notes = useWorkspaceStore(state => state.notes);
  const projects = useWorkspaceStore(state => state.projects);

  const progressData = React.useMemo(() => {
    const belajarProgress = Math.min(Math.round((notes.length / 5) * 100), 100);
    const totalProjectProgress = projects.reduce((acc, p) => acc + (p.progress || 0), 0);
    const risetProgress = projects.length > 0 ? Math.round(totalProjectProgress / projects.length) : 0;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const kerjaProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    return [
      { label: 'Belajar', percent: belajarProgress, color: COLORS.success },
      { label: 'Riset', percent: risetProgress, color: COLORS.primary },
      { label: 'Kerja', percent: kerjaProgress, color: COLORS.warning },
    ];
  }, [tasks, notes, projects]);

  return (
    <View style={styles.container}>
      <Typography variant="h3" weight="bold" style={styles.title}>Progress Mingguan</Typography>
      <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
        {isLoading ? (
          <View style={{ padding: SPACING.md }}>
             <Skeleton width="100%" height={24} style={{ marginBottom: SPACING.md }} />
             <Skeleton width="100%" height={24} />
          </View>
        ) : (
          progressData.map((p, idx) => (
            <View key={idx} style={styles.row}>
              <View style={styles.labelRow}>
                <Typography variant="body" weight="600">{p.label}</Typography>
                <Typography variant="caption" weight="bold" color={p.color}>{p.percent}%</Typography>
              </View>
              <ProgressBar progress={p.percent} color={p.color} />
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.xxl },
  title: { marginBottom: SPACING.sm },
  card: { padding: SPACING.lg, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  row: { marginBottom: SPACING.md },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs }
});
