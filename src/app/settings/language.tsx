import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Typography } from '@/components/ui/Typography';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { Check } from 'lucide-react-native';

export default function LanguageScreen() {
  const { theme, lang, setLang } = useAppStore();
  const isDark = theme === 'dark';

  const languages = [
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'en', name: 'English' }
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Bahasa" />
      <View style={styles.content}>
        {languages.map((item) => (
          <TouchableOpacity 
            key={item.code} 
            style={[styles.item, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}
            onPress={() => setLang(item.code as any)}
          >
            <Typography variant="body" weight="600" style={styles.label}>{item.name}</Typography>
            {lang === item.code && <Check size={20} color={COLORS.primary} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, padding: SPACING.lg },
  item: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderRadius: 12, marginBottom: SPACING.sm },
  label: { flex: 1 }
});
