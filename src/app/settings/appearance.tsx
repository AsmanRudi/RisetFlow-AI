import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Switch } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Typography } from '@/components/ui/Typography';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { Moon, Sun } from 'lucide-react-native';

export default function AppearanceScreen() {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Tampilan" />
      <View style={styles.content}>
        <View style={[styles.item, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
          {isDark ? <Moon size={20} color={COLORS.primary} /> : <Sun size={20} color={COLORS.primary} />}
          <Typography variant="body" weight="600" style={styles.label}>Mode Gelap</Typography>
          <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: COLORS.border, true: COLORS.primary }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, padding: SPACING.lg },
  item: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderRadius: 12 },
  label: { flex: 1, marginLeft: SPACING.md }
});
