import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles, FileText, Edit3, CheckSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

const actions = [
  { id: '1', title: 'Tanya AI', icon: Sparkles, color: COLORS.primary, route: '/(tabs)/ai' },
  { id: '2', title: 'Analisis PDF', icon: FileText, color: COLORS.warning, route: '/(tabs)/library' },
  { id: '3', title: 'Buat Catatan', icon: Edit3, color: COLORS.success, route: '/workspace/note/create' },
  { id: '4', title: 'Buat Tugas', icon: CheckSquare, color: COLORS.danger, route: '/workspace/task/create' },
];

export const QuickActions = () => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const router = useRouter();

  return (
    <View style={styles.container}>
      {actions.map((act) => (
        <TouchableOpacity 
          key={act.id} 
          style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]} 
          activeOpacity={0.7}
          onPress={() => router.push(act.route as any)}
        >
          <View style={[styles.iconBox, { backgroundColor: act.color + '20' }]}>
            <act.icon size={24} color={act.color} />
          </View>
          <Typography variant="caption" weight="600" align="center" style={{ marginTop: SPACING.sm }}>{act.title}</Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, justifyContent: 'space-between', marginBottom: SPACING.lg },
  card: { width: '48%', alignItems: 'center', padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.sm, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }
});
