import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Lock, Calendar as CalendarIcon, MapPin, Building2, Camera, Search, X, Briefcase, Shield } from 'lucide-react-native';
import { SPACING, COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

// Custom AutoComplete Modal Component
interface AutocompleteModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (val: string) => void;
  title: string;
  fetchSuggestions: (q: string) => Promise<{label: string}[]>;
  placeholder: string;
  isDark: boolean;
}

const AutocompleteModal = ({ visible, onClose, onSelect, title, fetchSuggestions, placeholder, isDark }: AutocompleteModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{label: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setQuery('');
      setResults([]);
    }
  }, [visible]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        const data = await fetchSuggestions(query);
        setResults(data);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
          <View style={styles.modalHeader}>
            <Typography variant="h3" weight="bold">{title}</Typography>
            <TouchableOpacity onPress={onClose}><X size={24} color={isDark ? COLORS.darkText : COLORS.text} /></TouchableOpacity>
          </View>
          
          <Input 
            placeholder={placeholder} 
            value={query} 
            onChangeText={setQuery} 
            icon={<Search size={20} color={COLORS.textSecondary} />} 
          />
          
          {loading && <ActivityIndicator style={{ marginTop: SPACING.md }} color={COLORS.primary} />}
          
          <FlatList
            data={results}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.resultItem, { borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}
                onPress={() => onSelect(item.label)}
              >
                <Typography>{item.label}</Typography>
              </TouchableOpacity>
            )}
            style={{ marginTop: SPACING.md }}
            ListFooterComponent={() => query.length > 0 ? (
              <TouchableOpacity 
                style={[styles.resultItem, { borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}
                onPress={() => onSelect(query)}
              >
                <Typography color={COLORS.primary} weight="bold">Gunakan teks "{query}"</Typography>
              </TouchableOpacity>
            ) : null}
          />
        </View>
      </View>
    </Modal>
  );
};

