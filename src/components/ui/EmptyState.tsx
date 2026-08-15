import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { SPACING, COLORS } from '@/constants/theme';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <View style={styles.container}>
    <View style={styles.iconBox}><Icon size={48} color={COLORS.primary} /></View>
    <Typography variant="h2" weight="bold" style={styles.title}>{title}</Typography>
    <Typography variant="body" color={COLORS.textSecondary} align="center" style={styles.desc}>{description}</Typography>
    {actionLabel && onAction && <Button variant="primary" onPress={onAction} style={styles.btn}>{actionLabel}</Button>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl, marginTop: 40 },
  iconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  title: { marginBottom: SPACING.sm },
  desc: { marginBottom: SPACING.xl, lineHeight: 22 },
  btn: { paddingHorizontal: SPACING.xl }
});
