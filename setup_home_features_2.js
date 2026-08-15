const fs = require('fs');
const path = require('path');

const files = {
  'src/features/home/components/TodayFocusMetrics.tsx': `import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
            <View key={idx} style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
              <Typography variant="h1" color={COLORS.primary} weight="bold">{m.count}</Typography>
              <Typography variant="body" weight="600">{m.title}</Typography>
              <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: SPACING.xs }}>
                {m.subtitle} {m.progress && \`• \${m.progress}\`}
              </Typography>
            </View>
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
`,
  'src/features/home/components/RecentActivities.tsx': `import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Skeleton } from '@/components/ui/Skeleton';
import { SPACING, COLORS } from '@/constants/theme';
import { FileText, MoreVertical } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';

interface ActivityProps {
  isLoading: boolean;
  activities: { id: string; title: string; subtitle: string; time: string }[];
}

export const RecentActivities: React.FC<ActivityProps> = ({ isLoading, activities }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

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
            <TouchableOpacity key={act.id} style={[styles.item, idx !== activities.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
              <View style={styles.iconBox}><FileText size={20} color={COLORS.primary} /></View>
              <View style={styles.itemContent}>
                <Typography variant="body" weight="600">{act.title}</Typography>
                <Typography variant="caption" color={COLORS.textSecondary}>{act.subtitle} • {act.time}</Typography>
              </View>
              <TouchableOpacity style={{ padding: SPACING.xs }}>
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
`,
  'src/features/home/components/MainModes.tsx': `import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export const MainModes = () => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const modes = [
    { title: 'Belajar', emoji: '📚', desc: 'AI Tutor, Quiz, Flashcard', color: COLORS.success },
    { title: 'Riset', emoji: '🔬', desc: 'Paper, Lit Review, Citation', color: COLORS.primary },
    { title: 'Kerja', emoji: '💼', desc: 'Task, Meeting, Document', color: COLORS.warning },
  ];

  return (
    <View style={styles.container}>
      <Typography variant="h3" weight="bold" style={styles.title}>Mode Utama</Typography>
      {modes.map((m, idx) => (
        <TouchableOpacity key={idx} style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]} activeOpacity={0.8}>
          <View style={[styles.iconBox, { backgroundColor: m.color + '20' }]}>
            <Typography style={{ fontSize: 24 }}>{m.emoji}</Typography>
          </View>
          <View style={styles.content}>
            <Typography variant="body" weight="bold">{m.title}</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>{m.desc}</Typography>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  title: { marginBottom: SPACING.sm },
  card: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.sm, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  content: { marginLeft: SPACING.md, flex: 1 }
});
`,
  'src/features/home/components/AIInsight.tsx': `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Skeleton } from '@/components/ui/Skeleton';
import { SPACING, COLORS } from '@/constants/theme';
import { Sparkles } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';

export const AIInsight = ({ isLoading = false }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.primaryLight + '15', borderColor: COLORS.primaryLight + '30' }]}>
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
            Berdasarkan aktivitasmu, sebaiknya selesaikan Rangkuman Bab 3 Biologi sebelum pukul 10:00 agar kamu punya waktu untuk belajar Matematika.
          </Typography>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  card: { padding: SPACING.lg, borderRadius: 16, borderWidth: 1 },
  header: { flexDirection: 'row', alignItems: 'center' }
});
`,
  'src/features/home/components/TodaySchedule.tsx': `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { Skeleton } from '@/components/ui/Skeleton';

export const TodaySchedule = ({ isLoading = false }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const schedule = [
    { time: '10:00', title: 'Rangkuman Bab 3 Biologi', active: true },
    { time: '14:00', title: 'Belajar Matematika', active: false },
    { time: '16:30', title: 'Baca Paper AI Education', active: false },
  ];

  return (
    <View style={styles.container}>
      <Typography variant="h3" weight="bold" style={styles.title}>Jadwal Hari Ini</Typography>
      <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
        {isLoading ? (
          <View style={{ padding: SPACING.md }}>
            <Skeleton width="60%" height={16} style={{ marginBottom: SPACING.md }} />
            <Skeleton width="70%" height={16} />
          </View>
        ) : (
          schedule.map((item, idx) => (
            <View key={idx} style={styles.row}>
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
            </View>
          ))
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
`,
  'src/features/home/components/WeeklyProgress.tsx': `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { Skeleton } from '@/components/ui/Skeleton';

export const WeeklyProgress = ({ isLoading = false }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const progressData = [
    { label: 'Belajar', percent: 72, color: COLORS.success },
    { label: 'Riset', percent: 58, color: COLORS.primary },
    { label: 'Kerja', percent: 80, color: COLORS.warning },
  ];

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
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Home features setup 2 complete!');