export default function EditProfileScreen() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const { user, updateProfile, fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, []);

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [birthdate, setBirthdate] = useState(user?.birthdate || '');
  const [address, setAddress] = useState(user?.address || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [role, setRole] = useState(user?.role || 'student');

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUnivModal, setShowUnivModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const ROLES = [
    { value: 'student', label: 'Mahasiswa / Murid' },
    { value: 'researcher', label: 'Dosen / Peneliti' },
    { value: 'teacher', label: 'Guru' },
    { value: 'professional', label: 'Pekerja Profesional' }
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      const payload: any = {
        name,
        username,
        email,
        birthdate,
        address,
        institution,
        role,
        avatar: avatar || undefined
      };
      if (password) payload.password = password;
      
      updateProfile(payload);
      setLoading(false);
      alert('Profil berhasil diperbarui!');
      router.back();
    }, 800);
  };

  const handlePickAvatar = async () => {
    try {
      const ImagePicker = await import('expo-image-picker');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setAvatar(base64Image);
      }
    } catch(e) { 
      alert('Gagal membuka galeri'); 
    }
  };

  const fetchUniversities = async (q: string) => {
    try {
      const res = await fetch(`http://universities.hipolabs.com/search?country=Indonesia&name=${encodeURIComponent(q)}`);
      const data = await res.json();
      return data.slice(0, 10).map((u: any) => ({ label: u.name }));
    } catch (e) {
      return [];
    }
  };

  const fetchAddresses = async (q: string) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=id`);
      const data = await res.json();
      return data.slice(0, 10).map((a: any) => ({ label: a.display_name }));
    } catch (e) {
      return [];
    }
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formatted = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth()+1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
      setBirthdate(formatted);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background }]}>
      <Header title="Edit Profil" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={styles.avatarSection}>
            <View style={styles.avatarLarge}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={{ width: 100, height: 100, borderRadius: 50 }} />
              ) : (
                <User size={40} color={COLORS.primary} />
              )}
              <TouchableOpacity style={styles.cameraBtn} onPress={handlePickAvatar}>
                <Camera size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Typography variant="body" color={COLORS.primary} style={{ marginTop: SPACING.sm }} onPress={handlePickAvatar}>
              Ubah Foto Profil
            </Typography>
          </View>

          <View style={styles.formGroup}>
            <Typography variant="caption" weight="bold" color={COLORS.textSecondary} style={styles.label}>Nama Lengkap</Typography>
            <Input placeholder="Nama Lengkap" value={name} onChangeText={setName} icon={<User size={20} color={COLORS.textSecondary} />} />
          </View>

          <View style={styles.formGroup}>
            <Typography variant="caption" weight="bold" color={COLORS.textSecondary} style={styles.label}>Username</Typography>
            <Input placeholder="username_anda" value={username} onChangeText={setUsername} autoCapitalize="none" icon={<Typography color={COLORS.textSecondary} style={{ fontSize: 18 }}>@</Typography>} />
          </View>

          <View style={styles.formGroup}>
            <Typography variant="caption" weight="bold" color={COLORS.textSecondary} style={styles.label}>Email</Typography>
            <Input placeholder="Email Anda" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" icon={<Mail size={20} color={COLORS.textSecondary} />} />
          </View>

          <View style={styles.formGroup}>
            <Typography variant="caption" weight="bold" color={COLORS.textSecondary} style={styles.label}>Tanggal Lahir</Typography>
            {Platform.OS === 'web' ? (
              <View style={[styles.inputWrapper, { borderColor: isDark ? COLORS.darkBorder : COLORS.border, backgroundColor: isDark ? COLORS.darkSurface : '#FFF', paddingVertical: 12 }]}>
                <CalendarIcon size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <input 
                  type="date" 
                  value={birthdate ? birthdate.split('/').reverse().join('-') : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split('-');
                      setBirthdate(`${d}/${m}/${y}`);
                    } else {
                      setBirthdate('');
                    }
                  }}
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: isDark ? '#FFF' : '#000', fontSize: 16 }}
                />
              </View>
            ) : (
              <>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
                  <View pointerEvents="none">
                    <Input placeholder="Pilih Tanggal Lahir" value={birthdate} editable={false} icon={<CalendarIcon size={20} color={COLORS.textSecondary} />} />
                  </View>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )}
              </>
            )}
          </View>

          <View style={styles.formGroup}>
            <Typography variant="caption" weight="bold" color={COLORS.textSecondary} style={styles.label}>Alamat Lengkap (Pencarian Otomatis)</Typography>
            <TouchableOpacity onPress={() => setShowAddressModal(true)} activeOpacity={0.8}>
              <View pointerEvents="none">
                <Input placeholder="Cari Alamat" value={address} editable={false} icon={<MapPin size={20} color={COLORS.textSecondary} />} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Typography variant="caption" weight="bold" color={COLORS.textSecondary} style={styles.label}>Pekerjaan / Status</Typography>
            <TouchableOpacity onPress={() => setShowRoleModal(true)} activeOpacity={0.8}>
              <View pointerEvents="none">
                <Input 
                  placeholder="Pilih Pekerjaan" 
                  value={ROLES.find(r => r.value === role)?.label || ''} 
                  editable={false} 
                  icon={<Briefcase size={20} color={COLORS.textSecondary} />} 
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Typography variant="caption" weight="bold" color={COLORS.textSecondary} style={styles.label}>Tempat Kuliah / Institusi</Typography>
            <TouchableOpacity onPress={() => setShowUnivModal(true)} activeOpacity={0.8}>
              <View pointerEvents="none">
                <Input placeholder="Cari Kampus atau Institusi" value={institution} editable={false} icon={<Building2 size={20} color={COLORS.textSecondary} />} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Typography variant="caption" weight="bold" color={COLORS.textSecondary} style={styles.label}>Ubah Password (Opsional)</Typography>
            <Input placeholder="Masukkan password baru" value={password} onChangeText={setPassword} secureTextEntry icon={<Lock size={20} color={COLORS.textSecondary} />} />
          </View>

          <View style={{ height: SPACING.xl }} />

          <Button title="Simpan Perubahan" onPress={handleSave} disabled={loading || !name} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <AutocompleteModal
        visible={showUnivModal}
        onClose={() => setShowUnivModal(false)}
        title="Cari Institusi"
        placeholder="Ketik nama kampus..."
        fetchSuggestions={fetchUniversities}
        isDark={isDark}
        onSelect={(val) => { setInstitution(val); setShowUnivModal(false); }}
      />

      <AutocompleteModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Cari Alamat"
        placeholder="Ketik alamat atau area..."
        fetchSuggestions={fetchAddresses}
        isDark={isDark}
        onSelect={(val) => { setAddress(val); setShowAddressModal(false); }}
      />

      <Modal visible={showRoleModal} animationType="slide" transparent={true}>
        <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? COLORS.darkBackground : COLORS.background, height: '50%' }]}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" weight="bold">Pilih Status / Pekerjaan</Typography>
              <TouchableOpacity onPress={() => setShowRoleModal(false)}><X size={24} color={isDark ? COLORS.darkText : COLORS.text} /></TouchableOpacity>
            </View>
            <FlatList
              data={ROLES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.resultItem, { borderBottomColor: isDark ? COLORS.darkBorder : COLORS.border }]}
                  onPress={() => { setRole(item.value as any); setShowRoleModal(false); }}
                >
                  <Typography weight={role === item.value ? 'bold' : 'normal'} color={role === item.value ? COLORS.primary : (isDark ? '#FFF' : '#000')}>
                    {item.label}
                  </Typography>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg },
  avatarSection: { alignItems: 'center', marginBottom: SPACING.xl },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primaryLight + '20', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
  formGroup: { marginBottom: SPACING.md },
  label: { marginBottom: SPACING.xs, marginLeft: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.lg, height: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  resultItem: { paddingVertical: SPACING.md, borderBottomWidth: 1 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: SPACING.md },
  inputIcon: { marginRight: SPACING.sm },
  flexInput: { flex: 1, borderWidth: 0, paddingHorizontal: 0, backgroundColor: 'transparent' }
});
