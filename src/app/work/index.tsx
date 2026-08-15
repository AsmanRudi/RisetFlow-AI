import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { Briefcase, Sparkles, FileText, Search, AlignLeft, CheckSquare } from 'lucide-react-native';

const WORK_TOOLS = [
  { id: 'doc-assistant', title: 'Document Assistant', desc: 'Tanya jawab profesional seputar dokumen kerja', icon: Briefcase, route: '/work/document-assistant' },
  { id: 'report-summary', title: 'Executive Summary', desc: 'Buat ringkasan laporan yang padat', icon: AlignLeft, route: '/work/report-summary' },
  { id: 'knowledge-search', title: 'Knowledge Search', desc: 'Cari informasi dari semua dokumen dan catatan', icon: Search, route: '/work/knowledge-search' },
  { id: 'notes', title: 'Catatan Rapat', desc: 'Akses dan kelola catatan kerja', icon: FileText, route: '/(tabs)/workspace' },
  { id: 'tasks', title: 'Manajemen Tugas', desc: 'Kelola to-do list dan prioritas', icon: CheckSquare, route: '/(tabs)/workspace' },
  { id: 'assistant', title: 'AI Assistant', desc: 'Bantuan profesional untuk pekerjaan Anda', icon: Sparkles, route: '/(tabs)/ai', mode: 'kerja' }
];

export default function WorkDashboard() {
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
      <Header title="Dashboard Kerja" />
      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="body" color={COLORS.textSecondary} style={styles.subtitle}>
          Tingkatkan produktivitas Anda. Gunakan AI untuk menganalisis dokumen kerja, membuat ringkasan, dan mencari informasi penting.
        </Typography>

        <View style={styles.grid}>
          {WORK_TOOLS.map((tool) => (
            <TouchableOpacity 
              key={tool.id} 
              style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]} 
              onPress={() => handlePress(tool)}
            >
              <View style={styles.iconWrapper}>
                <tool.icon size={24} color={COLORS.warning} />
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
    backgroundColor: COLORS.warning + '15', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: SPACING.md
  },
  cardTitle: { marginBottom: 4 }
});
