import React from 'react';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, FolderKanban, Sparkles, Library, User, Edit3, CheckSquare, Upload } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { FAB, FABAction } from '@/components/ui/FAB';
import * as DocumentPicker from 'expo-document-picker';
import { useLibraryStore } from '@/store/useLibraryStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Typography } from '@/components/ui/Typography';
import { Bell } from 'lucide-react-native';

export default function TabsLayout() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/onboarding');
    }
  }, [isAuthenticated]);

  const uploadDocument = useLibraryStore(state => state.uploadDocument);
  const [activeAlert, setActiveAlert] = React.useState<any>(null);
  const token = useAuthStore(state => state.token);
  const fetchMe = useAuthStore(state => state.fetchMe);
  const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

  React.useEffect(() => {
    fetchMe();
  }, []);

  React.useEffect(() => {
    let interval: any;
    const fetchAlert = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/alerts/my-active`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setActiveAlert(data.alert);
        }
      } catch(e) {}
    };
    fetchAlert();
    interval = setInterval(fetchAlert, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [token]);

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        let uri = file.uri;
        let mimeType = file.mimeType || 'application/pdf';
        
        try {
          await uploadDocument(uri, file.name, mimeType);
          alert('Dokumen berhasil diunggah!');
          router.push('/(tabs)/library');
        } catch (uploadErr: any) {
          alert(`Gagal mengunggah dokumen: ${uploadErr.message || 'Silakan coba lagi.'}`);
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
      alert('Gagal memilih dokumen.');
    }
  };

  // Context-aware FAB Actions
  const getFABActions = (): FABAction[] | null => {
    const iconColor = COLORS.primary;
    if (pathname === '/' || pathname === '/(tabs)') {
      return [
        { id: '1', label: 'Tanya AI', icon: <Sparkles size={20} color={iconColor} />, onPress: () => router.push('/(tabs)/ai') },
        { id: '2', label: 'Buat Catatan', icon: <Edit3 size={20} color={iconColor} />, onPress: () => router.push('/workspace/note/create') },
        { id: '3', label: 'Buat Tugas', icon: <CheckSquare size={20} color={iconColor} />, onPress: () => router.push('/workspace/task/create') },
        { id: '4', label: 'Upload PDF', icon: <Upload size={20} color={iconColor} />, onPress: handleDocumentPick },
      ];
    }
    if (pathname === '/workspace') {
      return [
        { id: '1', label: 'Buat Project', icon: <FolderKanban size={20} color={iconColor} />, onPress: () => router.push('/workspace/project/create') },
        { id: '2', label: 'Buat Task', icon: <CheckSquare size={20} color={iconColor} />, onPress: () => router.push('/workspace/task/create') },
        { id: '3', label: 'Buat Catatan', icon: <Edit3 size={20} color={iconColor} />, onPress: () => router.push('/workspace/note/create') },
      ];
    }
    if (pathname === '/library') {
      return [
        { id: '1', label: 'Upload Dokumen', icon: <Upload size={20} color={iconColor} />, onPress: handleDocumentPick },
        { id: '2', label: 'Buat Catatan', icon: <Edit3 size={20} color={iconColor} />, onPress: () => router.push('/workspace/note/create') },
      ];
    }
    return null; // No FAB for AI or Profile tabs
  };

  const fabActions = getFABActions();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDark ? COLORS.darkSurface : '#F8FAFC',
            borderTopColor: isDark ? COLORS.darkBorder : COLORS.primary + '20',
            borderTopWidth: 1,
            elevation: 10,
            height: 65 + (insets.bottom > 0 ? insets.bottom - 5 : 0),
            paddingBottom: insets.bottom > 0 ? insets.bottom - 5 : 10,
            paddingTop: 8,
          },
          tabBarItemStyle: {
            borderRadius: 16,
            marginHorizontal: 4,
            padding: 4,
          },
          tabBarActiveBackgroundColor: isDark ? COLORS.primary + '30' : COLORS.primary + '15',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600'
          },
          tabBarIconStyle: {
            marginTop: 0
          },
          tabBarActiveTintColor: isDark ? COLORS.primaryLight : COLORS.primaryDark,
          tabBarInactiveTintColor: isDark ? COLORS.darkTextSecondary : COLORS.textSecondary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="workspace"
          options={{
            title: 'Ruang Kerja',
            tabBarIcon: ({ color, size }) => <FolderKanban color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="ai"
          options={{
            title: 'Asisten AI',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.aiTabIcon, { backgroundColor: focused ? COLORS.primary : COLORS.primaryLight + '20' }]}>
                <Sparkles color={focused ? '#FFF' : COLORS.primary} size={22} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Perpustakaan',
            tabBarIcon: ({ color, size }) => <Library color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
      {fabActions && <FAB actions={fabActions} />}
      {activeAlert && (
        <View style={styles.alertBanner}>
          <Bell size={20} color="#FFF" style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Typography variant="caption" weight="bold" color="#FFF">Pesan dari Super Admin</Typography>
            <Typography variant="body" color="#FFF">{activeAlert.message}</Typography>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  aiTabIcon: {
    padding: 10,
    borderRadius: 20,
    marginBottom: 0,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  alertBanner: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 9999
  }
});
