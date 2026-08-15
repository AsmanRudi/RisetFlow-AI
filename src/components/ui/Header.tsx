import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';
import { ArrowLeft } from 'lucide-react-native';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightElement }) => {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }
  };

  return (
    <View style={[styles.container, { borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
      <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
        <ArrowLeft size={24} color={isDark ? COLORS.darkText : COLORS.text} />
      </TouchableOpacity>
      <Typography variant="h3" weight="bold" style={styles.title}>{title}</Typography>
      <View style={styles.right}>{rightElement}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', height: 60, paddingHorizontal: SPACING.md, borderBottomWidth: 1 },
  backBtn: { padding: SPACING.xs, marginRight: SPACING.md },
  title: { flex: 1 },
  right: { minWidth: 40, alignItems: 'flex-end' }
});
