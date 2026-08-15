import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useAIChatStore, AIMode } from '@/store/useAIChatStore';
import { MessageSquare, Plus, Trash2, ArrowLeft } from 'lucide-react-native';

export default function AIDashboardTab() {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const router = useRouter();

  const sessions = useAIChatStore(state => state.sessions);
  const createSession = useAIChatStore(state => state.createSession);
  const deleteSession = useAIChatStore(state => state.deleteSession);
  const fetchChats = useAIChatStore(state => state.fetchChats);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const startNewChat = async (mode: AIMode) => {
    const id = await createSession(mode);
    router.push(`/ai/chat/${id}` as any);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={{ marginRight: SPACING.md }}>
          <ArrowLeft size={24} color={isDark ? COLORS.darkText : COLORS.text} />
        </TouchableOpacity>
        <Typography variant="h2" weight="bold">Asisten AI</Typography>
      </View>
      
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.newChatSection}>
          <Typography variant="h3" weight="bold" style={{ marginBottom: SPACING.md }}>Mulai Percakapan Baru</Typography>
          <View style={styles.modeCards}>
            {[
              { mode: 'belajar', title: 'Mode Belajar', desc: 'Penjelasan konsep & tutor', color: COLORS.success, icon: '📚' },
              { mode: 'riset', title: 'Mode Riset', desc: 'Analisis & literatur', color: COLORS.primary, icon: '🔬' },
              { mode: 'kerja', title: 'Mode Kerja', desc: 'Produktivitas & profesional', color: COLORS.warning, icon: '💼' }
            ].map((m, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={[styles.modeCard, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}
                onPress={() => startNewChat(m.mode as AIMode)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrapper, { backgroundColor: m.color + '20' }]}>
                  <Typography style={{ fontSize: 24 }}>{m.icon}</Typography>
                </View>
                <Typography variant="body" weight="bold" style={{ marginTop: SPACING.sm }}>{m.title}</Typography>
                <Typography variant="caption" color={COLORS.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>{m.desc}</Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.historySection}>
          <Typography variant="h3" weight="bold" style={{ marginBottom: SPACING.md }}>Riwayat Percakapan</Typography>
          {sessions.length === 0 ? (
            <View style={{ alignItems: 'center', padding: SPACING.xl }}>
              <MessageSquare size={48} color={COLORS.border} />
              <Typography color={COLORS.textSecondary} style={{ marginTop: SPACING.md }}>Belum ada riwayat percakapan.</Typography>
            </View>
          ) : (
            sessions.map(session => (
              <TouchableOpacity 
                key={session.id} 
                style={[styles.historyItem, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}
                onPress={() => router.push(`/ai/chat/${session.id}` as any)}
              >
                <View style={[styles.historyIcon, { backgroundColor: session.mode === 'belajar' ? COLORS.success + '20' : session.mode === 'riset' ? COLORS.primary + '20' : COLORS.warning + '20' }]}>
                  <MessageSquare size={20} color={session.mode === 'belajar' ? COLORS.success : session.mode === 'riset' ? COLORS.primary : COLORS.warning} />
                </View>
                <View style={styles.historyText}>
                  <Typography variant="body" weight="600">{session.title}</Typography>
                  <Typography variant="caption" color={COLORS.textSecondary}>Mode {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)} • {session.messages.length} pesan</Typography>
                </View>
                <TouchableOpacity onPress={() => deleteSession(session.id)} style={{ padding: SPACING.xs }}>
                  <Trash2 size={18} color={COLORS.danger} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  container: {
    padding: SPACING.md,
  },
  newChatSection: {
    marginBottom: SPACING.xl,
  },
  modeCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeCard: {
    width: '31%',
    borderRadius: 16,
    padding: SPACING.sm,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historySection: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  historyText: {
    flex: 1,
  }
});
