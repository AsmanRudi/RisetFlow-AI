import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Typography } from '@/components/ui/Typography';
import { Paperclip, Mic, Send } from 'lucide-react-native';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

import { useLibraryStore } from '@/store/useLibraryStore';

interface AIComposerProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
  activeMode: 'belajar' | 'riset' | 'kerja';
  setActiveMode?: (mode: 'belajar' | 'riset' | 'kerja') => void;
}

export const AIComposer: React.FC<AIComposerProps> = ({ value, onChangeText, onSend, isLoading, activeMode, setActiveMode }) => {
  const theme = useAppStore(state => state.theme);
  const activeDocumentId = useAppStore(state => state.activeDocumentId);
  const documents = useLibraryStore(state => state.documents);
  const isDark = theme === 'dark';

  const activeDoc = activeDocumentId ? documents.find(d => d.id === activeDocumentId) : null;

  const getContextLabel = () => {
    switch(activeMode) {
      case 'belajar': return '📚 Mode Belajar';
      case 'riset': return '🔬 Mode Riset';
      case 'kerja': return '💼 Mode Kerja';
      default: return '';
    }
  };

  const cycleMode = () => {
    if (!setActiveMode) return;
    const modes: ('belajar' | 'riset' | 'kerja')[] = ['belajar', 'riset', 'kerja'];
    const nextIndex = (modes.indexOf(activeMode) + 1) % modes.length;
    setActiveMode(modes[nextIndex]);
  };

  const uploadDocument = useLibraryStore(state => state.uploadDocument);
  const setActiveDocumentId = useAppStore(state => state.setActiveDocumentId);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const doc = await uploadDocument(file.uri, file.name, file.mimeType || 'application/pdf');
        setActiveDocumentId(doc.id);
        alert('Dokumen berhasil dilampirkan ke obrolan!');
      }
    } catch (error) {
      alert('Gagal memilih dokumen.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderTopColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={cycleMode}
          style={[styles.contextPill, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}
        >
          <Typography variant="caption" weight="600" color={COLORS.primary}>{getContextLabel()}</Typography>
        </TouchableOpacity>
        {activeDoc && (
          <View style={[styles.contextPill, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background, marginTop: -4 }]}>
            <Typography variant="caption" weight="600" color={COLORS.textSecondary}>📄 Menggunakan: {activeDoc.title.length > 20 ? activeDoc.title.substring(0, 20) + '...' : activeDoc.title}</Typography>
          </View>
        )}
      </View>
      
      <View style={[styles.inputWrapper, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
        <TextInput
          placeholder="Tanya apa saja..."
          placeholderTextColor={isDark ? COLORS.darkTextSecondary : COLORS.textSecondary}
          style={[styles.input, { color: isDark ? COLORS.darkText : COLORS.text }]}
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={500}
        />
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handlePickDocument}>
            <Paperclip size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.sendBtn, (!value.trim() || isLoading) && styles.sendBtnDisabled]} 
            onPress={onSend}
            disabled={!value.trim() || isLoading}
          >
            <Send size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: SPACING.md, borderTopWidth: 1 },
  contextPill: { alignSelf: 'flex-start', paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: 12, marginBottom: SPACING.sm },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, paddingLeft: SPACING.md, paddingRight: SPACING.xs, paddingVertical: SPACING.xs, minHeight: 48 },
  input: { flex: 1, maxHeight: 100, fontSize: 15, paddingVertical: 8, ...({ outlineStyle: 'none' } as any) },
  actions: { flexDirection: 'row', alignItems: 'center', paddingBottom: 2 },
  iconBtn: { padding: SPACING.xs, marginHorizontal: 2 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginLeft: SPACING.xs },
  sendBtnDisabled: { opacity: 0.5 }
});
