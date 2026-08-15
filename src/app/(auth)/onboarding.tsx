import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { SPACING, COLORS } from '@/constants/theme';
import Animated, { FadeIn, FadeInDown, FadeInUp, withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';

export default function Onboarding() {
  const router = useRouter();
  const completeOnboarding = useAppStore(state => state.completeOnboarding);
  const { t } = useTranslation();
  const isDark = useAppStore(state => state.theme) === 'dark';

  const iconScale = useSharedValue(0.5);

  useEffect(() => {
    iconScale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }]
    };
  });

  const handleStart = () => {
    completeOnboarding();
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, iconStyle, { backgroundColor: COLORS.primary + '20' }]} entering={FadeIn.delay(300).duration(800)}>
          <Sparkles size={64} color={COLORS.primary} />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(500).springify().damping(12)}>
          <Typography variant="h1" align="center" style={{ marginBottom: SPACING.md }}>
            {t('onboarding.title1') || "RisetFlow-AI"}
          </Typography>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(700).springify().damping(12)}>
          <Typography variant="body" align="center" color={COLORS.textSecondary} style={{ paddingHorizontal: SPACING.xl }}>
            {t('onboarding.desc1') || "All-in-One AI Workspace untuk riset, belajar, dan bekerja dengan dokumen Anda."}
          </Typography>
        </Animated.View>
      </View>
      
      <Animated.View style={styles.footer} entering={FadeInUp.delay(1000).springify().damping(12)}>
        <Button title={t('onboarding.start') || "Mulai Sekarang"} onPress={handleStart} size="lg" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  footer: { padding: SPACING.lg, paddingBottom: SPACING.xxl }
});
