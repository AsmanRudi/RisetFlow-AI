const fs = require('fs');
const path = require('path');

const files = {
  'src/app/(tabs)/ai.tsx': `import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { AIHeader } from '@/features/ai/components/AIHeader';
import { AIWelcomeState } from '@/features/ai/components/AIWelcomeState';
import { AIChatState, Message } from '@/features/ai/components/AIChatState';
import { AIComposer } from '@/features/ai/components/AIComposer';
import { aiService } from '@/services/ai/MockAIService';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function AITab() {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const [appState, setAppState] = useState<'WELCOME' | 'CHAT'>('WELCOME');
  const [activeMode, setActiveMode] = useState<'belajar' | 'riset' | 'kerja'>('belajar');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    if (appState === 'WELCOME') setAppState('CHAT');
    
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text }]);
    setIsLoading(true);
    
    const response = await aiService.chat(text, activeMode);
    
    setMessages(prev => [...prev, { 
      id: (Date.now() + 1).toString(), 
      role: 'assistant', 
      content: response.content,
      sources: response.sources
    }]);
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <AIHeader />
        
        {appState === 'WELCOME' ? (
          <AIWelcomeState 
            activeMode={activeMode} 
            setActiveMode={setActiveMode} 
            onSendPrompt={handleSend} 
          />
        ) : (
          <AIChatState messages={messages} isLoading={isLoading} />
        )}

        <AIComposer 
          value={input}
          onChangeText={setInput}
          onSend={() => handleSend(input)}
          isLoading={isLoading}
          activeMode={activeMode}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 }
});
`,
  'src/app/(tabs)/_layout.tsx': `import React from 'react';
import { Tabs, usePathname } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, FolderKanban, Sparkles, Library, User, Edit3, CheckSquare, Upload, FileText } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { FAB, FABAction } from '@/components/ui/FAB';

export default function TabsLayout() {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const pathname = usePathname();

  // Context-aware FAB Actions
  const getFABActions = (): FABAction[] | null => {
    const iconColor = COLORS.primary;
    if (pathname === '/' || pathname === '/(tabs)') {
      return [
        { id: '1', label: 'Tanya AI', icon: <Sparkles size={20} color={iconColor} />, onPress: () => {} },
        { id: '2', label: 'Buat Catatan', icon: <Edit3 size={20} color={iconColor} />, onPress: () => {} },
        { id: '3', label: 'Buat Tugas', icon: <CheckSquare size={20} color={iconColor} />, onPress: () => {} },
        { id: '4', label: 'Upload PDF', icon: <Upload size={20} color={iconColor} />, onPress: () => {} },
      ];
    }
    if (pathname === '/workspace') {
      return [
        { id: '1', label: 'Buat Project', icon: <FolderKanban size={20} color={iconColor} />, onPress: () => {} },
        { id: '2', label: 'Buat Task', icon: <CheckSquare size={20} color={iconColor} />, onPress: () => {} },
        { id: '3', label: 'Buat Catatan', icon: <Edit3 size={20} color={iconColor} />, onPress: () => {} },
      ];
    }
    if (pathname === '/library') {
      return [
        { id: '1', label: 'Upload Dokumen', icon: <Upload size={20} color={iconColor} />, onPress: () => {} },
        { id: '2', label: 'Buat Catatan', icon: <Edit3 size={20} color={iconColor} />, onPress: () => {} },
        { id: '3', label: 'Tambah Paper', icon: <FileText size={20} color={iconColor} />, onPress: () => {} },
      ];
    }
    return null; // No FAB for AI or Profile tabs
  };

  const fabActions = getFABActions();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface,
            borderTopColor: isDark ? COLORS.darkBorder : COLORS.border,
            elevation: 10,
            height: Platform.OS === 'ios' ? 85 : 70, // Extra padding for safe area
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
            paddingTop: 10
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
            fontWeight: '600'
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: isDark ? COLORS.darkTextSecondary : COLORS.textSecondary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="workspace"
          options={{
            title: 'Ruang Kerja',
            tabBarIcon: ({ color, size }) => <FolderKanban color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="ai"
          options={{
            title: 'AI', // Shorter title to prevent cutoff
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.aiTabIcon, { backgroundColor: focused ? COLORS.primary : COLORS.primaryLight + '20' }]}>
                <Sparkles color={focused ? '#FFF' : COLORS.primary} size={24} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size }) => <Library color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
      {fabActions && <FAB actions={fabActions} />}
    </>
  );
}

const styles = StyleSheet.create({
  aiTabIcon: {
    padding: 12,
    borderRadius: 24,
    marginBottom: 6,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  }
});
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Phase 2 assembly complete!');
