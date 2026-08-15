import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Edit3 } from 'lucide-react-native';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const { notes } = useWorkspaceStore();
  const note = notes.find(n => n.id === id);

  if (!note) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header 
        title="Catatan" 
        rightElement={<Edit3 size={20} color={COLORS.primary} />} 
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="h1" weight="bold" style={{ marginBottom: SPACING.xs }}>{note.title}</Typography>
        <Typography variant="caption" color={COLORS.textSecondary} style={{ marginBottom: SPACING.xl }}>{note.date}</Typography>
        
        <Typography variant="body" color={isDark ? COLORS.darkText : COLORS.text} style={{ lineHeight: 26 }}>
          {note.content}
        </Typography>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg }
});
