import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Skeleton } from '@/components/ui/Skeleton';
import { SPACING, COLORS } from '@/constants/theme';
import { FileText, MoreVertical } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';

interface ActivityProps {
  isLoading: boolean;
  activities: { id: string; title: string; subtitle: string; time: string }[];
}

export const RecentActivities: React.FC<ActivityProps> = ({ isLoading, activities }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Typography variant="h3" weight="bold" style={styles.title}>Aktivitas Terbaru</Typography>
      <View style={[styles.listContainer, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
        {isLoading ? (
          [1, 2, 3].map(i => (
            <View key={i} style={styles.item}>
              <Skeleton width={40} height={40} borderRadius={8} />
              <View style={styles.itemContent}>
                <Skeleton width="80%" height={16} style={{ marginBottom: 4 }} />
                <Skeleton width="40%" height={12} />
              </View>
            </View>
          ))
        ) : (
          activities.map((act, idx) => (
            <TouchableOpacity 
              key={act.id} 
              style={[styles.item, idx !== activities.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}
              onPress={() => router.push(`/workspace/note/${act.id}` as any)}
            >
              <View style={styles.iconBox}><FileText size={20} color={COLORS.primary} /></View>
              <View style={styles.itemContent}>
                <Typography variant="body" weight="600">{act.title}</Typography>
                <Typography variant="caption" color={COLORS.textSecondary}>{act.subtitle} • {act.time}</Typography>
              </View>
              <TouchableOpacity style={{ padding: SPACING.xs }} onPress={() => alert('Opsi aktivitas akan segera tersedia')}>
                <MoreVertical size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg, paddingHorizontal: SPACING.lg },
  title: { marginBottom: SPACING.sm },
  listContainer: { borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  item: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md },
  iconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center' },
  itemContent: { flex: 1, marginLeft: SPACING.md }
});
