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

export default function CreateTaskScreen() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const { addTask } = useWorkspaceStore();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title) { alert('Judul harus diisi'); return; }
    setLoading(true);
    await addTask({
      title,
      desc,
      priority,
      deadline: deadline || 'Tanpa deadline',
      status: 'Pending',
      type: 'Tugas'
    });
    setLoading(false);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Buat Tugas Baru" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          
          <Typography variant="body" weight="600" style={styles.label}>Judul Tugas</Typography>
          <Input placeholder="Contoh: Baca Jurnal AI" value={title} onChangeText={setTitle} />
          
          <View style={{ height: SPACING.md }} />
          <Typography variant="body" weight="600" style={styles.label}>Deskripsi (Opsional)</Typography>
          <Input placeholder="Detail tugas..." value={desc} onChangeText={setDesc} multiline />
          
          <View style={{ height: SPACING.md }} />
          <Typography variant="body" weight="600" style={styles.label}>Deadline</Typography>
          <Input placeholder="Contoh: Besok, 12 Okt" value={deadline} onChangeText={setDeadline} />
          
          <View style={{ height: SPACING.xl }} />
          <Button title="Simpan Tugas" onPress={handleSave} disabled={loading || !title} />
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
