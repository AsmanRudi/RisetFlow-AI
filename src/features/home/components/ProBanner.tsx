import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Crown, ArrowRight } from 'lucide-react-native';
import { SPACING } from '@/constants/theme';
import { useRouter } from 'expo-router';

export function ProBanner() {
  const router = useRouter();
  
  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push('/pro' as any)} activeOpacity={0.8}>
      <View style={styles.content}>
        <Crown size={24} color="#1E1E1E" />
        <View style={styles.textContainer}>
          <Typography variant="h3" weight="bold" color="#1E1E1E">Akses Pro Tools Hub</Typography>
          <Typography variant="caption" color="#333">Multi-Doc, Agentic Workflow, & Web Research</Typography>
        </View>
        <ArrowRight size={20} color="#1E1E1E" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFD700', // Solid Gold Background
    borderWidth: 1,
    borderColor: '#E6C200',
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  textContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  }
});
