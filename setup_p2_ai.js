const fs = require('fs');
const path = require('path');

const files = {
  'src/services/ai/MockAIService.ts': `export interface AIServiceResponse {
  content: string;
  sources?: { title: string; type: string }[];
}

export class MockAIService {
  async chat(message: string, mode: 'belajar' | 'riset' | 'kerja'): Promise<AIServiceResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let content = '';
        let sources = undefined;

        if (mode === 'belajar') {
          content = \`Tentu, saya akan bantu jelaskan materi ini.\\n\\n**Konsep Dasar**\\nIni adalah konsep penting dalam pembelajaran. Jika kita menganalogikannya...\\n\\nApakah kamu ingin saya buatkan **quiz singkat** untuk menguji pemahamanmu?\`;
        } else if (mode === 'riset') {
          content = \`Berdasarkan paper yang Anda sertakan:\\n\\n**Tujuan Penelitian:** Mengukur efektivitas AI.\\n**Metode:** Eksperimen kuantitatif.\\n**Potensi Research Gap:** Belum banyak studi pada sampel pelajar sekolah dasar di area rural.\`;
          sources = [{ title: 'AI in Education.pdf', type: 'paper' }];
        } else {
          content = \`Berikut ringkasan meeting/tugas:\\n\\n- **Keputusan 1:** Revisi UI hari ini.\\n- **Action Item:** Menyusun laporan mingguan.\\n\\nAda dokumen lain yang perlu saya ekstrak task-nya?\`;
        }

        resolve({ content, sources });
      }, 1500); // Simulate network delay
    });
  }
}

export const aiService = new MockAIService();
`,
  'src/features/ai/components/AIHeader.tsx': `import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles, Clock, MoreVertical } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';

export const AIHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleArea}>
        <Sparkles size={20} color={COLORS.primary} />
        <View style={{ marginLeft: SPACING.sm }}>
          <Typography variant="body" weight="bold">✨ Asisten AI</Typography>
          <Typography variant="caption" color={COLORS.textSecondary}>Teman cerdas untuk riset & kerjamu.</Typography>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn}><Clock size={20} color={COLORS.textSecondary} /></TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}><MoreVertical size={20} color={COLORS.textSecondary} /></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  titleArea: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: SPACING.xs, marginLeft: SPACING.xs }
});
`,
  'src/features/ai/components/AIComposer.tsx': `import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Paperclip, Mic, Send } from 'lucide-react-native';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface AIComposerProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
  activeMode: 'belajar' | 'riset' | 'kerja';
}

export const AIComposer: React.FC<AIComposerProps> = ({ value, onChangeText, onSend, isLoading, activeMode }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const getContextLabel = () => {
    switch(activeMode) {
      case 'belajar': return '📚 Mode Belajar';
      case 'riset': return '🔬 Mode Riset';
      case 'kerja': return '💼 Mode Kerja';
      default: return '';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderTopColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
      <View style={[styles.contextPill, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
        <Typography variant="caption" weight="600" color={COLORS.primary}>{getContextLabel()}</Typography>
      </View>
      
      <View style={[styles.inputWrapper, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
        <TextInput
          placeholder="Tanya apa saja..."
          placeholderTextColor={isDark ? COLORS.darkTextSecondary : COLORS.textSecondary}
          style={[styles.input, { color: isDark ? COLORS.darkText : COLORS.text }]}
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={500}
        />
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn}><Paperclip size={20} color={COLORS.textSecondary} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Mic size={20} color={COLORS.textSecondary} /></TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sendBtn, (!value.trim() || isLoading) && styles.sendBtnDisabled]} 
            onPress={onSend}
            disabled={!value.trim() || isLoading}
          >
            <Send size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: SPACING.md, borderTopWidth: 1 },
  contextPill: { alignSelf: 'flex-start', paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: 12, marginBottom: SPACING.sm },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, paddingLeft: SPACING.md, paddingRight: SPACING.xs, paddingVertical: SPACING.xs, minHeight: 48 },
  input: { flex: 1, maxHeight: 100, fontSize: 15, paddingVertical: 8 },
  actions: { flexDirection: 'row', alignItems: 'center', paddingBottom: 2 },
  iconBtn: { padding: SPACING.xs, marginHorizontal: 2 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginLeft: SPACING.xs },
  sendBtnDisabled: { opacity: 0.5 }
});
`,
  'src/features/ai/components/AISuggestedPrompts.tsx': `import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface Props {
  activeMode: 'belajar' | 'riset' | 'kerja';
  onSelectPrompt: (prompt: string) => void;
}

export const AISuggestedPrompts: React.FC<Props> = ({ activeMode, onSelectPrompt }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const prompts = {
    belajar: ['📚 Jelaskan materi ini', '🧠 Buat quiz', '📝 Buat flashcard', '📅 Buat study plan'],
    riset: ['🔬 Ringkas paper ini', '⚖️ Bandingkan penelitian', '📊 Buat research matrix', '🎯 Temukan research gap'],
    kerja: ['💼 Ringkas meeting', '✅ Buat action items', '📋 Pecah project jadi task', '📄 Ringkas dokumen']
  };

  return (
    <View style={styles.container}>
      <Typography variant="caption" weight="600" color={COLORS.textSecondary} style={{ marginBottom: SPACING.sm, paddingHorizontal: SPACING.lg }}>Mulai dari sini</Typography>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {prompts[activeMode].map((prompt, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}
            onPress={() => onSelectPrompt(prompt.split(' ').slice(1).join(' '))}
          >
            <Typography variant="caption" weight="600">{prompt}</Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  scroll: { paddingHorizontal: SPACING.lg },
  card: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20, borderWidth: 1, marginRight: SPACING.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }
});
`,
  'src/features/ai/components/AIWelcomeState.tsx': `import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Skeleton } from '@/components/ui/Skeleton';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { AISuggestedPrompts } from './AISuggestedPrompts';

interface Props {
  activeMode: 'belajar' | 'riset' | 'kerja';
  setActiveMode: (m: 'belajar' | 'riset' | 'kerja') => void;
  onSendPrompt: (prompt: string) => void;
}

export const AIWelcomeState: React.FC<Props> = ({ activeMode, setActiveMode, onSendPrompt }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoadingHistory(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Typography style={{ fontSize: 40, marginBottom: SPACING.sm }}>✨</Typography>
        <Typography variant="h1" weight="bold" style={{ marginBottom: SPACING.xs }}>Bagaimana saya bisa membantumu?</Typography>
        <Typography variant="body" color={COLORS.textSecondary}>Saya bisa membantu kamu belajar, meneliti, memahami dokumen, dan menyelesaikan pekerjaan.</Typography>
      </View>

      <View style={styles.modeSelector}>
        {(['belajar', 'riset', 'kerja'] as const).map(m => (
          <TouchableOpacity 
            key={m} 
            style={[
              styles.modePill, 
              { backgroundColor: activeMode === m ? COLORS.primary : (isDark ? COLORS.darkSurface : COLORS.surface) }
            ]}
            onPress={() => setActiveMode(m)}
          >
            <Typography variant="caption" weight="600" color={activeMode === m ? '#FFF' : COLORS.text}>
              {m === 'belajar' ? '📚 Belajar' : m === 'riset' ? '🔬 Riset' : '💼 Kerja'}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      <AISuggestedPrompts activeMode={activeMode} onSelectPrompt={onSendPrompt} />

      <View style={styles.historySection}>
        <Typography variant="body" weight="bold" style={{ marginBottom: SPACING.md }}>Percakapan Terbaru</Typography>
        {loadingHistory ? (
           [1, 2].map(i => <Skeleton key={i} width="100%" height={40} style={{ marginBottom: SPACING.sm }} />)
        ) : (
          <>
            <TouchableOpacity style={styles.historyItem}>
              <Typography variant="body">🔬 Analisis paper AI Pendidikan</Typography>
            </TouchableOpacity>
            <TouchableOpacity style={styles.historyItem}>
              <Typography variant="body">💼 Ringkasan Meeting Client</Typography>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { padding: SPACING.xl, alignItems: 'center' },
  modeSelector: { flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xl, paddingHorizontal: SPACING.lg },
  modePill: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20, marginHorizontal: SPACING.xs, elevation: 1 },
  historySection: { paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },
  historyItem: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border }
});
`,
  'src/features/ai/components/AIChatState.tsx': `import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { Copy, RefreshCw, Bookmark, Share2 } from 'lucide-react-native';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; type: string }[];
}

interface Props {
  messages: Message[];
  isLoading: boolean;
}

export const AIChatState: React.FC<Props> = ({ messages, isLoading }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {messages.map(msg => (
        <View key={msg.id} style={[styles.bubbleWrapper, msg.role === 'user' ? styles.userWrapper : styles.aiWrapper]}>
          {msg.role === 'assistant' && (
            <Typography variant="caption" weight="bold" color={COLORS.primary} style={{ marginBottom: SPACING.xs }}>✨ RisetFlow AI</Typography>
          )}
          
          <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : [styles.aiBubble, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]]}>
            <Typography color={msg.role === 'user' ? '#FFF' : COLORS.text} style={{ lineHeight: 22 }}>
              {msg.content}
            </Typography>
          </View>

          {msg.sources && msg.sources.length > 0 && (
            <View style={[styles.sourceCard, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
              <Typography variant="caption" weight="600" color={COLORS.textSecondary}>📄 Sumber</Typography>
              {msg.sources.map((s, idx) => (
                <Typography key={idx} variant="caption" style={{ marginTop: 2 }}>• {s.title}</Typography>
              ))}
            </View>
          )}

          {msg.role === 'assistant' && (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn}><Copy size={16} color={COLORS.textSecondary} /></TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}><Bookmark size={16} color={COLORS.textSecondary} /></TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}><RefreshCw size={16} color={COLORS.textSecondary} /></TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}><Share2 size={16} color={COLORS.textSecondary} /></TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      {isLoading && (
        <View style={[styles.bubbleWrapper, styles.aiWrapper]}>
           <Typography variant="caption" weight="bold" color={COLORS.primary} style={{ marginBottom: SPACING.xs }}>✨ RisetFlow AI</Typography>
           <View style={[styles.bubble, styles.aiBubble, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
              <Typography color={COLORS.textSecondary}>Mengetik...</Typography>
           </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.md },
  bubbleWrapper: { marginBottom: SPACING.lg, maxWidth: '90%' },
  userWrapper: { alignSelf: 'flex-end' },
  aiWrapper: { alignSelf: 'flex-start' },
  bubble: { padding: SPACING.md, borderRadius: 16 },
  userBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  aiBubble: { borderBottomLeftRadius: 4, borderWidth: 1, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  sourceCard: { marginTop: SPACING.sm, padding: SPACING.sm, borderRadius: 8, borderWidth: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm },
  actionBtn: { marginRight: SPACING.md, padding: SPACING.xs }
});
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Phase 2 AI components setup complete!');
