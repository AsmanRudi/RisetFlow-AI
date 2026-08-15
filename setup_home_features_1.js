const fs = require('fs');
const path = require('path');

const files = {
  'src/features/home/components/HomeHeader.tsx': `import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Bell, User } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SPACING, COLORS } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';

export const HomeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore(state => state.user);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.iconBtn}>
          <Menu size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <View style={styles.greeting}>
          <Typography variant="caption" color={COLORS.textSecondary}>Selamat pagi,</Typography>
          <Typography variant="h3" weight="bold">{user?.name || 'Pengguna'} 👋</Typography>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Bell size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar}>
            <User size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet isVisible={isMenuOpen} onClose={() => setIsMenuOpen(false)} height={400}>
        <View style={{ padding: SPACING.lg }}>
          <Typography variant="h2" style={{ marginBottom: SPACING.md }}>Menu</Typography>
          {['Profil', 'Belajar', 'Riset', 'Kerja', 'Pengaturan', 'Bahasa', 'Tampilan', 'RisetFlow Pro'].map((item, idx) => (
            <TouchableOpacity key={idx} style={{ paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
              <Typography variant="body">{item}</Typography>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  iconBtn: { padding: SPACING.xs },
  greeting: { flex: 1, paddingHorizontal: SPACING.md },
  actions: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryLight + '30', justifyContent: 'center', alignItems: 'center', marginLeft: SPACING.sm }
});
`,
  'src/features/home/components/AIHeroCard.tsx': `import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Sparkles, Paperclip, Mic, Send } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export const AIHeroCard = () => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.primaryLight + '20' }]}>
      <View style={styles.header}>
        <Sparkles size={20} color={COLORS.primary} />
        <Typography variant="h3" weight="bold" style={{ marginLeft: SPACING.sm }}>✨ Asisten AI</Typography>
      </View>
      <Typography variant="caption" color={isDark ? COLORS.darkTextSecondary : COLORS.textSecondary} style={{ marginBottom: SPACING.md }}>
        Tanyakan apa saja, saya siap membantu.
      </Typography>

      <View style={[styles.inputContainer, { backgroundColor: isDark ? COLORS.darkBackground : '#FFF' }]}>
        <TextInput
          placeholder="Tanya apa saja..."
          placeholderTextColor={isDark ? COLORS.darkTextSecondary : COLORS.textSecondary}
          style={[styles.input, { color: isDark ? COLORS.darkText : COLORS.text }]}
        />
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn}><Paperclip size={20} color={COLORS.textSecondary} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Mic size={20} color={COLORS.textSecondary} /></TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn}><Send size={16} color="#FFF" /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: SPACING.lg, padding: SPACING.lg, borderRadius: 16, marginBottom: SPACING.lg, elevation: 4, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 24, paddingLeft: SPACING.md, paddingRight: SPACING.xs, height: 48, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, fontSize: 14 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: SPACING.xs, marginHorizontal: 2 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginLeft: SPACING.xs }
});
`,
  'src/features/home/components/QuickActions.tsx': `import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles, FileText, Edit3, CheckSquare } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

const actions = [
  { id: '1', title: 'Tanya AI', icon: Sparkles, color: COLORS.primary },
  { id: '2', title: 'Analisis PDF', icon: FileText, color: COLORS.warning },
  { id: '3', title: 'Buat Catatan', icon: Edit3, color: COLORS.success },
  { id: '4', title: 'Buat Tugas', icon: CheckSquare, color: COLORS.danger },
];

export const QuickActions = () => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
      {actions.map((act) => (
        <TouchableOpacity key={act.id} style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]} activeOpacity={0.7}>
          <View style={[styles.iconBox, { backgroundColor: act.color + '20' }]}>
            <act.icon size={24} color={act.color} />
          </View>
          <Typography variant="caption" weight="600" align="center" style={{ marginTop: SPACING.sm }}>{act.title}</Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, justifyContent: 'space-between', marginBottom: SPACING.lg },
  card: { width: '48%', alignItems: 'center', padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.sm, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }
});
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Home features setup 1 complete!');
