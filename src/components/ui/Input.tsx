import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({ icon, style, containerStyle, ...props }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <View 
      style={[
        styles.container,
        { 
          backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface,
          borderColor: isDark ? COLORS.darkBorder : COLORS.border,
        },
        containerStyle
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <TextInput
        style={[
          styles.input,
          { color: isDark ? COLORS.darkText : COLORS.text }
        ]}
        placeholderTextColor={isDark ? COLORS.darkTextSecondary : COLORS.textSecondary}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.md,
    height: '100%',
    ...({ outlineStyle: 'none' } as any)
  }
});
