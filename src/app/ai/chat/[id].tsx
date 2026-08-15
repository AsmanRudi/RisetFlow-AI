import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useAIChatStore } from '@/store/useAIChatStore';
import { AIChatState } from '@/features/ai/components/AIChatState';
import { AIComposer } from '@/features/ai/components/AIComposer';
import { aiService } from '@/services/ai/GeminiAIService';
import { ArrowLeft, Settings } from 'lucide-react-native';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const sessions = useAIChatStore(state => state.sessions);
  const addMessage = useAIChatStore(state => state.addMessage);
  const deleteSession = useAIChatStore(state => state.deleteSession);
  
  const session = sessions.find(s => s.id === id);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session && sessions.length > 0) {
      // If session not found, go back
      if (router.canGoBack()) router.back();
      else router.replace('/');
    }
  }, [session, sessions.length, router]);

  if (!session) return null;

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setInput('');
    // eslint-disable-next-line react-hooks/purity
    const userMessageId = Date.now().toString();
    addMessage(session.id, { id: userMessageId, role: 'user', content: text });
    
    setIsLoading(true);
    
    try {
      const activeDocumentId = useAppStore.getState().activeDocumentId;
      const response = await aiService.chat(text, session.mode, session.messages, activeDocumentId);
      
      addMessage(session.id, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response.content,
        sources: response.sources
      });
    } catch (error: any) {
      addMessage(session.id, { 
        // eslint-disable-next-line react-hooks/purity
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: error.message || 'Terjadi kesalahan saat memproses permintaan.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <View style={[styles.header, { borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
            <ArrowLeft size={24} color={isDark ? COLORS.darkText : COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Typography variant="h3" weight="bold">{session.title}</Typography>
            <Typography variant="caption" color={COLORS.primary}>Mode {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)}</Typography>
          </View>
          <TouchableOpacity style={styles.iconBtn} onPress={() => {
            Alert.alert(
              'Hapus Chat',
              'Anda ingin menghapus seluruh riwayat chat ini?',
              [
                { text: 'Batal', style: 'cancel' },
                { text: 'Hapus', style: 'destructive', onPress: () => {
                  deleteSession(id as string);
                  router.back();
                }}
              ]
            );
          }}>
            <Settings size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <AIChatState messages={session.messages} isLoading={isLoading} />

        <AIComposer 
          value={input}
          onChangeText={setInput}
          onSend={() => handleSend(input)}
          isLoading={isLoading}
          activeMode={session.mode}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  iconBtn: {
    padding: SPACING.xs,
  }
});
