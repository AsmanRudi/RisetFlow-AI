const fs = require('fs');
const path = require('path');

const files = {
  'src/app/workspace/task/[id].tsx': `import React, { useState } from 'react';
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
             <Button variant="outline" style={{ flex: 1, marginRight: SPACING.sm }} onPress={() => {}}>
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
`,
  'src/app/library/doc/[id].tsx': `import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { FileText, Sparkles, Edit3, Trash2 } from 'lucide-react-native';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const { documents, deleteDocument } = useLibraryStore();
  const doc = documents.find(d => d.id === id);

  const [showDelete, setShowDelete] = useState(false);

  if (!doc) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Detail Dokumen" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconBox}>
          <FileText size={48} color={COLORS.primary} />
        </View>
        <Typography variant="h2" weight="bold" align="center" style={{ marginBottom: SPACING.xs }}>{doc.title}</Typography>
        <Typography variant="body" color={COLORS.textSecondary} align="center" style={{ marginBottom: SPACING.xl }}>
          {doc.type} • {doc.size} • Ditambahkan {doc.date}
        </Typography>

        <View style={styles.actions}>
           <Button variant="primary" style={styles.btnRow} onPress={() => {}}>
             <Typography weight="bold" color="#FFF">📖 Buka Dokumen</Typography>
           </Button>
           <Button variant="outline" style={[styles.btnRow, { marginTop: SPACING.md }]} onPress={() => router.push('/(tabs)/ai')}>
             <Sparkles size={18} color={COLORS.primary} style={{ marginRight: SPACING.sm }} />
             <Typography weight="600" color={COLORS.primary}>Tanya AI</Typography>
           </Button>
           <Button variant="outline" style={[styles.btnRow, { marginTop: SPACING.md }]} onPress={() => {}}>
             <Edit3 size={18} color={COLORS.primary} style={{ marginRight: SPACING.sm }} />
             <Typography weight="600" color={COLORS.primary}>Ringkas</Typography>
           </Button>
           <Button variant="outline" style={[styles.btnRow, { marginTop: SPACING.md, borderColor: COLORS.danger }]} onPress={() => setShowDelete(true)}>
             <Trash2 size={18} color={COLORS.danger} style={{ marginRight: SPACING.sm }} />
             <Typography weight="600" color={COLORS.danger}>Hapus Dokumen</Typography>
           </Button>
        </View>

        <Typography variant="h3" weight="bold" style={{ marginTop: SPACING.xl, marginBottom: SPACING.md }}>Pratinjau</Typography>
        <View style={[styles.previewCard, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
           <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
           <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
           <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
           <Skeleton width="90%" height={16} />
        </View>
      </ScrollView>

      <ConfirmModal 
        isVisible={showDelete}
        title="Hapus Dokumen?"
        message="Dokumen yang dihapus tidak dapat dikembalikan."
        isDanger
        onCancel={() => setShowDelete(false)}
        onConfirm={() => {
          deleteDocument(doc.id);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg },
  iconBox: { width: 100, height: 100, borderRadius: 24, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: SPACING.lg },
  actions: { paddingHorizontal: SPACING.lg },
  btnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  previewCard: { padding: SPACING.lg, borderRadius: 16, borderWidth: 1 }
});
`,
  'src/app/workspace/note/[id].tsx': `import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Edit3 } from 'lucide-react-native';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
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
`,
  'src/app/workspace/project/[id].tsx': `import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { FolderKanban } from 'lucide-react-native';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const { projects } = useWorkspaceStore();
  const project = projects.find(p => p.id === id);

  if (!project) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Detail Project" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconBox}>
          <FolderKanban size={40} color={COLORS.primary} />
        </View>
        <Typography variant="h2" weight="bold" style={{ marginBottom: SPACING.sm }}>{project.title}</Typography>
        <Typography variant="body" color={COLORS.textSecondary} style={{ marginBottom: SPACING.xl }}>{project.desc}</Typography>
        
        <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
             <Typography variant="body" weight="bold">Progress</Typography>
             <Typography variant="body" weight="bold" color={COLORS.primary}>{project.progress}%</Typography>
           </View>
           <ProgressBar progress={project.progress} />
           <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: SPACING.md }}>{project.tasksCount} Tugas tersisa</Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg },
  iconBox: { width: 64, height: 64, borderRadius: 16, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  card: { padding: SPACING.lg, borderRadius: 16, borderWidth: 1 }
});
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Setup 4 complete');
