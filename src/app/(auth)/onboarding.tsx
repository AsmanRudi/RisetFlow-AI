import React, { useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { SPACING, COLORS } from '@/constants/theme';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Belajar Jadi Menyenangkan',
    description: 'Guru dan murid berkolaborasi memecahkan masalah pelajaran dibantu asisten AI interaktif.',
    image: require('@/assets/images/onboarding/slide1.jpg')
  },
  {
    id: '2',
    title: 'Riset Tanpa Beban',
    description: 'Dosen dan mahasiswa mampu menganalisa jurnal dan grafik tebal dalam hitungan menit.',
    image: require('@/assets/images/onboarding/slide2.jpg')
  },
  {
    id: '3',
    title: 'Produktivitas Tertinggi',
    description: 'Pekerja profesional dapat menyusun laporan panjang dengan bantuan alat AI yang terintegrasi.',
    image: require('@/assets/images/onboarding/slide3.jpg')
  },
  {
    id: '4',
    title: 'Ekosistem Terhubung',
    description: 'Seluruh peran terhubung dalam satu ruang kerja kolaboratif. Mari mulai eksplorasi Anda!',
    image: require('@/assets/images/onboarding/slide4.jpg')
  }
];

export default function Onboarding() {
  const router = useRouter();
  const completeOnboarding = useAppStore(state => state.completeOnboarding);
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      completeOnboarding();
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <FlatList 
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          if (index !== currentIndex) {
            setCurrentIndex(index);
          }
        }}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.textContainer}>
              <View>
                <Typography variant="h1" align="center" style={{ marginBottom: SPACING.md }}>
                  {item.title}
                </Typography>
              </View>
              <View>
                <Typography variant="body" align="center" color={COLORS.textSecondary} style={{ paddingHorizontal: SPACING.lg }}>
                  {item.description}
                </Typography>
              </View>
            </View>
          </View>
        )}
      />
      
      <Animated.View style={styles.footer} entering={FadeInUp.delay(800).springify()}>
        <View style={styles.indicators}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === currentIndex ? COLORS.primary : (isDark ? COLORS.darkBorder : COLORS.border), width: i === currentIndex ? 24 : 8 }]} />
          ))}
        </View>
        <Button 
          title={currentIndex === SLIDES.length - 1 ? "Mulai Sekarang" : "Lanjut"} 
          onPress={handleNext} 
          size="lg" 
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: height * 0.1 },
  imageContainer: { width: width * 0.85, height: width * 0.85, marginBottom: SPACING.xl, borderRadius: 24, overflow: 'hidden', elevation: 10, shadowColor: COLORS.primary, shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.15, shadowRadius: 20 },
  image: { width: '100%', height: '100%' },
  textContainer: { paddingHorizontal: SPACING.lg, alignItems: 'center', width: '100%' },
  footer: { padding: SPACING.xl, paddingBottom: SPACING.xxl + 20 },
  indicators: { flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xl, gap: 8 },
  dot: { height: 8, borderRadius: 4 }
});
