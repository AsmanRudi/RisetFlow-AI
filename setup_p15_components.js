const fs = require('fs');
const path = require('path');

const files = {
  'src/constants/theme.ts': `export const COLORS = {
  primary: '#4F46E5', // Indigo for AI
  primaryLight: '#818CF8',
  primaryDark: '#3730A3',
  success: '#10B981', // Green for progress
  warning: '#F59E0B', // Orange for focus
  danger: '#EF4444',  // Red for urgent/error
  
  // Light Theme
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  skeleton: '#E5E7EB',
  
  // Dark Theme
  darkBackground: '#121212', // Deep charcoal
  darkSurface: '#1E1E1E', // Slightly lighter
  darkText: '#F9FAFB',
  darkTextSecondary: '#9CA3AF',
  darkBorder: '#27272A',
  darkSkeleton: '#27272A',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  fontFamily: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  }
};
`,
  'src/components/ui/Skeleton.tsx': `import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useAppStore } from '@/store/useAppStore';
import { COLORS } from '@/constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 20, borderRadius = 4, style }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: isDark ? COLORS.darkSkeleton : COLORS.skeleton,
        },
        animatedStyle,
        style
      ]}
    />
  );
};
`,
  'src/components/ui/ProgressBar.tsx': `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = COLORS.primary, height = 6 }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.container, { height, backgroundColor: isDark ? COLORS.darkBorder : COLORS.border }]}>
      <View style={[styles.fill, { width: \`\${clamped}%\`, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  }
});
`,
  'src/components/ui/FAB.tsx': `import React, { useState } from 'react';
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
    transform: [{ rotate: \`\${rotation.value}deg\` }]
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
    bottom: SPACING.lg,
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
    ...StyleSheet.absoluteFillObject,
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
`,
  'src/components/ui/BottomSheet.tsx': `import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Pressable, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const BottomSheet: React.FC<BottomSheetProps> = ({ isVisible, onClose, children, height = SCREEN_HEIGHT * 0.7 }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    }
  }, [isVisible]);

  const handleClose = () => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 200 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > height / 3 || event.velocityY > 500) {
        runOnJS(handleClose)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isVisible && translateY.value === SCREEN_HEIGHT) return null;

  return (
    <Modal visible={isVisible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.container}>
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <Animated.View style={[styles.backdropBg, animatedBackdropStyle]} />
        </Pressable>
        <GestureDetector gesture={panGesture}>
          <Animated.View 
            style={[
              styles.sheet, 
              { height, backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface },
              animatedSheetStyle
            ]}
          >
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  }
});
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('UI Components setup complete!');
