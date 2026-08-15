import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Skeleton } from '@/components/ui/Skeleton';
import { SPACING, COLORS } from '@/constants/theme';
import { Sparkles } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export const AIInsight = ({ isLoading = false }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const router = useRouter();
  const tasks = useWorkspaceStore(state => state.tasks);
  
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const insightText = pendingTasks.length > 0
    ? `Berdasarkan aktivitasmu, sebaiknya segera selesaikan "${pendingTasks[0].title}" agar kamu punya waktu luang lebih nanti.`
    : `Semua tugasmu sudah selesai! Bagus sekali, kamu bisa memanfaatkan waktu luang ini untuk membaca jurnal riset atau mempelajari hal baru.`;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/ai')}
        style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.primaryLight + '15', borderColor: COLORS.primaryLight + '30' }]}
      >
        <View style={styles.header}>
          <Sparkles size={20} color={COLORS.primary} />
          <Typography variant="body" weight="bold" color={COLORS.primary} style={{ marginLeft: SPACING.sm }}>✨ Insight AI</Typography>
        </View>
        {isLoading ? (
          <View style={{ marginTop: SPACING.md }}>
            <Skeleton width="100%" height={14} style={{ marginBottom: 6 }} />
            <Skeleton width="90%" height={14} style={{ marginBottom: 6 }} />
            <Skeleton width="60%" height={14} />
          </View>
        ) : (
          <Typography variant="body" style={{ marginTop: SPACING.sm, lineHeight: 22 }}>
            {insightText}
          </Typography>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  card: { padding: SPACING.lg, borderRadius: 16, borderWidth: 1 },
  header: { flexDirection: 'row', alignItems: 'center' }
});
