import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { Lock, Crown } from 'lucide-react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';

export function ProGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // Super Admin Bypass
  if (user?.isAdmin) {
    return <>{children}</>;
  }

  // Pro Subscription Access
  if (user?.subscriptionTier === 'pro') {
    return <>{children}</>;
  }

  // Paywall Lock Screen
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Lock size={64} color={COLORS.textSecondary} />
        </View>
        <Typography variant="h2" weight="bold" style={styles.title}>
          Akses Terkunci
        </Typography>
        <Typography variant="body" color={COLORS.textSecondary} style={styles.subtitle}>
          Fitur canggih ini eksklusif hanya untuk pengguna RisetFlow Pro. Tingkatkan produktivitas riset Anda dengan AI tingkat lanjut.
        </Typography>
        
        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Crown size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Typography variant="body" weight="bold">Multi-Document Synthesis</Typography>
          </View>
          <View style={styles.featureRow}>
            <Crown size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Typography variant="body" weight="bold">Autonomous Agentic Researcher</Typography>
          </View>
          <View style={styles.featureRow}>
            <Crown size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Typography variant="body" weight="bold">Interactive Flashcard Deck</Typography>
          </View>
        </View>

        <Button 
          title="Upgrade ke Pro Sekarang" 
          onPress={() => router.push('/profile/edit')} 
          style={styles.upgradeBtn}
        />
        <Button 
          title="Kembali ke Beranda" 
          variant="ghost" 
          onPress={() => router.replace('/' as any)} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 999
  },
  content: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg
  },
  title: {
    marginBottom: SPACING.sm,
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22
  },
  features: {
    width: '100%',
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 12
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  upgradeBtn: {
    width: '100%',
    marginBottom: SPACING.sm
  }
});
