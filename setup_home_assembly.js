const fs = require('fs');
const path = require('path');

const files = {
  'src/app/(tabs)/index.tsx': `import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View } from 'react-native';
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
import { mockData } from '@/data/mock';
import { useAuthStore } from '@/store/useAuthStore';

export default function HomeTab() {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const role = useAuthStore(state => state.user?.role) || 'student';
  
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Deferred mock data loading to optimize JS thread at startup
    const timer = setTimeout(() => {
      const roleData = mockData[role as keyof typeof mockData] || mockData.student;
      
      // Transform mock data into UI formats
      const metrics = [
        { title: 'Tugas', count: '2', subtitle: '1 selesai', progress: '50%' },
        { title: 'Belajar', count: '1', subtitle: 'Matematika', progress: '45 mnt' },
        { title: 'Deadline', count: '1', subtitle: 'Biologi', progress: 'Besok' },
      ];
      
      const activities = roleData.notes.map((n: any, i: number) => ({
        id: n.id,
        title: n.title,
        subtitle: 'Catatan',
        time: n.date
      }));

      setData({ metrics, activities });
      setIsLoading(false);
    }, 800); // 800ms artificial delay for skeleton demonstration

    return () => clearTimeout(timer);
  }, [role]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
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

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  twoColumn: { flexDirection: 'row' }
});
`,
  'src/app/(tabs)/_layout.tsx': `import React from 'react';
import { Tabs, usePathname } from 'expo-router';
import { View } from 'react-native';
import { Home, FolderKanban, Sparkles, Library, User, Edit3, CheckSquare, Upload, FileText, PlusCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { FAB, FABAction } from '@/components/ui/FAB';

export default function TabsLayout() {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const pathname = usePathname();

  // Context-aware FAB Actions
  const getFABActions = (): FABAction[] | null => {
    const iconColor = COLORS.primary;
    if (pathname === '/' || pathname === '/(tabs)') {
      return [
        { id: '1', label: 'Tanya AI', icon: <Sparkles size={20} color={iconColor} />, onPress: () => {} },
        { id: '2', label: 'Buat Catatan', icon: <Edit3 size={20} color={iconColor} />, onPress: () => {} },
        { id: '3', label: 'Buat Tugas', icon: <CheckSquare size={20} color={iconColor} />, onPress: () => {} },
        { id: '4', label: 'Upload PDF', icon: <Upload size={20} color={iconColor} />, onPress: () => {} },
      ];
    }
    if (pathname === '/workspace') {
      return [
        { id: '1', label: 'Buat Project', icon: <FolderKanban size={20} color={iconColor} />, onPress: () => {} },
        { id: '2', label: 'Buat Task', icon: <CheckSquare size={20} color={iconColor} />, onPress: () => {} },
        { id: '3', label: 'Buat Catatan', icon: <Edit3 size={20} color={iconColor} />, onPress: () => {} },
      ];
    }
    if (pathname === '/library') {
      return [
        { id: '1', label: 'Upload Dokumen', icon: <Upload size={20} color={iconColor} />, onPress: () => {} },
        { id: '2', label: 'Buat Catatan', icon: <Edit3 size={20} color={iconColor} />, onPress: () => {} },
        { id: '3', label: 'Tambah Paper', icon: <FileText size={20} color={iconColor} />, onPress: () => {} },
      ];
    }
    return null; // No FAB for AI or Profile tabs
  };

  const fabActions = getFABActions();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface,
            borderTopColor: isDark ? COLORS.darkBorder : COLORS.border,
            elevation: 10,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: isDark ? COLORS.darkTextSecondary : COLORS.textSecondary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="workspace"
          options={{
            title: 'Ruang Kerja',
            tabBarIcon: ({ color, size }) => <FolderKanban color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="ai"
          options={{
            title: 'Asisten AI',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{
                backgroundColor: focused ? COLORS.primary : COLORS.primaryLight + '20',
                padding: 10,
                borderRadius: 20,
                marginBottom: 4,
              }}>
                <Sparkles color={focused ? '#FFF' : COLORS.primary} size={size} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Perpustakaan',
            tabBarIcon: ({ color, size }) => <Library color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
      {fabActions && <FAB actions={fabActions} />}
    </>
  );
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Home assembly complete!');
