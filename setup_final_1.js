const fs = require('fs');
const path = require('path');

const files = {
  'src/data/mock.ts': `export type MockTask = { id: string; title: string; desc: string; priority: 'High' | 'Medium' | 'Low'; deadline: string; status: 'Pending' | 'Completed'; type: 'Tugas' | 'Belajar' | 'Kerja'; };
export type MockNote = { id: string; title: string; content: string; date: string; tags: string[]; };
export type MockDocument = { id: string; title: string; type: 'PDF' | 'DOCX'; size: string; date: string; isPaper: boolean; };
export type MockProject = { id: string; title: string; progress: number; tasksCount: number; desc: string; };

export const mockTasks: MockTask[] = [
  { id: 't1', title: 'Rangkuman Bab 3 Biologi', desc: 'Selesaikan ringkasan dan latihan soal.', priority: 'High', deadline: 'Besok', status: 'Pending', type: 'Tugas' },
  { id: 't2', title: 'Belajar Matematika', desc: 'Persiapan UTS minggu depan.', priority: 'Medium', deadline: 'Minggu depan', status: 'Pending', type: 'Belajar' },
  { id: 't3', title: 'Revisi UI', desc: 'Ubah border radius button menjadi 8px.', priority: 'High', deadline: 'Hari ini', status: 'Completed', type: 'Kerja' },
];

export const mockNotes: MockNote[] = [
  { id: 'n1', title: 'Catatan Metodologi Penelitian', content: 'Kuantitatif dan kualitatif memiliki perbedaan mendasar pada cara pengambilan data...', date: 'Kemarin', tags: ['Penelitian', 'Metodologi'] },
  { id: 'n2', title: 'Rumus Fisika Dasar', content: 'F = m.a\\nE = mc2\\n...', date: '2 hari lalu', tags: ['Fisika', 'Rumus'] },
];

export const mockDocuments: MockDocument[] = [
  { id: 'd1', title: 'Proposal Penelitian AI.pdf', type: 'PDF', size: '2.4 MB', date: 'Kemarin', isPaper: false },
  { id: 'd2', title: 'The Role of LLMs in Education.pdf', type: 'PDF', size: '5.1 MB', date: 'Minggu lalu', isPaper: true },
  { id: 'd3', title: 'Meeting Client - Website.docx', type: 'DOCX', size: '1.2 MB', date: '3 hari lalu', isPaper: false },
];

export const mockProjects: MockProject[] = [
  { id: 'p1', title: 'Penelitian AI dalam Pendidikan', progress: 45, tasksCount: 12, desc: 'Proyek akhir semester mengenai dampak AI.' },
  { id: 'p2', title: 'Website Client XYZ', progress: 80, tasksCount: 5, desc: 'Pengerjaan sistem manajemen klinik.' },
];
`,
  'src/store/useWorkspaceStore.ts': `import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MockTask, MockNote, MockProject, mockTasks, mockNotes, mockProjects } from '@/data/mock';

interface WorkspaceState {
  tasks: MockTask[];
  notes: MockNote[];
  projects: MockProject[];
  
  addTask: (task: Omit<MockTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<MockTask>) => void;
  deleteTask: (id: string) => void;

  addNote: (note: Omit<MockNote, 'id'>) => void;
  updateNote: (id: string, updates: Partial<MockNote>) => void;
  deleteNote: (id: string) => void;

  addProject: (project: Omit<MockProject, 'id'>) => void;
  updateProject: (id: string, updates: Partial<MockProject>) => void;
  deleteProject: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      tasks: mockTasks,
      notes: mockNotes,
      projects: mockProjects,

      addTask: (task) => set((state) => ({ tasks: [{ ...task, id: Date.now().toString() }, ...state.tasks] })),
      updateTask: (id, updates) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),

      addNote: (note) => set((state) => ({ notes: [{ ...note, id: Date.now().toString() }, ...state.notes] })),
      updateNote: (id, updates) => set((state) => ({ notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n) })),
      deleteNote: (id) => set((state) => ({ notes: state.notes.filter(n => n.id !== id) })),

      addProject: (project) => set((state) => ({ projects: [{ ...project, id: Date.now().toString() }, ...state.projects] })),
      updateProject: (id, updates) => set((state) => ({ projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p) })),
      deleteProject: (id) => set((state) => ({ projects: state.projects.filter(p => p.id !== id) })),
    }),
    { name: 'risetflow-workspace', storage: createJSONStorage(() => AsyncStorage) }
  )
);
`,
  'src/store/useLibraryStore.ts': `import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MockDocument, mockDocuments } from '@/data/mock';

interface LibraryState {
  documents: MockDocument[];
  addDocument: (doc: Omit<MockDocument, 'id'>) => void;
  deleteDocument: (id: string) => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      documents: mockDocuments,
      addDocument: (doc) => set((state) => ({ documents: [{ ...doc, id: Date.now().toString() }, ...state.documents] })),
      deleteDocument: (id) => set((state) => ({ documents: state.documents.filter(d => d.id !== id) })),
    }),
    { name: 'risetflow-library', storage: createJSONStorage(() => AsyncStorage) }
  )
);
`,
  'src/components/ui/EmptyState.tsx': `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { SPACING, COLORS } from '@/constants/theme';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <View style={styles.container}>
    <View style={styles.iconBox}><Icon size={48} color={COLORS.primary} /></View>
    <Typography variant="h2" weight="bold" style={styles.title}>{title}</Typography>
    <Typography variant="body" color={COLORS.textSecondary} align="center" style={styles.desc}>{description}</Typography>
    {actionLabel && onAction && <Button variant="primary" onPress={onAction} style={styles.btn}>{actionLabel}</Button>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl, marginTop: 40 },
  iconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  title: { marginBottom: SPACING.sm },
  desc: { marginBottom: SPACING.xl, lineHeight: 22 },
  btn: { paddingHorizontal: SPACING.xl }
});
`,
  'src/components/ui/Badge.tsx': `import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', style }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  let color = COLORS.textSecondary;
  let bg = isDark ? COLORS.darkSurface : COLORS.border;

  switch (variant) {
    case 'success': color = COLORS.success; bg = COLORS.success + '20'; break;
    case 'warning': color = COLORS.warning; bg = COLORS.warning + '20'; break;
    case 'danger': color = COLORS.danger; bg = COLORS.danger + '20'; break;
    case 'primary': color = COLORS.primary; bg = COLORS.primaryLight + '20'; break;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Typography variant="caption" weight="600" color={color}>{label}</Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' }
});
`,
  'src/components/ui/ListItem.tsx': `import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { LucideIcon, MoreVertical } from 'lucide-react-native';

interface ListItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  rightLabel?: string;
  onPress?: () => void;
  onAction?: () => void;
  style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = ({ icon: Icon, title, subtitle, rightLabel, onPress, onAction, style }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }, style]} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.iconBox}><Icon size={24} color={COLORS.primary} /></View>
      <View style={styles.content}>
        <Typography variant="body" weight="bold">{title}</Typography>
        {subtitle && <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: 2 }}>{subtitle}</Typography>}
      </View>
      {rightLabel && <Typography variant="caption" color={COLORS.textSecondary} style={{ marginRight: SPACING.md }}>{rightLabel}</Typography>}
      {onAction && (
        <TouchableOpacity style={styles.actionBtn} onPress={onAction}>
          <MoreVertical size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: 12, borderWidth: 1, marginBottom: SPACING.sm },
  iconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  content: { flex: 1, justifyContent: 'center' },
  actionBtn: { padding: SPACING.xs }
});
`,
  'src/components/ui/Header.tsx': `import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';
import { ArrowLeft } from 'lucide-react-native';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightElement }) => {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <View style={[styles.container, { borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <ArrowLeft size={24} color={isDark ? COLORS.darkText : COLORS.text} />
      </TouchableOpacity>
      <Typography variant="h3" weight="bold" style={styles.title}>{title}</Typography>
      <View style={styles.right}>{rightElement}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', height: 60, paddingHorizontal: SPACING.md, borderBottomWidth: 1 },
  backBtn: { padding: SPACING.xs, marginRight: SPACING.md },
  title: { flex: 1 },
  right: { minWidth: 40, alignItems: 'flex-end' }
});
`,
  'src/components/ui/ConfirmModal.tsx': `import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface ConfirmModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isVisible, title, message, confirmLabel = 'Konfirmasi', cancelLabel = 'Batal', isDanger = false, onConfirm, onCancel }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  if (!isVisible) return null;

  return (
    <Modal transparent animationType="fade" visible={isVisible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
          <Typography variant="h3" weight="bold" style={styles.title}>{title}</Typography>
          <Typography variant="body" color={COLORS.textSecondary} style={styles.message}>{message}</Typography>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
              <Typography variant="body" weight="600">{cancelLabel}</Typography>
            </TouchableOpacity>
            <Button variant={isDanger ? 'outline' : 'primary'} onPress={() => { onConfirm(); onCancel(); }} style={{ flex: 1, borderColor: isDanger ? COLORS.danger : COLORS.primary }}>
              <Typography variant="body" weight="bold" color={isDanger ? COLORS.danger : '#FFF'}>{confirmLabel}</Typography>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  card: { width: '100%', borderRadius: 16, padding: SPACING.lg, elevation: 5 },
  title: { marginBottom: SPACING.sm },
  message: { marginBottom: SPACING.xl, lineHeight: 22 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  cancelBtn: { flex: 1, alignItems: 'center', paddingVertical: 12 }
});
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Setup 1 complete');
