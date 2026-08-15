import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { User, Settings, Shield, HelpCircle, LogOut, Moon, Globe, Crown, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileTab() {
  const router = useRouter();
  const { theme, toggleTheme, lang, setLang } = useAppStore();
  const isDark = theme === 'dark';
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const [showSettings, setShowSettings] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/onboarding');
  };

  const menuItems = [
    { icon: Settings, label: 'Pengaturan Tampilan & Bahasa', onPress: () => setShowSettings(true) },
    { icon: Crown, label: 'RisetFlow Pro', onPress: () => setShowPro(true) },
    { icon: Shield, label: 'Privasi & Keamanan', onPress: () => router.push('/profile/privacy' as any) },
    { icon: HelpCircle, label: 'Bantuan & Dukungan', onPress: () => router.push('/profile/support' as any) },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: SPACING.md }}>
            <TouchableOpacity onPress={() => router.push('/(tabs)')} style={{ padding: SPACING.xs }}>
              <ArrowLeft size={24} color={isDark ? COLORS.darkText : COLORS.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.avatarLarge}>
            {user?.avatar && !avatarError ? (
              <Image source={{ uri: user.avatar }} style={{ width: 80, height: 80, borderRadius: 40 }} onError={() => setAvatarError(true)} />
            ) : (
              <User size={40} color={COLORS.primary} />
            )}
          </View>
          <Typography variant="h2" weight="bold" style={{ marginTop: SPACING.md }}>{user?.name || 'Pengguna'}</Typography>
          <Typography variant="body" color={COLORS.textSecondary}>{user?.email || 'user@risetflow.ai'}</Typography>
          <View style={styles.roleBadge}>
             <Typography variant="caption" weight="bold" color={COLORS.primary}>{user?.role?.toUpperCase() || 'STUDENT'}</Typography>
          </View>
          <Button 
            variant="outline" 
            title="Edit Profil" 
            size="sm" 
            onPress={() => router.push('/profile/edit' as any)} 
            style={{ marginTop: SPACING.md, borderRadius: 20, minWidth: 120 }} 
          />
        </View>

        <View style={styles.stats}>
          <View style={[styles.statBox, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
            <Typography variant="h2" weight="bold">{useWorkspaceStore(state => state.projects).length}</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>Project</Typography>
          </View>
          <View style={[styles.statBox, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
            <Typography variant="h2" weight="bold">{useWorkspaceStore(state => state.notes).length}</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>Catatan</Typography>
          </View>
          <View style={[styles.statBox, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
            <Typography variant="h2" weight="bold">{useWorkspaceStore(state => state.tasks).length}</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>Tugas</Typography>
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
              <Button variant="primary" style={{ width: '100%' }} onPress={() => {
                alert('Pembayaran berhasil! Selamat datang di RisetFlow PRO 🎉');
                setShowPro(false);
              }}>Upgrade Sekarang - Rp49.000/bln</Button>
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
