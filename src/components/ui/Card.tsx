import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface CardProps extends ViewProps {
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, elevated = true, ...props }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <View 
      style={[
        styles.card,
        { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface },
        elevated && (isDark ? styles.darkElevation : styles.elevation),
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
  },
  elevation: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  darkElevation: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  }
});
