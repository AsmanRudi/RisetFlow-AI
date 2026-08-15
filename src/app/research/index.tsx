import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { FileSearch, Sparkles, BookOpen, Layers, Target, AlignLeft } from 'lucide-react-native';

const RESEARCH_TOOLS = [
  { id: 'analysis', title: 'Paper Analysis', desc: 'Analisis struktur, metode, dan hasil paper', icon: FileSearch, route: '/research/analysis' },
  { id: 'matrix', title: 'Research Matrix', desc: 'Sintesis temuan dari berbagai dokumen', icon: AlignLeft, route: '/research/matrix' },
  { id: 'lit-review', title: 'Literature Review', desc: 'Buat tinjauan pustaka otomatis', icon: BookOpen, route: '/research/lit-review' },
  { id: 'gap', title: 'Research Gap', desc: 'Temukan gap dan kontradiksi antar studi', icon: Layers, route: '/research/gap' },
  { id: 'conclusion', title: 'Conclusion Generator', desc: 'Sintesis kesimpulan dari literatur', icon: Target, route: '/research/conclusion' },
  { id: 'chat', title: 'Tanya Asisten Riset', desc: 'Ngobrol dengan AI tentang riset Anda', icon: Sparkles, route: '/(tabs)/ai', mode: 'riset' }
];

export default function ResearchDashboard() {
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
      <Header title="Dashboard Riset" />
      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="body" color={COLORS.textSecondary} style={styles.subtitle}>
          Pilih alat bantu riset yang ingin Anda gunakan. AI akan menganalisis dokumen di Perpustakaan Anda.
        </Typography>

        <View style={styles.grid}>
          {RESEARCH_TOOLS.map((tool) => (
            <TouchableOpacity 
              key={tool.id} 
              style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]} 
              onPress={() => handlePress(tool)}
            >
              <View style={styles.iconWrapper}>
                <tool.icon size={24} color={COLORS.primary} />
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
    backgroundColor: COLORS.primary + '15', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: SPACING.md
  },
  cardTitle: { marginBottom: 4 }
});
