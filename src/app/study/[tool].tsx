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
  'explain': {
    title: 'Jelaskan Materi',
    multiDoc: false,
    hasInput: true,
    inputLabel: 'Topik Spesifik (Opsional)',
    inputKey: 'topic',
    endpoint: '/api/study/explain',
    resultKey: 'explanation'
  },
  'summary': {
    title: 'Ringkasan Cepat',
    multiDoc: false,
    hasInput: false,
    endpoint: '/api/study/summary',
    resultKey: 'summary'
  },
  'quiz': {
    title: 'Latihan Quiz',
    multiDoc: false,
    hasInput: true,
    inputLabel: 'Jumlah Soal (Opsional, Default 5)',
    inputKey: 'count',
    endpoint: '/api/study/quiz',
    resultKey: 'quiz'
  },
  'flashcards': {
    title: 'Flashcards',
    multiDoc: false,
    hasInput: true,
    inputLabel: 'Jumlah Flashcard (Opsional, Default 10)',
    inputKey: 'count',
    endpoint: '/api/study/flashcards',
    resultKey: 'flashcards'
  },
  'plan': {
    title: 'Study Plan',
    multiDoc: false,
    hasInput: true,
    inputLabel: 'Waktu Tersedia (misal: 7 hari)',
    inputKey: 'daysAvailable',
    endpoint: '/api/study/plan',
    resultKey: 'plan'
  },
  'practice': {
    title: 'Latihan Soal Esai',
    multiDoc: false,
    hasInput: true,
    inputLabel: 'Fokus Topik (Opsional)',
    inputKey: 'topic',
    endpoint: '/api/study/practice',
    resultKey: 'questions'
  }
};

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export default function StudyToolScreen() {
  const { tool } = useLocalSearchParams<{ tool: string }>();
  const router = useRouter();
  const isDark = useAppStore(state => state.theme) === 'dark';
  
  const documents = useLibraryStore(state => state.documents);
  const fetchDocuments = useLibraryStore(state => state.fetchDocuments);
  
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
    if (!config.multiDoc) {
      setSelectedDocs([id]);
    } else {
      setSelectedDocs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
    }
  };

  const handleGenerate = async () => {
    if (selectedDocs.length === 0) {
      alert('Pilih setidaknya satu dokumen materi.');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const payload: any = {};
      if (config.multiDoc) {
        payload.documentIds = selectedDocs;
      } else {
        payload.documentId = selectedDocs[0];
      }
      
      if (config.hasInput && inputText) {
        if (config.inputKey === 'count' || config.inputKey === 'daysAvailable') {
          payload[config.inputKey] = parseInt(inputText) || undefined;
        } else {
          payload[config.inputKey] = inputText;
        }
      }
      
      const res = await fetch(`${BACKEND_URL}${config.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');
      
      let outputText = data[config.resultKey];
      
      if (typeof outputText === 'string' && (outputText.trim().startsWith('{') || outputText.trim().startsWith('['))) {
        try {
          const parsed = JSON.parse(outputText);
          outputText = "```json\n" + JSON.stringify(parsed, null, 2) + "\n```";
        } catch(e) {}
      }
      
      setResult(outputText);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title={config.title} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {!result && (
          <>
            <Typography variant="h3" weight="bold" style={styles.sectionTitle}>Bahan Materi</Typography>
            <Typography variant="caption" color={COLORS.textSecondary} style={{ marginBottom: SPACING.md }}>
              Pilih dokumen sebagai sumber materi.
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
            
            {config.hasInput && (
              <View style={styles.inputSection}>
                <Typography variant="body" weight="bold" style={{ marginBottom: SPACING.sm }}>{config.inputLabel}</Typography>
                <TextInput
                  style={[styles.input, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, color: isDark ? COLORS.darkText : COLORS.text, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Ketik di sini..."
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType={(config.inputKey === 'count' || config.inputKey === 'daysAvailable') ? 'numeric' : 'default'}
                />
              </View>
            )}
            
            <Button 
              title={isLoading ? "Memproses AI..." : "Generate"} 
              onPress={handleGenerate} 
              disabled={isLoading || selectedDocs.length === 0}
              style={{ marginTop: SPACING.lg }}
            />
          </>
        )}
        
        {isLoading && !result && (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Typography style={{ marginTop: SPACING.md }}>AI sedang memproses materi Anda...</Typography>
          </View>
        )}
        
        {result && (
          <View style={styles.resultContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
              <Typography variant="h3" weight="bold">Hasil AI</Typography>
              <Button title="Ulangi" variant="outline" onPress={() => setResult(null)} />
            </View>
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
  input: { borderWidth: 1, borderRadius: 12, padding: SPACING.md, fontSize: 16 },
  loadingState: { alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.xxl },
  resultContainer: { marginTop: SPACING.sm },
  resultCard: { padding: SPACING.md, borderRadius: 12, borderWidth: 1 }
});
