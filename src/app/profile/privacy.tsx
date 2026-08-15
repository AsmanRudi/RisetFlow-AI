import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function PrivacyScreen() {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Privasi & Keamanan" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
          <Typography variant="h3" weight="bold" style={{ marginBottom: SPACING.sm }}>Kebijakan Privasi</Typography>
          <Typography variant="body" color={isDark ? COLORS.darkTextSecondary : COLORS.textSecondary} style={{ marginBottom: SPACING.md }}>
            RisetFlow-AI sangat menghargai privasi Anda. Dokumen dan data riset yang Anda unggah hanya digunakan untuk keperluan analisis AI Anda sendiri dan tidak dibagikan ke pihak ketiga tanpa izin.
          </Typography>

          <Typography variant="h3" weight="bold" style={{ marginBottom: SPACING.sm, marginTop: SPACING.md }}>Keamanan Data</Typography>
          <Typography variant="body" color={isDark ? COLORS.darkTextSecondary : COLORS.textSecondary} style={{ marginBottom: SPACING.md }}>
            Seluruh data dienkripsi menggunakan standar industri (AES-256) baik saat transit maupun saat disimpan (at-rest) di server kami. Anda memiliki kontrol penuh untuk menghapus data Anda kapan saja melalui perpustakaan dokumen.
          </Typography>

          <Typography variant="h3" weight="bold" style={{ marginBottom: SPACING.sm, marginTop: SPACING.md }}>Pengumpulan Data</Typography>
          <Typography variant="body" color={isDark ? COLORS.darkTextSecondary : COLORS.textSecondary}>
            Kami mengumpulkan analitik penggunaan secara anonim untuk meningkatkan performa AI. Anda dapat mematikan pelacakan analitik ini di pengaturan tingkat lanjut.
          </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg },
  card: { padding: SPACING.lg, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border }
});
