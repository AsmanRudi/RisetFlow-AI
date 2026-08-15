import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Mohon isi email dan kata sandi');
      return;
    }
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      alert(e.message || 'Login gagal');
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/onboarding');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
      {/* Decorative Background Blobs */}
      <Animated.View entering={FadeIn.duration(1000)} style={[styles.blob1, { backgroundColor: COLORS.primary + '30' }]} />
      <Animated.View entering={FadeIn.duration(1200)} style={[styles.blob2, { backgroundColor: COLORS.secondary + '20' }]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={[styles.backBtn, { backgroundColor: isDark ? '#1e293b80' : '#ffffff80' }]}>
            <ArrowLeft size={24} color={isDark ? '#f8fafc' : '#0f172a'} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.titleContainer}>
            <Typography variant="h1" weight="bold" style={styles.title}>Selamat Datang</Typography>
            <View style={styles.dot} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Typography variant="body" color={isDark ? '#94a3b8' : '#64748b'} style={styles.subtitle}>
              Masuk untuk melanjutkan ke ruang kerja cerdas Anda.
            </Typography>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).springify()} style={[styles.formContainer, { backgroundColor: isDark ? '#1e293bE6' : '#ffffffE6' }]}>
            <Input  
              placeholder="Email address" 
              value={email}
              onChangeText={setEmail}
              icon={<Mail size={20} color={isDark ? '#94a3b8' : '#64748b'} />} 
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputOveride}
            />
            <View style={{ height: SPACING.md }} />
            <Input 
              placeholder="Password" 
              value={password}
              onChangeText={setPassword}
              icon={<Lock size={20} color={isDark ? '#94a3b8' : '#64748b'} />} 
              secureTextEntry 
              style={styles.inputOveride}
            />

            <TouchableOpacity style={styles.forgot}>
              <Typography variant="caption" weight="bold" color={COLORS.primary}>Forgot Password?</Typography>
            </TouchableOpacity>

            <Button variant="primary" style={styles.btn} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? 'Masuk...' : 'Masuk'}
            </Button>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(800).springify()} style={styles.footer}>
            <Typography variant="caption" color={isDark ? '#94a3b8' : '#64748b'}>Belum punya akun? </Typography>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Typography variant="caption" weight="bold" color={COLORS.primary}>Daftar</Typography>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, overflow: 'hidden' },
  blob1: { position: 'absolute', top: -height * 0.1, left: -width * 0.2, width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4 },
  blob2: { position: 'absolute', top: height * 0.3, right: -width * 0.3, width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45 },
  container: { flex: 1 },
  header: { padding: SPACING.lg, zIndex: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: SPACING.lg, justifyContent: 'center', paddingBottom: 60, zIndex: 10 },
  titleContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: SPACING.xs },
  title: { fontSize: 36, letterSpacing: -1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginLeft: 4 },
  subtitle: { marginBottom: SPACING.xxl, fontSize: 16, lineHeight: 24 },
  formContainer: { padding: SPACING.xl, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 24, elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  inputOveride: { backgroundColor: 'transparent' },
  forgot: { alignSelf: 'flex-end', marginTop: SPACING.md, marginBottom: SPACING.xl },
  btn: { width: '100%', height: 56, borderRadius: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xxl }
});
