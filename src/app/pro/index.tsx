import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { ArrowLeft, Crown, Sparkles, Brain, Globe, ChevronRight } from 'lucide-react-native';
import { SPACING, COLORS } from '@/constants/theme';
import { ProGuard } from '@/components/ui/ProGuard';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';

export default function ProToolsHub() {
  const router = useRouter();
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  const tools = [
    {
      id: 'multi-doc',
      title: 'Multi-Document Synthesis',
      description: 'Pilih hingga 10 PDF sekaligus dan biarkan AI membandingkan data, menyusun Literature Review, dan mencari Gap Penelitian.',
      icon: <Brain size={32} color="#FFD700" />,
      color: '#2d2d2d'
    },
    {
      id: 'auto-agent',
      title: 'Autonomous Agentic Workflow',
      description: 'Agen AI cerdas yang bekerja di latar belakang. Ia akan membaca, merangkum, dan menulis draft jurnal untuk Anda.',
      icon: <Sparkles size={32} color="#FFD700" />,
      color: '#2d2d2d'
    },
    {
      id: 'web-research',
      title: 'Smart Web Researcher',
      description: 'Hubungkan AI dengan Google Scholar & internet real-time untuk melengkapi argumen dan mencari sitasi terbaru.',
      icon: <Globe size={32} color="#FFD700" />,
      color: '#2d2d2d'
    }
  ];

  return (
    <ProGuard>
      <SafeAreaView style={[styles.container, { backgroundColor: '#121212' }]}>
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.hero}>
            <Crown size={48} color="#FFD700" />
            <Typography variant="h1" weight="bold" color="#FFD700" style={styles.heroTitle}>RisetFlow Pro</Typography>
            <Typography variant="body" color="#CCC" style={styles.heroSubtitle}>
              Selamat datang di pusat komando premium. Alat-alat di bawah ini ditenagai oleh model AI tercanggih untuk mengubah cara Anda meneliti selamanya.
            </Typography>
          </View>

          {tools.map(tool => (
            <TouchableOpacity 
              key={tool.id} 
              style={[styles.card, { backgroundColor: tool.color }]}
              onPress={() => Alert.alert('Coming Soon', `Modul ${tool.title} sedang dalam tahap finalisasi oleh tim engineer. Nantikan segera!`)}
            >
              <View style={styles.cardHeader}>
                {tool.icon}
                <View style={styles.cardText}>
                  <Typography variant="h3" weight="bold" color="#FFF">{tool.title}</Typography>
                  <Typography variant="caption" color="#AAA" style={{ marginTop: 4, lineHeight: 18 }}>{tool.description}</Typography>
                </View>
                <ChevronRight size={24} color="#FFF" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ProGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backBtn: {
    width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20
  },
  scroll: {
    padding: SPACING.lg,
  },
  hero: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  heroTitle: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    fontSize: 28,
  },
  heroSubtitle: {
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  card: {
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  }
});
