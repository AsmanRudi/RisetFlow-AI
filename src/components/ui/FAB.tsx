import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { Typography } from './Typography';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming } from 'react-native-reanimated';

export interface FABAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

interface FABProps {
  actions: FABAction[];
}

export const FAB: React.FC<FABProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const rotation = useSharedValue(0);
  const bgOpacity = useSharedValue(0);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    rotation.value = withSpring(next ? 45 : 0);
    bgOpacity.value = withTiming(next ? 1 : 0, { duration: 200 });
  };

  const close = () => {
    if(isOpen) toggle();
  };

  const animatedIcon = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  const animatedBg = useAnimatedStyle(() => ({
    opacity: bgOpacity.value
  }));

  if (!actions || actions.length === 0) return null;

  return (
    <>
      {isOpen && (
        <Modal transparent animationType="none" visible={isOpen} onRequestClose={close}>
          <Pressable style={styles.backdrop} onPress={close}>
            <Animated.View style={[styles.backdropBg, animatedBg]} />
            <View style={styles.actionsContainer}>
              {actions.map((act, index) => (
                <TouchableOpacity 
                  key={act.id} 
                  style={styles.actionItem}
                  onPress={() => { act.onPress(); close(); }}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionLabel}>
                    <Typography weight="600">{act.label}</Typography>
                  </View>
                  <View style={styles.actionIconBtn}>
                    {act.icon}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={toggle}
      >
        <Animated.View style={animatedIcon}>
          <Plus color="#FFF" size={28} />
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 95,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 999
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 80,
    paddingRight: SPACING.lg,
  },
  backdropBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  actionsContainer: {
    alignItems: 'flex-end',
    marginBottom: SPACING.sm
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  actionLabel: {
    backgroundColor: '#FFF',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    marginRight: SPACING.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  }
});
