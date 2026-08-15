import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles, Clock, MoreVertical, ArrowLeft } from 'lucide-react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

import { useRouter } from 'expo-router';

export const AIHeader = () => {
  const router = useRouter();
  const isDark = useAppStore(state => state.theme) === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.titleArea}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={{ marginRight: SPACING.sm }}>
          <ArrowLeft size={24} color={isDark ? COLORS.darkText : COLORS.text} />
        </TouchableOpacity>
        <Sparkles size={20} color={COLORS.primary} />
        <View style={{ marginLeft: SPACING.sm }}>
          <Typography variant="body" weight="bold">✨ Asisten AI</Typography>
          <Typography variant="caption" color={COLORS.textSecondary}>Teman cerdas untuk riset & kerjamu.</Typography>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn}><Clock size={20} color={COLORS.textSecondary} /></TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/settings' as any)}><MoreVertical size={20} color={COLORS.textSecondary} /></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  titleArea: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: SPACING.xs, marginLeft: SPACING.xs }
});
