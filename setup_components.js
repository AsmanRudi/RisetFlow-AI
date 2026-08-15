const fs = require('fs');
const path = require('path');

const files = {
  'src/components/ui/Typography.tsx': `import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
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
`,
  'src/components/ui/Button.tsx': `import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Typography } from './Typography';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style
}) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      opacity: disabled ? 0.5 : 1,
    };
    
    // Size
    if (size === 'sm') {
      base.paddingVertical = SPACING.sm;
      base.paddingHorizontal = SPACING.md;
    } else if (size === 'lg') {
      base.paddingVertical = SPACING.md;
      base.paddingHorizontal = SPACING.lg;
    } else {
      base.paddingVertical = 12;
      base.paddingHorizontal = SPACING.lg;
    }

    // Variant
    if (variant === 'primary') {
      base.backgroundColor = COLORS.primary;
    } else if (variant === 'secondary') {
      base.backgroundColor = isDark ? COLORS.darkSurface : COLORS.surface;
      base.borderWidth = 1;
      base.borderColor = isDark ? COLORS.darkBorder : COLORS.border;
    } else if (variant === 'outline') {
      base.backgroundColor = 'transparent';
      base.borderWidth = 1;
      base.borderColor = COLORS.primary;
    } else if (variant === 'ghost') {
      base.backgroundColor = 'transparent';
    }

    return base;
  };

  const getTextColor = () => {
    if (variant === 'primary') return '#FFFFFF';
    if (variant === 'outline' || variant === 'ghost') return COLORS.primary;
    return isDark ? COLORS.darkText : COLORS.text;
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Typography 
            weight="600" 
            color={getTextColor()} 
            style={{ marginLeft: icon ? SPACING.sm : 0 }}
          >
            {title}
          </Typography>
        </>
      )}
    </TouchableOpacity>
  );
};
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Components setup complete!');
