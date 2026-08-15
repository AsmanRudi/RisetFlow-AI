const fs = require('fs');
const path = require('path');

const files = {
  'src/app/(tabs)/workspace.tsx': `import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { ListItem } from '@/components/ui/ListItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { FolderKanban, CheckSquare, Edit3, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function WorkspaceTab() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const { tasks, notes, projects } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState<'Semua' | 'Project' | 'Tugas' | 'Catatan'>('Semua');

  const tabs = ['Semua', 'Project', 'Tugas', 'Catatan'] as const;

  const renderContent = () => {
    let items: React.ReactNode[] = [];

    if (activeTab === 'Semua' || activeTab === 'Project') {
      items.push(...projects.map(p => (
        <ListItem 
          key={\`p-\${p.id}\`}
          icon={FolderKanban}
          title={p.title}
          subtitle={\`\${p.progress}% Selesai • \${p.tasksCount} Tugas\`}
          onPress={() => router.push(\`/workspace/project/\${p.id}\` as any)}
        />
      )));
    }

    if (activeTab === 'Semua' || activeTab === 'Tugas') {
      items.push(...tasks.map(t => (
        <View key={\`t-\${t.id}\`} style={styles.taskWrapper}>
          <ListItem 
            icon={CheckSquare}
            title={t.title}
            subtitle={t.desc}
            onPress={() => router.push(\`/workspace/task/\${t.id}\` as any)}
            style={{ marginBottom: 4 }}
          />
          <View style={styles.badgeRow}>
            <Badge label={t.priority} variant={t.priority === 'High' ? 'danger' : 'warning'} style={{ marginRight: 8 }} />
            <Badge label={t.status} variant={t.status === 'Completed' ? 'success' : 'default'} />
          </View>
        </View>
      )));
    }

    if (activeTab === 'Semua' || activeTab === 'Catatan') {
      items.push(...notes.map(n => (
        <ListItem 
          key={\`n-\${n.id}\`}
          icon={Edit3}
          title={n.title}
          subtitle={n.date}
          onPress={() => router.push(\`/workspace/note/\${n.id}\` as any)}
        />
      )));
    }

    if (items.length === 0) {
      return (
        <EmptyState 
          icon={FolderKanban}
          title={\`Belum ada \${activeTab.toLowerCase()}\`}
          description="Mulai kelola tugas dan proyek Anda di Ruang Kerja."
          actionLabel="Buat Baru"
          onAction={() => {}}
        />
      );
    }

    return items;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <View style={styles.header}>
        <Typography variant="h2" weight="bold">Ruang Kerja</Typography>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab ? styles.tabActive : { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}
              onPress={() => setActiveTab(tab)}
            >
              <Typography variant="caption" weight="600" color={activeTab === tab ? '#FFF' : (isDark ? COLORS.darkTextSecondary : COLORS.textSecondary)}>{tab}</Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  tabsContainer: { marginBottom: SPACING.md },
  tabsScroll: { paddingHorizontal: SPACING.lg },
  tab: { paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: 20, marginRight: SPACING.sm, borderWidth: 1, borderColor: 'transparent' },
  tabActive: { backgroundColor: COLORS.primary },
  listContainer: { paddingHorizontal: SPACING.lg, paddingBottom: 100 },
  taskWrapper: { marginBottom: SPACING.md },
  badgeRow: { flexDirection: 'row', marginLeft: 56, marginTop: -4 }
});
`,
  'src/app/(tabs)/library.tsx': `import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { ListItem } from '@/components/ui/ListItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, FileText } from 'lucide-react-native';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { useRouter } from 'expo-router';

export default function LibraryTab() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const { documents } = useLibraryStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Semua' | 'Paper' | 'Dokumen'>('Semua');

  const filteredDocs = documents.filter(doc => {
    if (filter === 'Paper' && !doc.isPaper) return false;
    if (filter === 'Dokumen' && doc.isPaper) return false;
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <View style={styles.header}>
        <Typography variant="h2" weight="bold">Perpustakaan</Typography>
        <Typography variant="body" color={COLORS.textSecondary}>Koleksi pengetahuan & paper.</Typography>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInput, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput 
            placeholder="Cari dokumen..." 
            placeholderTextColor={COLORS.textSecondary}
            style={[styles.input, { color: isDark ? COLORS.darkText : COLORS.text }]}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={styles.filters}>
        {(['Semua', 'Paper', 'Dokumen'] as const).map(f => (
          <TouchableOpacity 
            key={f}
            style={[styles.chip, filter === f ? styles.chipActive : { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}
            onPress={() => setFilter(f)}
          >
             <Typography variant="caption" weight="600" color={filter === f ? '#FFF' : (isDark ? COLORS.darkTextSecondary : COLORS.textSecondary)}>{f}</Typography>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filteredDocs.length === 0 ? (
          <EmptyState 
            icon={FileText} 
            title="Tidak ditemukan" 
            description="Tidak ada dokumen yang cocok dengan pencarian." 
          />
        ) : (
          filteredDocs.map(doc => (
            <ListItem
              key={doc.id}
              icon={FileText}
              title={doc.title}
              subtitle={\`\${doc.type} • \${doc.size} • \${doc.date}\`}
              onPress={() => router.push(\`/library/doc/\${doc.id}\` as any)}
              onAction={() => {}}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { padding: SPACING.lg },
  searchContainer: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  searchInput: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, height: 48, borderRadius: 24, borderWidth: 1 },
  input: { flex: 1, marginLeft: SPACING.sm, fontSize: 15 },
  filters: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: 6, borderRadius: 16, marginRight: SPACING.sm },
  chipActive: { backgroundColor: COLORS.primary },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: 100 }
});
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Setup 2 complete');
