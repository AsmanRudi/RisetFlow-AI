import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface ConfirmModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isVisible, title, message, confirmLabel = 'Konfirmasi', cancelLabel = 'Batal', isDanger = false, onConfirm, onCancel }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  if (!isVisible) return null;

  return (
    <Modal transparent animationType="fade" visible={isVisible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
          <Typography variant="h3" weight="bold" style={styles.title}>{title}</Typography>
          <Typography variant="body" color={COLORS.textSecondary} style={styles.message}>{message}</Typography>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
              <Typography variant="body" weight="600">{cancelLabel}</Typography>
            </TouchableOpacity>
            <Button variant={isDanger ? 'outline' : 'primary'} onPress={() => { onConfirm(); onCancel(); }} style={{ flex: 1, borderColor: isDanger ? COLORS.danger : COLORS.primary }}>
              <Typography variant="body" weight="bold" color={isDanger ? COLORS.danger : '#FFF'}>{confirmLabel}</Typography>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  card: { width: '100%', borderRadius: 16, padding: SPACING.lg, elevation: 5 },
  title: { marginBottom: SPACING.sm },
  message: { marginBottom: SPACING.xl, lineHeight: 22 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  cancelBtn: { flex: 1, alignItems: 'center', paddingVertical: 12 }
});
