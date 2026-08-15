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

export default function CreateProjectScreen() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const { addProject } = useWorkspaceStore();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title) { alert('Nama project harus diisi'); return; }
    setLoading(true);
    await addProject({
      title,
      desc,
      progress: 0,
      tasksCount: 0
    });
    setLoading(false);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Buat Project Baru" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          
          <Typography variant="body" weight="600" style={styles.label}>Nama Project</Typography>
          <Input placeholder="Contoh: Skripsi Bab 1" value={title} onChangeText={setTitle} />
          
          <View style={{ height: SPACING.md }} />
          <Typography variant="body" weight="600" style={styles.label}>Deskripsi (Opsional)</Typography>
          <Input placeholder="Detail mengenai project ini..." value={desc} onChangeText={setDesc} multiline />
          
          <View style={{ height: SPACING.xl }} />
          <Button title="Buat Project" onPress={handleSave} disabled={loading || !title} />
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
