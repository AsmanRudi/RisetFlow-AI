import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { Copy, RefreshCw, Bookmark, Share2 } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';

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

  const scrollViewRef = React.useRef<ScrollView>(null);

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container} 
      contentContainerStyle={styles.content}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
    >
      {messages.map(msg => (
        <View key={msg.id} style={[styles.bubbleWrapper, msg.role === 'user' ? styles.userWrapper : styles.aiWrapper]}>
          {msg.role === 'assistant' && (
            <Typography variant="caption" weight="bold" color={COLORS.primary} style={{ marginBottom: SPACING.xs }}>✨ RisetFlow AI</Typography>
          )}
          
          <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : [styles.aiBubble, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }]]}>
            {msg.role === 'user' ? (
              <Typography color="#FFF" style={{ lineHeight: 22 }}>
                {msg.content}
              </Typography>
            ) : (
              <Markdown 
                style={{
                  body: { color: COLORS.text, fontSize: 16, lineHeight: 24 },
                  heading1: { color: COLORS.text, marginTop: 10, marginBottom: 5 },
                  heading2: { color: COLORS.text, marginTop: 10, marginBottom: 5 },
                  heading3: { color: COLORS.text, marginTop: 10, marginBottom: 5 },
                  paragraph: { marginTop: 5, marginBottom: 5 },
                  list_item: { marginTop: 3, marginBottom: 3 },
                  strong: { fontWeight: 'bold', color: COLORS.text }
                }}
              >
                {msg.content}
              </Markdown>
            )}
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
              <TouchableOpacity style={styles.actionBtn} onPress={async () => {
                await Clipboard.setStringAsync(msg.content);
                alert('Teks berhasil disalin!');
              }}>
                <Copy size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
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
