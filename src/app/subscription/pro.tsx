import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { Crown } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SubscriptionProScreen() {
  const isDark = useAppStore(state => state.theme) === 'dark';
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="RisetFlow Pro" />
      <View style={styles.content}>
        <Crown size={80} color={COLORS.warning} style={styles.icon} />
        <Typography variant="h2" weight="bold" style={styles.title} align="center">Tingkatkan ke Pro</Typography>
        <Typography variant="body" color={COLORS.textSecondary} align="center" style={styles.desc}>
          Dapatkan akses tanpa batas ke Model AI terbaru, penyimpanan dokumen cloud, dan analitik riset tingkat lanjut.
        </Typography>
        <Button variant="primary" style={styles.btn} onPress={() => {
          alert('Pembayaran sukses! Akun Anda kini berstatus PRO.');
          router.back();
        }}>Upgrade Sekarang - Rp49.000/bln</Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, padding: SPACING.xl, justifyContent: 'center', alignItems: 'center' },
  icon: { marginBottom: SPACING.lg },
  title: { marginBottom: SPACING.md },
  desc: { marginBottom: SPACING.xxl, lineHeight: 24 },
  btn: { width: '100%' }
});
