import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Sparkles, Paperclip, Mic, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export const AIHeroCard = () => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const router = useRouter();

  const handlePickDocument = async () => {
    try {
      const { getDocumentAsync } = await import('expo-document-picker');
      const { useLibraryStore } = await import('@/store/useLibraryStore');
      const uploadDocument = useLibraryStore.getState().uploadDocument;
      
      const result = await getDocumentAsync({ type: 'application/pdf' });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const doc = await uploadDocument(file.uri, file.name, file.mimeType || 'application/pdf');
        useAppStore.getState().setActiveDocumentId(doc.id);
        alert('Dokumen berhasil dilampirkan!');
        router.push('/(tabs)/ai');
      }
    } catch (error) {
      alert('Gagal memilih dokumen.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.primaryLight + '20' }]}>
      <View style={styles.header}>
        <Sparkles size={20} color={COLORS.primary} />
        <Typography variant="h3" weight="bold" style={{ marginLeft: SPACING.sm }}>✨ Asisten AI</Typography>
      </View>
      <Typography variant="caption" color={isDark ? COLORS.darkTextSecondary : COLORS.textSecondary} style={{ marginBottom: SPACING.md }}>
        Tanyakan apa saja, saya siap membantu.
      </Typography>

      <View style={[styles.inputContainer, { backgroundColor: isDark ? COLORS.darkBackground : '#FFF' }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push('/(tabs)/ai')}>
          <TextInput
            placeholder="Tanya apa saja..."
            placeholderTextColor={isDark ? COLORS.darkTextSecondary : COLORS.textSecondary}
            style={[styles.input, { color: isDark ? COLORS.darkText : COLORS.text }]}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handlePickDocument}>
            <Paperclip size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(tabs)/ai')}>
            <Mic size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={() => router.push('/(tabs)/ai')}>
            <Send size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: SPACING.lg, padding: SPACING.lg, borderRadius: 16, marginBottom: SPACING.lg, elevation: 4, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 24, paddingLeft: SPACING.md, paddingRight: SPACING.xs, height: 48, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, fontSize: 14, ...({ outlineStyle: 'none' } as any) },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: SPACING.xs, marginHorizontal: 2 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginLeft: SPACING.xs }
});
