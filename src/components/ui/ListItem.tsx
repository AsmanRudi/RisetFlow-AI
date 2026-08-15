import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { LucideIcon, MoreVertical } from 'lucide-react-native';

interface ListItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  rightLabel?: string;
  onPress?: () => void;
  onAction?: () => void;
  style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = ({ icon: Icon, title, subtitle, rightLabel, onPress, onAction, style }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface, borderColor: isDark ? COLORS.darkBorder : COLORS.border }, style]} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.iconBox}><Icon size={24} color={COLORS.primary} /></View>
      <View style={styles.content}>
        <Typography variant="body" weight="bold">{title}</Typography>
        {subtitle && <Typography variant="caption" color={COLORS.textSecondary} style={{ marginTop: 2 }}>{subtitle}</Typography>}
      </View>
      {rightLabel && <Typography variant="caption" color={COLORS.textSecondary} style={{ marginRight: SPACING.md }}>{rightLabel}</Typography>}
      {onAction && (
        <TouchableOpacity style={styles.actionBtn} onPress={onAction}>
          <MoreVertical size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: 12, borderWidth: 1, marginBottom: SPACING.sm },
  iconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  content: { flex: 1, justifyContent: 'center' },
  actionBtn: { padding: SPACING.xs }
});
