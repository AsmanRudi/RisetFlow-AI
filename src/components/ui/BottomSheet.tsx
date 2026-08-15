/* eslint-disable react-hooks/immutability */
import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Pressable, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const BottomSheet: React.FC<BottomSheetProps> = ({ isVisible, onClose, children, height }) => {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const insets = useSafeAreaInsets();

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
      const threshold = height ? height / 3 : SCREEN_HEIGHT / 4;
      if (event.translationY > threshold || event.velocityY > 500) {
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
              { 
                backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface,
                paddingBottom: insets.bottom > 0 ? insets.bottom : SPACING.lg,
                maxHeight: SCREEN_HEIGHT * 0.9,
                ...(height ? { height } : {})
              },
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
    ...StyleSheet.absoluteFill,
  },
  backdropBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
