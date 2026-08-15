import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Check, Trash2, Edit3 } from 'lucide-react-native';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const { tasks, updateTask, deleteTask } = useWorkspaceStore();
  const task = tasks.find(t => t.id === id);

  const [showDelete, setShowDelete] = useState(false);

  if (!task) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Detail Tugas" />
      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="h1" weight="bold" style={{ marginBottom: SPACING.sm }}>{task.title}</Typography>
        <View style={styles.badgeRow}>
           <Badge label={task.priority} variant={task.priority === 'High' ? 'danger' : 'warning'} style={{ marginRight: SPACING.sm }} />
           <Badge label={task.type} variant="primary" style={{ marginRight: SPACING.sm }} />
           <Badge label={task.deadline} variant="default" />
        </View>
        
        <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
          <Typography variant="body" color={COLORS.textSecondary} style={{ lineHeight: 22 }}>
            {task.desc}
          </Typography>
        </View>

        <View style={styles.actions}>
           <Button variant={task.status === 'Completed' ? 'outline' : 'primary'} style={styles.actionBtn} onPress={() => updateTask(task.id, { status: task.status === 'Completed' ? 'Pending' : 'Completed' })}>
             <Check size={20} color={task.status === 'Completed' ? COLORS.primary : '#FFF'} style={{ marginRight: SPACING.sm }} />
             <Typography weight="bold" color={task.status === 'Completed' ? COLORS.primary : '#FFF'}>
               {task.status === 'Completed' ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
             </Typography>
           </Button>
           
           <View style={{ flexDirection: 'row', marginTop: SPACING.md }}>
             <Button variant="outline" style={{ flex: 1, marginRight: SPACING.sm }} onPress={() => alert('Fitur edit tugas akan segera tersedia!')}>
               <Edit3 size={18} color={COLORS.primary} style={{ marginRight: SPACING.xs }} />
               <Typography weight="600" color={COLORS.primary}>Edit</Typography>
             </Button>
             <Button variant="outline" style={{ flex: 1, borderColor: COLORS.danger }} onPress={() => setShowDelete(true)}>
               <Trash2 size={18} color={COLORS.danger} style={{ marginRight: SPACING.xs }} />
               <Typography weight="600" color={COLORS.danger}>Hapus</Typography>
             </Button>
           </View>
        </View>
      </ScrollView>

      <ConfirmModal 
        isVisible={showDelete}
        title="Hapus Tugas?"
        message="Tugas yang dihapus tidak dapat dikembalikan."
        isDanger
        onCancel={() => setShowDelete(false)}
        onConfirm={() => {
          deleteTask(task.id);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg },
  badgeRow: { flexDirection: 'row', marginBottom: SPACING.xl },
  card: { padding: SPACING.lg, borderRadius: 16, borderWidth: 1, marginBottom: SPACING.xl },
  actions: { marginTop: SPACING.md },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
});
