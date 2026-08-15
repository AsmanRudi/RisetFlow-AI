import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TextInput , TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { ListItem } from '@/components/ui/ListItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, FileText, ArrowLeft } from 'lucide-react-native';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import { useRouter } from 'expo-router';

export default function LibraryTab() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const { documents, fetchDocuments, deleteDocument } = useLibraryStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocs = documents.filter(doc => {
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'Uploading': return 'Sedang mengunggah...';
      case 'Processing': return 'Memproses teks...';
      case 'Ready': return '✓ Siap dianalisis';
      case 'Failed': return '❌ Gagal diproses';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <TouchableOpacity onPress={() => router.push('/(tabs)')} style={{ marginRight: SPACING.md }}>
            <ArrowLeft size={24} color={isDark ? COLORS.darkText : COLORS.text} />
          </TouchableOpacity>
          <Typography variant="h2" weight="bold">Perpustakaan</Typography>
        </View>
        <Typography variant="body" color={COLORS.textSecondary}>Koleksi PDF dan pengetahuan Anda.</Typography>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInput, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput 
            placeholder="Cari dokumen PDF..." 
            placeholderTextColor={COLORS.textSecondary}
            style={[styles.input, { color: isDark ? COLORS.darkText : COLORS.text }]}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filteredDocs.length === 0 ? (
          <EmptyState 
            icon={FileText} 
            title="Belum ada dokumen" 
            description="Gunakan tombol + untuk mengunggah PDF." 
          />
        ) : (
          filteredDocs.map(doc => (
            <ListItem
              key={doc.id}
              icon={FileText}
              title={doc.title}
              subtitle={`PDF • ${formatSize(doc.fileSize)} • ${getStatusDisplay(doc.status)}`}
              onPress={() => router.push(`/library/doc/${doc.id}` as any)}
              onAction={async () => {
                if (confirm('Yakin ingin menghapus dokumen ini?')) {
                  await deleteDocument(doc.id);
                }
              }}
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
  input: { flex: 1, marginLeft: SPACING.sm, fontSize: 15, ...({ outlineStyle: 'none' } as any) },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: 100 }
});
