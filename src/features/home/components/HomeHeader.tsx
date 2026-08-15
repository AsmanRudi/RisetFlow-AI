import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Menu, Bell, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SPACING, COLORS } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';

export const HomeHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const [avatarError, setAvatarError] = useState(false);

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
          <TouchableOpacity style={styles.iconBtn} onPress={() => alert('Belum ada notifikasi baru')}>
            <Bell size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
            {user?.avatar && !avatarError ? (
              <Image source={{ uri: user.avatar }} style={{ width: 36, height: 36, borderRadius: 18 }} onError={() => setAvatarError(true)} />
            ) : (
              <User size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet isVisible={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <ScrollView contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xxl }}>
          <Typography variant="h2" weight="bold" style={{ marginBottom: SPACING.lg }}>Menu</Typography>
          {[
            { label: 'Profil', route: '/(tabs)/profile' },
            { label: 'Belajar', route: '/learn' },
            { label: 'Riset', route: '/(tabs)/workspace' },
            { label: 'Kerja', route: '/work' },
            { label: 'Pengaturan', route: '/settings' },
            { label: 'Bahasa', route: '/settings/language' },
            { label: 'Tampilan', route: '/settings/appearance' },
            { label: 'RisetFlow Pro', route: '/subscription/pro' }
          ].map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={{ paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border }}
              onPress={() => {
                setIsMenuOpen(false);
                router.push(item.route as any);
              }}
            >
              <Typography variant="body" weight="600">{item.label}</Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
