import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, FileText, Sparkles, Trash2, Calendar, FileType, CheckCircle, Clock, AlertTriangle } from 'lucide-react-native';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { DocumentModel, useLibraryStore } from '@/store/useLibraryStore';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export default function DocumentDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const setActiveDocumentId = useAppStore(state => state.setActiveDocumentId);
  const deleteDocument = useLibraryStore(state => state.deleteDocument);
  const isDark = theme === 'dark';

  const [doc, setDoc] = useState<DocumentModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/documents/${id}`)
      .then(res => {
        if(res.ok) return res.json();
        throw new Error('Not found');
      })
      .then(data => {
        setDoc(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [id]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const askAI = () => {
    if (doc?.status === 'Ready') {
      setActiveDocumentId(doc.id);
      router.push('/(tabs)/ai');
    } else {
      alert('Dokumen belum selesai diproses.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!doc) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn}>
            <ArrowLeft color={isDark ? COLORS.darkText : COLORS.text} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.notFound}>
          <Typography variant="h3">Dokumen tidak ditemukan</Typography>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = () => {
    switch(doc.status) {
      case 'Ready': return COLORS.success;
      case 'Processing': return COLORS.warning;
      case 'Failed': return COLORS.danger;
      default: return COLORS.primary;
    }
  };

  const getStatusIcon = () => {
    switch(doc.status) {
      case 'Ready': return <CheckCircle size={16} color={COLORS.success} />;
      case 'Processing': return <Clock size={16} color={COLORS.warning} />;
      case 'Failed': return <AlertTriangle size={16} color={COLORS.danger} />;
      default: return <Clock size={16} color={COLORS.primary} />;
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn}>
          <ArrowLeft color={isDark ? COLORS.darkText : COLORS.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.docHeader}>
          <View style={[styles.iconBox, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
            <FileText size={48} color={COLORS.primary} />
          </View>
          <Typography variant="h2" weight="bold" style={styles.title}>{doc.title}</Typography>
        </View>

        <View style={[styles.metadataCard, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
          <View style={styles.metaRow}>
            <FileType size={18} color={COLORS.textSecondary} />
            <Typography style={styles.metaText} color={COLORS.textSecondary}>{doc.fileName}</Typography>
          </View>
          <View style={styles.metaRow}>
            <Calendar size={18} color={COLORS.textSecondary} />
            <Typography style={styles.metaText} color={COLORS.textSecondary}>{new Date(doc.createdAt).toLocaleDateString()}</Typography>
          </View>
          <View style={styles.metaRow}>
            <Typography style={styles.metaText} color={COLORS.textSecondary}>Ukuran: {formatSize(doc.fileSize)}</Typography>
          </View>
          <View style={styles.metaRow}>
            {getStatusIcon()}
            <Typography style={[styles.metaText, { color: getStatusColor(), fontWeight: 'bold' }]}>Status: {doc.status}</Typography>
          </View>
        </View>

        <View style={styles.actions}>
          <Button 
            title="Tanya AI" 
            icon={<Sparkles color="#FFF" size={20} />} 
            onPress={askAI}
            style={styles.actionBtn}
            disabled={doc.status !== 'Ready'}
          />
          <Button 
            title="Hapus" 
            variant="outline"
            icon={<Trash2 color={COLORS.danger} size={20} />} 
            onPress={() => {
              const doDelete = async () => {
                await deleteDocument(doc.id);
                alert('Dokumen berhasil dihapus.');
                if (router.canGoBack()) router.back();
                else router.replace('/');
              };
              if (Platform.OS === 'web') {
                if (confirm('Yakin ingin menghapus dokumen ini?')) doDelete();
              } else {
                Alert.alert('Konfirmasi', 'Yakin ingin menghapus dokumen ini?', [
                  { text: 'Batal', style: 'cancel' },
                  { text: 'Hapus', style: 'destructive', onPress: doDelete }
                ]);
              }
            }}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md },
  backBtn: { padding: SPACING.xs },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: SPACING.lg },
  docHeader: { alignItems: 'center', marginBottom: SPACING.xl },
  iconBox: { width: 96, height: 96, borderRadius: 24, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  title: { textAlign: 'center', marginBottom: SPACING.sm },
  metadataCard: { padding: SPACING.lg, borderRadius: 16, borderWidth: 1, marginBottom: SPACING.xl },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  metaText: { marginLeft: SPACING.md },
  actions: { gap: SPACING.md },
  actionBtn: { width: '100%' }
});
