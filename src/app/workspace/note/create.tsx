import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export default function CreateNoteScreen() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const { addNote } = useWorkspaceStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !content) { alert('Judul dan isi catatan harus diisi'); return; }
    setLoading(true);
    await addNote({
      title,
      content,
      tags: [],
      date: new Date().toISOString()
    });
    setLoading(false);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Buat Catatan Baru" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          
          <Typography variant="body" weight="600" style={styles.label}>Judul Catatan</Typography>
          <Input placeholder="Contoh: Ide Skripsi" value={title} onChangeText={setTitle} />
          
          <View style={{ height: SPACING.md }} />
          <Typography variant="body" weight="600" style={styles.label}>Isi Catatan</Typography>
          <Input placeholder="Tuliskan catatan Anda di sini..." value={content} onChangeText={setContent} multiline />
          
          <View style={{ height: SPACING.xl }} />
          <Button title="Simpan Catatan" onPress={handleSave} disabled={loading || !title || !content} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg },
  label: { marginBottom: SPACING.xs }
});
