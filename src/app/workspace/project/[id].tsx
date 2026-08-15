import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { FolderKanban } from 'lucide-react-native';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const { projects } = useWorkspaceStore();
  const project = projects.find(p => p.id === id);

  if (!project) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Detail Project" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconBox}>
          <FolderKanban size={40} color={COLORS.primary} />
        </View>
        <Typography variant="h2" weight="bold" style={{ marginBottom: SPACING.sm }}>{project.title}</Typography>
        <Typography variant="body" color={COLORS.textSecondary} style={{ marginBottom: SPACING.xl }}>{project.desc}</Typography>
        
        <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
             <Typography variant="body" weight="bold">Progress</Typography>
             <Typography variant="body" weight="bold" color={COLORS.primary}>{project.progress}%</Typography>
           </View>
           <ProgressBar progress={project.progress} />
           <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: SPACING.md }}>{project.tasksCount} Tugas tersisa</Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg },
  iconBox: { width: 64, height: 64, borderRadius: 16, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  card: { padding: SPACING.lg, borderRadius: 16, borderWidth: 1 }
});
