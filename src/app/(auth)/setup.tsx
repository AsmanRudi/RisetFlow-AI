import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useAuthStore, UserRole } from '@/store/useAuthStore';
import { SPACING, COLORS } from '@/constants/theme';

export default function ProfileSetup() {
  const router = useRouter();
  const updateRole = useAuthStore(state => state.updateRole);

  const handleSelectRole = (role: UserRole) => {
    updateRole(role);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Typography variant="h2" style={{ marginBottom: SPACING.lg }}>Pilih Peran Anda</Typography>
      <Button title="Siswa" variant="outline" style={styles.btn} onPress={() => handleSelectRole('student')} />
      <Button title="Mahasiswa/Peneliti" variant="outline" style={styles.btn} onPress={() => handleSelectRole('researcher')} />
      <Button title="Guru/Dosen" variant="outline" style={styles.btn} onPress={() => handleSelectRole('teacher')} />
      <Button title="Pekerja Profesional" variant="outline" style={styles.btn} onPress={() => handleSelectRole('professional')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: SPACING.xl, backgroundColor: COLORS.background },
  btn: { marginBottom: SPACING.md }
});
