import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { BookOpen, Sparkles, HelpCircle, Layers, CheckSquare, CalendarDays } from 'lucide-react-native';

const STUDY_TOOLS = [
  { id: 'explain', title: 'Jelaskan Materi', desc: 'AI akan menyederhanakan materi yang sulit', icon: HelpCircle, route: '/study/explain' },
  { id: 'summary', title: 'Ringkasan Cepat', desc: 'Dapatkan intisari materi belajar', icon: BookOpen, route: '/study/summary' },
  { id: 'quiz', title: 'Latihan Quiz', desc: 'Uji pemahaman dengan pilihan ganda', icon: CheckSquare, route: '/study/quiz' },
  { id: 'practice', title: 'Latihan Esai', desc: 'Jawab soal esai yang menantang', icon: BookOpen, route: '/study/practice' },
  { id: 'flashcards', title: 'Flashcards', desc: 'Hafalkan konsep dengan kartu pintar', icon: Layers, route: '/study/flashcards' },
  { id: 'plan', title: 'Study Plan', desc: 'Buat jadwal belajar yang terstruktur', icon: CalendarDays, route: '/study/plan' },
  { id: 'tutor', title: 'AI Tutor', desc: 'Ngobrol langsung dengan tutor AI', icon: Sparkles, route: '/(tabs)/ai', mode: 'belajar' }
];

export default function StudyDashboard() {
  const isDark = useAppStore(state => state.theme) === 'dark';
  const router = useRouter();

  const handlePress = (tool: any) => {
    if (tool.mode) {
      router.push({ pathname: tool.route, params: { mode: tool.mode } });
    } else {
      router.push(tool.route);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Dashboard Belajar" />
      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="body" color={COLORS.textSecondary} style={styles.subtitle}>
          Pilih metode belajar yang sesuai dengan kebutuhan Anda. AI akan menggunakan dokumen yang Anda miliki sebagai bahan materi.
        </Typography>

        <View style={styles.grid}>
          {STUDY_TOOLS.map((tool) => (
            <TouchableOpacity 
              key={tool.id} 
              style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]} 
              onPress={() => handlePress(tool)}
            >
              <View style={styles.iconWrapper}>
                <tool.icon size={24} color={COLORS.success} />
              </View>
              <Typography variant="body" weight="bold" style={styles.cardTitle}>{tool.title}</Typography>
              <Typography variant="caption" color={COLORS.textSecondary}>{tool.desc}</Typography>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg },
  subtitle: { marginBottom: SPACING.xl },
  grid: { gap: SPACING.md },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center',
    padding: SPACING.md, 
    borderRadius: 16, 
    borderWidth: 1,
    marginBottom: SPACING.sm
  },
  iconWrapper: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    backgroundColor: COLORS.success + '15', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: SPACING.md
  },
  cardTitle: { marginBottom: 4 }
});
