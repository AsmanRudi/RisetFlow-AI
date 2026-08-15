const fs = require('fs');
const path = require('path');

const files = {
  'src/app/(tabs)/profile.tsx': `import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { User, Settings, Shield, HelpCircle, LogOut, Moon, Globe, Crown } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileTab() {
  const router = useRouter();
  const { theme, toggleTheme, lang, setLang } = useAppStore();
  const isDark = theme === 'dark';
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const [showSettings, setShowSettings] = useState(false);
  const [showPro, setShowPro] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/onboarding');
  };

  const menuItems = [
    { icon: Settings, label: 'Pengaturan Tampilan & Bahasa', onPress: () => setShowSettings(true) },
    { icon: Crown, label: 'RisetFlow Pro', onPress: () => setShowPro(true) },
    { icon: Shield, label: 'Privasi & Keamanan', onPress: () => {} },
    { icon: HelpCircle, label: 'Bantuan & Dukungan', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.avatarLarge}>
            <User size={40} color={COLORS.primary} />
          </View>
          <Typography variant="h2" weight="bold" style={{ marginTop: SPACING.md }}>{user?.name || 'Pengguna'}</Typography>
          <Typography variant="body" color={COLORS.textSecondary}>{user?.email || 'user@risetflow.ai'}</Typography>
          <View style={styles.roleBadge}>
             <Typography variant="caption" weight="bold" color={COLORS.primary}>{user?.role?.toUpperCase() || 'STUDENT'}</Typography>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={[styles.statBox, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
            <Typography variant="h2" weight="bold">12</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>Project</Typography>
          </View>
          <View style={[styles.statBox, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
            <Typography variant="h2" weight="bold">45</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>Catatan</Typography>
          </View>
          <View style={[styles.statBox, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
            <Typography variant="h2" weight="bold">89</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>AI Sesi</Typography>
          </View>
        </View>

        <View style={styles.menuGroup}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.menuItem, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border, borderBottomWidth: idx === menuItems.length - 1 ? 0 : 1 }]}
              onPress={item.onPress}
            >
              <item.icon size={20} color={COLORS.textSecondary} />
              <Typography variant="body" weight="600" style={{ flex: 1, marginLeft: SPACING.md }}>{item.label}</Typography>
            </TouchableOpacity>
          ))}
        </View>

        <Button variant="outline" onPress={handleLogout} style={[styles.logoutBtn, { borderColor: COLORS.danger }]}>
          <LogOut size={20} color={COLORS.danger} style={{ marginRight: SPACING.sm }} />
          <Typography weight="bold" color={COLORS.danger}>Keluar</Typography>
        </Button>
      </ScrollView>

      {/* Settings Modal */}
      <Modal visible={showSettings} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowSettings(false)}>
        <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
           <View style={[styles.modalHeader, { borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
             <Typography variant="h3" weight="bold">Pengaturan</Typography>
             <TouchableOpacity onPress={() => setShowSettings(false)}><Typography color={COLORS.primary}>Tutup</Typography></TouchableOpacity>
           </View>
           <View style={styles.modalContent}>
              <Typography variant="body" weight="bold" style={{ marginBottom: SPACING.sm }}>Tampilan</Typography>
              <TouchableOpacity style={[styles.settingRow, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]} onPress={toggleTheme}>
                 <Moon size={20} color={COLORS.textSecondary} />
                 <Typography style={{ flex: 1, marginLeft: SPACING.md }}>Mode Gelap</Typography>
                 <Typography weight="bold" color={COLORS.primary}>{isDark ? 'ON' : 'OFF'}</Typography>
              </TouchableOpacity>
              
              <Typography variant="body" weight="bold" style={{ marginTop: SPACING.lg, marginBottom: SPACING.sm }}>Bahasa</Typography>
              <TouchableOpacity style={[styles.settingRow, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]} onPress={() => setLang(lang === 'id' ? 'en' : 'id')}>
                 <Globe size={20} color={COLORS.textSecondary} />
                 <Typography style={{ flex: 1, marginLeft: SPACING.md }}>Ganti Bahasa</Typography>
                 <Typography weight="bold" color={COLORS.primary}>{lang.toUpperCase()}</Typography>
              </TouchableOpacity>
           </View>
        </SafeAreaView>
      </Modal>

      {/* Pro Modal */}
      <Modal visible={showPro} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowPro(false)}>
        <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
           <View style={[styles.modalHeader, { borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
             <Typography variant="h3" weight="bold">RisetFlow Pro</Typography>
             <TouchableOpacity onPress={() => setShowPro(false)}><Typography color={COLORS.primary}>Tutup</Typography></TouchableOpacity>
           </View>
           <View style={[styles.modalContent, { alignItems: 'center', paddingTop: 40 }]}>
              <Crown size={80} color={COLORS.warning} style={{ marginBottom: SPACING.lg }} />
              <Typography variant="h2" weight="bold" align="center" style={{ marginBottom: SPACING.sm }}>Upgrade ke Pro</Typography>
              <Typography variant="body" color={COLORS.textSecondary} align="center" style={{ marginBottom: SPACING.xl }}>
                Dapatkan akses tanpa batas ke Model AI terbaru, penyimpanan dokumen cloud, dan analitik riset.
              </Typography>
              <Button variant="primary" style={{ width: '100%' }} onPress={() => {}}>Segera Hadir</Button>
           </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center' },
  roleBadge: { marginTop: SPACING.sm, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: COLORS.primaryLight + '20' },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xl },
  statBox: { flex: 1, alignItems: 'center', padding: SPACING.md, borderRadius: 12, marginHorizontal: 4, elevation: 1 },
  menuGroup: { borderRadius: 16, overflow: 'hidden', marginBottom: SPACING.xl, elevation: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1 },
  modalContent: { padding: SPACING.lg },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: 12 }
});
`,
  'src/app/(auth)/login.tsx': `import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const login = useAuthStore(state => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Functional mock login
    login({ id: '1', name: 'Student', email: email || 'student@risetflow.ai', role: 'student' });
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={isDark ? COLORS.darkText : COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Typography variant="h1" weight="bold" style={styles.title}>Selamat Datang Kembali 👋</Typography>
          <Typography variant="body" color={COLORS.textSecondary} style={styles.subtitle}>
            Masuk untuk melanjutkan ke workspace Anda.
          </Typography>

          <Input 
            placeholder="Email" 
            value={email}
            onChangeText={setEmail}
            icon={<Mail size={20} color={COLORS.textSecondary} />} 
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={{ height: SPACING.md }} />
          <Input 
            placeholder="Kata Sandi" 
            value={password}
            onChangeText={setPassword}
            icon={<Lock size={20} color={COLORS.textSecondary} />} 
            secureTextEntry 
          />

          <TouchableOpacity style={styles.forgot}>
            <Typography variant="caption" weight="600" color={COLORS.primary}>Lupa Kata Sandi?</Typography>
          </TouchableOpacity>

          <Button variant="primary" style={styles.btn} onPress={handleLogin}>
            Masuk
          </Button>

          <View style={styles.footer}>
            <Typography variant="caption" color={COLORS.textSecondary}>Belum punya akun? </Typography>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Typography variant="caption" weight="bold" color={COLORS.primary}>Daftar</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  header: { padding: SPACING.md },
  backBtn: { padding: SPACING.xs },
  content: { flex: 1, paddingHorizontal: SPACING.lg, justifyContent: 'center', paddingBottom: 60 },
  title: { marginBottom: SPACING.xs },
  subtitle: { marginBottom: SPACING.xl },
  forgot: { alignSelf: 'flex-end', marginTop: SPACING.md, marginBottom: SPACING.xl },
  btn: { width: '100%' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl }
});
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Setup 3 complete');
