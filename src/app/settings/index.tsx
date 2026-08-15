import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Typography } from '@/components/ui/Typography';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { Settings, ChevronRight, Globe, Palette } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const isDark = useAppStore(state => state.theme) === 'dark';
  const router = useRouter();

  const menu = [
    { label: 'Tampilan', icon: Palette, route: '/settings/appearance' },
    { label: 'Bahasa', icon: Globe, route: '/settings/language' }
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Pengaturan" />
      <View style={styles.content}>
        {menu.map((item, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={[styles.item, { borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}
            onPress={() => router.push(item.route as any)}
          >
            <item.icon size={20} color={COLORS.textSecondary} />
            <Typography variant="body" weight="600" style={styles.label}>{item.label}</Typography>
            <ChevronRight size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, padding: SPACING.lg },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.lg, borderBottomWidth: 1 },
  label: { flex: 1, marginLeft: SPACING.md }
});
