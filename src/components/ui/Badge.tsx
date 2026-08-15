import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', style }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  let color = COLORS.textSecondary;
  let bg = isDark ? COLORS.darkSurface : COLORS.border;

  switch (variant) {
    case 'success': color = COLORS.success; bg = COLORS.success + '20'; break;
    case 'warning': color = COLORS.warning; bg = COLORS.warning + '20'; break;
    case 'danger': color = COLORS.danger; bg = COLORS.danger + '20'; break;
    case 'primary': color = COLORS.primary; bg = COLORS.primaryLight + '20'; break;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Typography variant="caption" weight="600" color={color}>{label}</Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' }
});
