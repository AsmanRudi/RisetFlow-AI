import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useLibraryStore } from '@/store/useLibraryStore';
import Markdown from 'react-native-markdown-display';
import { CheckCircle2, Circle } from 'lucide-react-native';

const TOOL_CONFIG: Record<string, any> = {
  'document-assistant': {
    title: 'Document Assistant',
    needsDoc: true,
    hasInput: true,
    inputLabel: 'Pertanyaan',
    inputKey: 'question',
    endpoint: '/api/work/document-assistant',
    resultKey: 'answer'
  },
  'report-summary': {
    title: 'Executive Summary',
    needsDoc: true,
    hasInput: false,
    endpoint: '/api/work/report-summary',
    resultKey: 'summary'
  },
  'knowledge-search': {
    title: 'Knowledge Search',
    needsDoc: false,
    hasInput: true,
    inputLabel: 'Kata Kunci Pencarian',
    inputKey: 'query',
    endpoint: '/api/work/knowledge-search',
    resultKey: 'documentResults' // it returns documentResults and noteResults
  }
};

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export default function WorkToolScreen() {
  const { tool } = useLocalSearchParams<{ tool: string }>();
  const router = useRouter();
  const isDark = useAppStore(state => state.theme) === 'dark';
  
  const documents = useLibraryStore(state => state.documents);
  const fetchDocuments = useLibraryStore(state => state.fetchDocuments);
  
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (documents.length === 0) fetchDocuments();
  }, []);

  const config = TOOL_CONFIG[tool as string];

  if (!config) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
        <Header title="Tool Tidak Ditemukan" />
      </SafeAreaView>
    );
  }

  const toggleDoc = (id: string) => {
    setSelectedDocs([id]); // single doc for work tools usually
  };

  const handleGenerate = async () => {
    if (config.needsDoc && selectedDocs.length === 0) {
      alert('Pilih satu dokumen kerja.');
      return;
    }
    
    if (config.hasInput && !inputText.trim()) {
      alert('Input wajib diisi.');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const payload: any = {};
      if (config.needsDoc) {
        payload.documentId = selectedDocs[0];
      }
      
      if (config.hasInput) {
        payload[config.inputKey] = inputText;
      }
      
      const res = await fetch(`${BACKEND_URL}${config.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');
      
      if (tool === 'knowledge-search') {
        setResult(data);
      } else {
        let outputText = data[config.resultKey];
        if (typeof outputText === 'string' && (outputText.trim().startsWith('{') || outputText.trim().startsWith('['))) {
          try {
            const parsed = JSON.parse(outputText);
            outputText = "```json\n" + JSON.stringify(parsed, null, 2) + "\n```";
          } catch(e) {}
        }
        setResult(outputText);
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderKnowledgeSearchResult = () => {
    if (!result) return null;
    const { documentResults = [], noteResults = [] } = result;

    return (
      <View>
        <Typography variant="h3" weight="bold" style={{ marginBottom: SPACING.md }}>Hasil Pencarian Dokumen</Typography>
        {documentResults.length === 0 ? (
          <Typography color={COLORS.textSecondary}>Tidak ada dokumen yang relevan.</Typography>
        ) : (
          documentResults.map((r: any, idx: number) => (
            <View key={idx} style={[styles.resultCard, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border, marginBottom: SPACING.sm }]}>
              <Typography weight="bold">{r.documentTitle}</Typography>
              <Typography variant="caption" color={COLORS.textSecondary}>Skor Relevansi: {Math.round(r.score * 100)}%</Typography>
              <Typography style={{ marginTop: SPACING.xs }}>"{r.content}"</Typography>
            </View>
          ))
        )}

        <Typography variant="h3" weight="bold" style={{ marginTop: SPACING.lg, marginBottom: SPACING.md }}>Hasil Pencarian Catatan</Typography>
        {noteResults.length === 0 ? (
          <Typography color={COLORS.textSecondary}>Tidak ada catatan yang relevan.</Typography>
        ) : (
          noteResults.map((r: any, idx: number) => (
            <View key={idx} style={[styles.resultCard, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border, marginBottom: SPACING.sm }]}>
              <Typography weight="bold">{r.title}</Typography>
              <Typography style={{ marginTop: SPACING.xs }}>{r.content}</Typography>
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title={config.title} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {!result && (
          <>
            {config.needsDoc && (
              <>
                <Typography variant="h3" weight="bold" style={styles.sectionTitle}>Pilih Dokumen</Typography>
                <Typography variant="caption" color={COLORS.textSecondary} style={{ marginBottom: SPACING.md }}>
                  Pilih satu dokumen untuk dianalisis.
                </Typography>
                
                {documents.filter(d => d.status === 'Ready').length === 0 ? (
                  <View style={styles.emptyState}>
                    <Typography color={COLORS.textSecondary}>Tidak ada dokumen yang siap di perpustakaan.</Typography>
                  </View>
                ) : (
                  documents.filter(d => d.status === 'Ready').map(doc => (
                    <TouchableOpacity 
                      key={doc.id} 
                      style={[styles.docCard, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}
                      onPress={() => toggleDoc(doc.id)}
                    >
                      <View style={{ flex: 1 }}>
                        <Typography weight="600">{doc.title}</Typography>
                        <Typography variant="caption" color={COLORS.textSecondary}>{doc.fileName}</Typography>
                      </View>
                      {selectedDocs.includes(doc.id) ? (
                        <CheckCircle2 color={COLORS.primary} size={24} />
                      ) : (
                        <Circle color={COLORS.textSecondary} size={24} />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </>
            )}
            
            {config.hasInput && (
              <View style={[styles.inputSection, !config.needsDoc && { marginTop: 0 }]}>
                <Typography variant="body" weight="bold" style={{ marginBottom: SPACING.sm }}>{config.inputLabel}</Typography>
                <TextInput
                  style={[styles.input, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, color: isDark ? COLORS.darkText : COLORS.text, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Ketik di sini..."
                  placeholderTextColor={COLORS.textSecondary}
                  multiline={config.inputKey === 'question'}
                />
              </View>
            )}
            
            <Button 
              title={isLoading ? "Memproses AI..." : (tool === 'knowledge-search' ? 'Cari' : "Generate")} 
              onPress={handleGenerate} 
              disabled={isLoading || (config.needsDoc && selectedDocs.length === 0) || (config.hasInput && !inputText.trim())}
              style={{ marginTop: SPACING.lg }}
            />
          </>
        )}
        
        {isLoading && !result && (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Typography style={{ marginTop: SPACING.md }}>AI sedang memproses permintaan Anda...</Typography>
          </View>
        )}
        
        {result && (
          <View style={styles.resultContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
              <Typography variant="h3" weight="bold">Hasil AI</Typography>
              <Button title="Ulangi" variant="outline" onPress={() => setResult(null)} />
            </View>
            
            {tool === 'knowledge-search' ? (
              renderKnowledgeSearchResult()
            ) : (
              <View style={[styles.resultCard, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
                <Markdown style={{
                    body: { color: isDark ? COLORS.darkText : COLORS.text, fontSize: 16, lineHeight: 24 },
                    heading1: { color: isDark ? COLORS.darkText : COLORS.text, marginTop: 10, marginBottom: 5 },
                    heading2: { color: isDark ? COLORS.darkText : COLORS.text, marginTop: 10, marginBottom: 5 },
                    heading3: { color: isDark ? COLORS.darkText : COLORS.text, marginTop: 10, marginBottom: 5 },
                  }}>
                  {result}
                </Markdown>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg },
  sectionTitle: { marginBottom: SPACING.xs },
  emptyState: { padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: COLORS.border, borderRadius: 12 },
  docCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: 12, borderWidth: 1, marginBottom: SPACING.sm },
  inputSection: { marginTop: SPACING.lg },
  input: { borderWidth: 1, borderRadius: 12, padding: SPACING.md, fontSize: 16, minHeight: 48 },
  loadingState: { alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.xxl },
  resultContainer: { marginTop: SPACING.sm },
  resultCard: { padding: SPACING.md, borderRadius: 12, borderWidth: 1 }
});
