const fs = require('fs');
const path = require('path');

const buttonPath = path.join(process.cwd(), 'src/components/ui/Button.tsx');
fs.writeFileSync(buttonPath, `import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, StyleProp } from 'react-native';
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
`);

const indexPath = path.join(process.cwd(), 'src/app/(tabs)/index.tsx');
let idxContent = fs.readFileSync(indexPath, 'utf8');
idxContent = idxContent.replace(
  "import { mockData } from '@/data/mock';",
  "import { useWorkspaceStore } from '@/store/useWorkspaceStore';"
);
idxContent = idxContent.replace(
  "const role = useAuthStore(state => state.user?.role) || 'student';",
  "const role = useAuthStore(state => state.user?.role) || 'student';\n  const notes = useWorkspaceStore(state => state.notes);\n  const tasks = useWorkspaceStore(state => state.tasks);"
);
idxContent = idxContent.replace(
  "const roleData = mockData[role as keyof typeof mockData] || mockData.student;",
  "// Using workspace store"
);
idxContent = idxContent.replace(
  "const activities = roleData.notes.map((n: any, i: number) => ({",
  "const activities = notes.slice(0,3).map((n: any, i: number) => ({"
);
fs.writeFileSync(indexPath, idxContent);

console.log('Fixed');
