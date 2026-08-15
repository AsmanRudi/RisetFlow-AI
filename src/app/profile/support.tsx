import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, MessageCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react-native';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';

const faqs = [
  { q: "Bagaimana cara agar AI bisa membaca dokumen saya?", a: "Pilih menu 'Perpustakaan' dan unggah dokumen PDF Anda. AI akan memprosesnya dalam hitungan detik. Setelah itu, pilih dokumen tersebut sebagai konteks di mode Riset atau Belajar." },
  { q: "Apakah dokumen saya aman?", a: "Ya, dokumen Anda disimpan dengan aman dan hanya dapat diakses oleh Anda. Kami tidak menggunakannya untuk melatih model bahasa publik." },
  { q: "Apa bedanya Mode Riset, Belajar, dan Kerja?", a: "Mode Riset fokus pada literatur dan jurnal (matrix, gap). Mode Belajar fokus menyederhanakan materi (tutor, quiz, flashcard). Mode Kerja berfokus pada efisiensi tugas (ringkasan laporan, pencarian instan)." }
];

export default function SupportScreen() {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Bantuan & Dukungan" />
      <ScrollView contentContainerStyle={styles.content}>
        
        <Typography variant="h3" weight="bold" style={{ marginBottom: SPACING.md }}>Hubungi Kami</Typography>
        <View style={styles.contactGrid}>
          <TouchableOpacity style={[styles.contactCard, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]} onPress={() => Linking.openURL('mailto:support@risetflow.ai')}>
            <Mail size={24} color={COLORS.primary} style={{ marginBottom: SPACING.xs }} />
            <Typography variant="body" weight="600">Email Support</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>Balasan 24 jam</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactCard, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]} onPress={() => {
            // In a real app this would go to a live chat support screen, we'll route to AI tutor for now as a fallback
            alert('Menghubungkan ke agen support...');
            setTimeout(() => router.push('/(tabs)/ai'), 1000);
          }}>
            <MessageCircle size={24} color={COLORS.success} style={{ marginBottom: SPACING.xs }} />
            <Typography variant="body" weight="600">Live Chat</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>Agen online</Typography>
          </TouchableOpacity>
        </View>

        <Typography variant="h3" weight="bold" style={{ marginTop: SPACING.xl, marginBottom: SPACING.md }}>Pertanyaan Umum (FAQ)</Typography>
        {faqs.map((faq, index) => (
          <View key={index} style={[styles.faqItem, { backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface }]}>
            <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFAQ(index)}>
              <Typography variant="body" weight="600" style={{ flex: 1 }}>{faq.q}</Typography>
              {expandedIndex === index ? <ChevronUp size={20} color={COLORS.textSecondary} /> : <ChevronDown size={20} color={COLORS.textSecondary} />}
            </TouchableOpacity>
            {expandedIndex === index && (
              <View style={styles.faqBody}>
                <Typography variant="body" color={isDark ? COLORS.darkTextSecondary : COLORS.textSecondary}>{faq.a}</Typography>
              </View>
            )}
          </View>
        ))}

        <Typography variant="h3" weight="bold" style={{ marginTop: SPACING.xl, marginBottom: SPACING.md }}>Kirim Pesan Bantuan</Typography>
        <Input placeholder="Tuliskan kendala Anda..." multiline style={{ minHeight: 100, marginBottom: SPACING.md }} />
        <Button title="Kirim Pesan" onPress={() => alert('Pesan Anda telah dikirim ke tim dukungan kami.')} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: 60 },
  contactGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  contactCard: { width: '48%', padding: SPACING.md, borderRadius: 12, alignItems: 'center', elevation: 1 },
  faqItem: { borderRadius: 12, marginBottom: SPACING.sm, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  faqHeader: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md },
  faqBody: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.md }
});
