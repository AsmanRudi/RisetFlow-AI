import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { Typography } from './Typography';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  children
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
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        getContainerStyle(),
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFF' : COLORS.primary} />
      ) : (
        <>
          {icon && <>{icon}</>}
          {(children || title) ? (
            <Typography variant="body" weight="bold" color={getTextColor()} style={icon ? { marginLeft: SPACING.sm } : {}}>
              {children || title}
            </Typography>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
};
