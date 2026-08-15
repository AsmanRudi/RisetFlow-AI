import React from 'react';
import { Text, TextProps } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'subtitle' | 'body' | 'caption';
  color?: string;
  weight?: 'normal' | 'bold' | '600' | '500';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<TypographyProps> = ({ 
  children, 
  variant = 'body', 
  color, 
  weight, 
  align,
  style, 
  ...props 
}) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const defaultColor = isDark ? COLORS.darkText : COLORS.text;
  const secondaryColor = isDark ? COLORS.darkTextSecondary : COLORS.textSecondary;

  const getStyle = () => {
    switch(variant) {
      case 'h1': return { fontSize: TYPOGRAPHY.sizes.xxl, fontWeight: 'bold' as const, color: defaultColor };
      case 'h2': return { fontSize: TYPOGRAPHY.sizes.xl, fontWeight: 'bold' as const, color: defaultColor };
      case 'h3': return { fontSize: TYPOGRAPHY.sizes.lg, fontWeight: '600' as const, color: defaultColor };
      case 'subtitle': return { fontSize: TYPOGRAPHY.sizes.md, fontWeight: '500' as const, color: secondaryColor };
      case 'body': return { fontSize: TYPOGRAPHY.sizes.md, color: defaultColor };
      case 'caption': return { fontSize: TYPOGRAPHY.sizes.sm, color: secondaryColor };
      default: return { fontSize: TYPOGRAPHY.sizes.md, color: defaultColor };
    }
  };

  const baseStyle = getStyle();

  return (
    <Text 
      style={[
        baseStyle,
        color && { color },
        weight && { fontWeight: weight },
        align && { textAlign: align },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};
