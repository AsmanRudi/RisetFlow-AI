import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Dimensions } from 'react-native';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { AIHeroCard } from '@/features/home/components/AIHeroCard';
import { QuickActions } from '@/features/home/components/QuickActions';
import { TodayFocusMetrics } from '@/features/home/components/TodayFocusMetrics';
import { RecentActivities } from '@/features/home/components/RecentActivities';
import { MainModes } from '@/features/home/components/MainModes';
import { AIInsight } from '@/features/home/components/AIInsight';
import { TodaySchedule } from '@/features/home/components/TodaySchedule';
import { WeeklyProgress } from '@/features/home/components/WeeklyProgress';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export default function HomeTab() {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const notes = useWorkspaceStore(state => state.notes);
  const tasks = useWorkspaceStore(state => state.tasks);
  const isLoading = useWorkspaceStore(state => state.isLoading);
  const fetchData = useWorkspaceStore(state => state.fetchData);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const data = React.useMemo(() => {
    if (isLoading) return null;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const deadlines = tasks.filter(t => t.deadline).length;

    const metrics = [
      { title: 'Tugas', count: tasks.length.toString(), subtitle: `${completedTasks} selesai`, progress: `${tasks.length > 0 ? Math.round((completedTasks/tasks.length)*100) : 0}%` },
      { title: 'Deadline', count: deadlines.toString(), subtitle: 'Mendatang', progress: '' },
      { title: 'Catatan', count: notes.length.toString(), subtitle: 'Tersimpan', progress: '' },
    ];
    
    const activities = notes.slice(0,3).map((n: any) => ({
      id: n.id,
      title: n.title,
      subtitle: 'Catatan',
      time: new Date(n.createdAt).toLocaleDateString()
    }));

    return { metrics, activities };
  }, [isLoading, tasks, notes]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      {/* Decorative Background Blobs */}
      <View style={[styles.blob1, { backgroundColor: COLORS.primary + '15' }]} />
      <View style={[styles.blob2, { backgroundColor: COLORS.secondary + '15' }]} />

      <HomeHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AIHeroCard />
        <QuickActions />
        
        <TodayFocusMetrics isLoading={isLoading} metrics={data?.metrics || []} />
        
        <View style={styles.twoColumn}>
          <View style={{flex: 1}}>
            <AIInsight isLoading={isLoading} />
          </View>
        </View>

        <RecentActivities isLoading={isLoading} activities={data?.activities || []} />
        
        <MainModes />
        
        <TodaySchedule isLoading={isLoading} />
        <WeeklyProgress isLoading={isLoading} />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safe: { flex: 1, overflow: 'hidden' },
  blob1: { position: 'absolute', top: -height * 0.1, left: -width * 0.3, width: width, height: width, borderRadius: width * 0.5, opacity: 0.6 },
  blob2: { position: 'absolute', top: height * 0.5, right: -width * 0.4, width: width, height: width, borderRadius: width * 0.5, opacity: 0.5 },
  scrollContent: { paddingBottom: 80, zIndex: 10 },
  twoColumn: { flexDirection: 'row' }
});
