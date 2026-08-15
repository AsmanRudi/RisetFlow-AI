import React from 'react';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, FolderKanban, Sparkles, Library, User, Edit3, CheckSquare, Upload } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { FAB, FABAction } from '@/components/ui/FAB';
import * as DocumentPicker from 'expo-document-picker';
import { useLibraryStore } from '@/store/useLibraryStore';

export default function TabsLayout() {
  const router = useRouter();
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

// ... Inside TabsLayout ...
  const uploadDocument = useLibraryStore(state => state.uploadDocument);

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
  }
});
