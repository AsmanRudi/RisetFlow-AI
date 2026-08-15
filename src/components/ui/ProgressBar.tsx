import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = COLORS.primary, height = 6 }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.container, { height, backgroundColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  }
});
