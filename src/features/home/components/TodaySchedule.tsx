import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Skeleton } from '@/components/ui/Skeleton';

export const TodaySchedule = ({ isLoading = false }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const router = useRouter();
  const tasks = useWorkspaceStore(state => state.tasks);

  const schedule = tasks
    .filter(t => t.status !== 'Completed')
    .slice(0, 3)
    .map(t => ({
      time: t.deadline ? new Date(t.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Hari ini',
      title: t.title,
      active: true
    }));

  return (
    <View style={styles.container}>
      <Typography variant="h3" weight="bold" style={styles.title}>Jadwal Hari Ini</Typography>
      <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
        {isLoading ? (
          <View style={{ padding: SPACING.md }}>
            <Skeleton width="60%" height={16} style={{ marginBottom: SPACING.md }} />
            <Skeleton width="70%" height={16} />
          </View>
        ) : schedule.length > 0 ? (
          schedule.map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.row}
              onPress={() => router.push('/(tabs)/workspace')}
              activeOpacity={0.7}
            >
              <View style={styles.timeCol}>
                <Typography variant="caption" weight="600" color={item.active ? COLORS.primary : COLORS.textSecondary}>{item.time}</Typography>
              </View>
              <View style={styles.timeline}>
                <View style={[styles.dot, { backgroundColor: item.active ? COLORS.primary : COLORS.border }]} />
                {idx !== schedule.length - 1 && <View style={[styles.line, { backgroundColor: isDark ? COLORS.darkBorder : COLORS.border }]} />}
              </View>
              <View style={styles.contentCol}>
                <Typography variant="body" weight={item.active ? 'bold' : 'normal'} color={item.active ? undefined : COLORS.textSecondary}>{item.title}</Typography>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Typography variant="body" color={COLORS.textSecondary} style={{ textAlign: 'center', padding: SPACING.md }}>
            Belum ada jadwal/tugas hari ini. Waktunya bersantai!
          </Typography>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  title: { marginBottom: SPACING.sm },
  card: { padding: SPACING.md, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  row: { flexDirection: 'row' },
  timeCol: { width: 50, alignItems: 'flex-end', paddingTop: 2 },
  timeline: { width: 30, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6, zIndex: 2 },
  line: { width: 2, flex: 1, marginVertical: -4, zIndex: 1 },
  contentCol: { flex: 1, paddingBottom: SPACING.lg }
});
