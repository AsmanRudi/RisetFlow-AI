import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { ListItem } from '@/components/ui/ListItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { FolderKanban, CheckSquare, Edit3, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function WorkspaceTab() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const { tasks, notes, projects, fetchData } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState<'Semua' | 'Project' | 'Tugas' | 'Catatan'>('Semua');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs = ['Semua', 'Project', 'Tugas', 'Catatan'] as const;

  const renderContent = () => {
    let items: React.ReactNode[] = [];

    if (activeTab === 'Semua' || activeTab === 'Project') {
      items.push(...projects.map(p => (
        <ListItem 
          key={`p-${p.id}`}
          icon={FolderKanban}
          title={p.title}
          subtitle={`${p.progress}% Selesai • ${p.tasksCount} Tugas`}
          onPress={() => router.push(`/workspace/project/${p.id}` as any)}
        />
      )));
    }

    if (activeTab === 'Semua' || activeTab === 'Tugas') {
      items.push(...tasks.map(t => (
        <View key={`t-${t.id}`} style={styles.taskWrapper}>
          <ListItem 
            icon={CheckSquare}
            title={t.title}
            subtitle={t.desc}
            onPress={() => router.push(`/workspace/task/${t.id}` as any)}
            style={{ marginBottom: 4 }}
          />
          <View style={styles.badgeRow}>
            <Badge label={t.priority} variant={t.priority === 'High' ? 'danger' : 'warning'} style={{ marginRight: 8 }} />
            <Badge label={t.status} variant={t.status === 'Completed' ? 'success' : 'default'} />
          </View>
        </View>
      )));
    }

    if (activeTab === 'Semua' || activeTab === 'Catatan') {
      items.push(...notes.map(n => (
        <ListItem 
          key={`n-${n.id}`}
          icon={Edit3}
          title={n.title}
          subtitle={n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
          onPress={() => router.push(`/workspace/note/${n.id}` as any)}
        />
      )));
    }

    if (items.length === 0) {
      const getCreateRoute = () => {
        if (activeTab === 'Project') return '/workspace/project/create';
        if (activeTab === 'Tugas') return '/workspace/task/create';
        if (activeTab === 'Catatan') return '/workspace/note/create';
        return '/workspace/task/create';
      };

      return (
        <EmptyState 
          icon={FolderKanban}
          title={`Belum ada ${activeTab.toLowerCase()}`}
          description="Mulai kelola tugas dan proyek Anda di Ruang Kerja."
          actionLabel="Buat Baru"
          onAction={() => router.push(getCreateRoute() as any)}
        />
      );
    }

    return items;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={{ marginRight: SPACING.md }}>
          <ArrowLeft size={24} color={isDark ? COLORS.darkText : COLORS.text} />
        </TouchableOpacity>
        <Typography variant="h2" weight="bold">Ruang Kerja</Typography>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab ? styles.tabActive : { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}
              onPress={() => setActiveTab(tab)}
            >
              <Typography variant="caption" weight="600" color={activeTab === tab ? '#FFF' : (isDark ? COLORS.darkTextSecondary : COLORS.textSecondary)}>{tab}</Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { padding: SPACING.lg, paddingBottom: SPACING.sm, flexDirection: 'row', alignItems: 'center' },
  tabsContainer: { marginBottom: SPACING.md },
  tabsScroll: { paddingHorizontal: SPACING.lg },
  tab: { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: 20, marginRight: SPACING.sm, borderWidth: 1, borderColor: 'transparent' },
  tabActive: { backgroundColor: COLORS.primary },
  listContainer: { paddingHorizontal: SPACING.lg, paddingBottom: 100 },
  taskWrapper: { marginBottom: SPACING.md },
  badgeRow: { flexDirection: 'row', marginLeft: 56, marginTop: -4 }
});
