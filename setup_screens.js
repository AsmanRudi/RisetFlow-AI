const fs = require('fs');
const path = require('path');

const files = {
  'src/app/(tabs)/workspace.tsx': `import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { SPACING, COLORS } from '@/constants/theme';
import { FileText, CheckCircle2, Upload } from 'lucide-react-native';

export default function WorkspaceTab() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Typography variant="h1" style={styles.header}>Ruang Kerja</Typography>
        <Typography variant="subtitle" style={styles.subtitle}>Kelola catatan, dokumen, dan tugas Anda.</Typography>
        
        <View style={styles.grid}>
          <Card style={styles.gridCard}>
            <View style={styles.iconCircle}><FileText size={24} color={COLORS.primary} /></View>
            <Typography variant="h3" style={{marginTop: SPACING.md}}>Catatan</Typography>
            <Typography variant="caption">3 baru</Typography>
          </Card>
          <Card style={styles.gridCard}>
            <View style={styles.iconCircle}><Upload size={24} color={COLORS.success} /></View>
            <Typography variant="h3" style={{marginTop: SPACING.md}}>Dokumen PDF</Typography>
            <Typography variant="caption">2 tersimpan</Typography>
          </Card>
        </View>

        <Typography variant="h3" style={styles.sectionTitle}>Tugas Aktif</Typography>
        <Card style={styles.taskCard}>
          <CheckCircle2 size={24} color={COLORS.textSecondary} />
          <View style={styles.taskContent}>
            <Typography variant="body" weight="600">Selesaikan Draft Laporan</Typography>
            <Typography variant="caption" color={COLORS.warning}>Deadline: Besok</Typography>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: SPACING.lg },
  header: { marginBottom: SPACING.xs },
  subtitle: { marginBottom: SPACING.xl },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.lg },
  gridCard: { flex: 1, marginHorizontal: SPACING.xs, alignItems: 'center', padding: SPACING.lg },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { marginBottom: SPACING.md },
  taskCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, marginBottom: SPACING.sm },
  taskContent: { marginLeft: SPACING.md }
});
`,
  'src/app/(tabs)/ai.tsx': `import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { aiService } from '@/services/ai/MockAIService';
import { SPACING, COLORS } from '@/constants/theme';
import { Send, Sparkles } from 'lucide-react-native';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AITab() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: 'Halo! Saya Asisten AI RisetFlow. Apa yang bisa saya bantu hari ini terkait riset, belajar, atau pekerjaan Anda?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    
    setIsLoading(true);
    const response = await aiService.chat(userMsg);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response.content }]);
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Sparkles size={24} color={COLORS.primary} style={{marginRight: SPACING.sm}} />
          <Typography variant="h2">Asisten AI</Typography>
        </View>
        <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
          {messages.map(msg => (
            <View key={msg.id} style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Typography color={msg.role === 'user' ? '#FFF' : COLORS.text}>{msg.content}</Typography>
            </View>
          ))}
          {isLoading && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <Typography color={COLORS.textSecondary}>Mengetik...</Typography>
            </View>
          )}
        </ScrollView>
        <View style={styles.inputArea}>
          <Input 
            style={styles.input} 
            placeholder="Tanyakan sesuatu..." 
            value={input} 
            onChangeText={setInput} 
            onSubmitEditing={handleSend}
          />
          <Button title="" icon={<Send size={20} color="#FFF" />} onPress={handleSend} disabled={isLoading || !input.trim()} style={styles.sendBtn} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  chatArea: { flex: 1 },
  chatContent: { padding: SPACING.md },
  messageBubble: { padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.sm, maxWidth: '85%' },
  userBubble: { backgroundColor: COLORS.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: COLORS.surface, alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border },
  inputArea: { flexDirection: 'row', padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
  input: { flex: 1, marginRight: SPACING.sm },
  sendBtn: { width: 48, height: 48, paddingHorizontal: 0 }
});
`,
  'src/app/(tabs)/library.tsx': `import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { SPACING, COLORS } from '@/constants/theme';
import { BookOpen, Search } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';

export default function LibraryTab() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="h1">Perpustakaan Saya</Typography>
          <Typography variant="subtitle" style={{marginTop: SPACING.xs}}>Koleksi pengetahuan, paper, dan dokumen.</Typography>
        </View>
        <View style={{paddingHorizontal: SPACING.lg, marginBottom: SPACING.md}}>
          <Input placeholder="Cari dokumen, catatan..." icon={<Search size={20} color={COLORS.textSecondary} />} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.itemCard}>
            <View style={styles.iconBox}><BookOpen size={20} color={COLORS.primary} /></View>
            <View style={styles.itemText}>
              <Typography variant="body" weight="600">The Role of LLMs in Education</Typography>
              <Typography variant="caption">PDF • Ditambahkan kemarin</Typography>
            </View>
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  content: { paddingHorizontal: SPACING.lg },
  itemCard: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, marginBottom: SPACING.sm },
  iconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center' },
  itemText: { marginLeft: SPACING.md, flex: 1 }
});
`,
  'src/app/(tabs)/profile.tsx': `import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import { SPACING, COLORS } from '@/constants/theme';
import { User, Settings, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileTab() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <User size={32} color={COLORS.primary} />
          </View>
          <View style={{marginLeft: SPACING.md}}>
            <Typography variant="h2">{user?.name || 'Pengguna'}</Typography>
            <Typography variant="subtitle" style={{textTransform: 'capitalize'}}>{user?.role || 'Guest'}</Typography>
          </View>
        </View>

        <View style={styles.content}>
          <Typography variant="h3" style={{marginBottom: SPACING.md}}>Pengaturan Akun</Typography>
          <Card style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={styles.menuIcon}><Settings size={20} color={COLORS.textSecondary} /></View>
              <Typography variant="body" style={{flex: 1}}>Pengaturan Aplikasi</Typography>
              <ChevronRight size={20} color={COLORS.textSecondary} />
            </View>
          </Card>

          <Button 
            title="Logout" 
            variant="outline" 
            icon={<LogOut size={20} color={COLORS.primary} />} 
            onPress={handleLogout} 
            style={{marginTop: SPACING.xl}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primaryLight + '30', justifyContent: 'center', alignItems: 'center' },
  content: { padding: SPACING.lg },
  menuCard: { padding: 0 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md },
  menuIcon: { marginRight: SPACING.md }
});
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Screens setup complete!');
