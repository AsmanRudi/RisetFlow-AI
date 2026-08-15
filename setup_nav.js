const fs = require('fs');
const path = require('path');

const files = {
  'src/app/_layout.tsx': `import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import '@/i18n'; // Initialize i18n

export default function RootLayout() {
  const theme = useAppStore(state => state.theme);
  // Add theme provider here if needed, or rely on internal component styling

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
`,
  'src/app/index.tsx': `import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const hasCompletedOnboarding = useAppStore(state => state.hasCompletedOnboarding);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
`,
  'src/app/(auth)/_layout.tsx': `import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="setup" />
    </Stack>
  );
}
`,
  'src/app/(auth)/onboarding.tsx': `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { SPACING, COLORS } from '@/constants/theme';

export default function Onboarding() {
  const router = useRouter();
  const completeOnboarding = useAppStore(state => state.completeOnboarding);
  const { t } = useTranslation();

  const handleStart = () => {
    completeOnboarding();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h1" align="center" style={{ marginBottom: SPACING.md }}>
          {t('onboarding.title1')}
        </Typography>
        <Typography variant="body" align="center" color={COLORS.textSecondary}>
          {t('onboarding.desc1')}
        </Typography>
      </View>
      <View style={styles.footer}>
        <Button title={t('onboarding.start')} onPress={handleStart} size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  footer: { padding: SPACING.lg, paddingBottom: SPACING.xxl }
});
`,
  'src/app/(auth)/login.tsx': `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { SPACING, COLORS } from '@/constants/theme';

export default function Login() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);

  const handleLogin = () => {
    login({ id: '1', name: 'User Test', email: 'test@example.com', role: null });
    router.replace('/(auth)/setup');
  };

  return (
    <View style={styles.container}>
      <Typography variant="h1" style={{ marginBottom: SPACING.xl }}>Login</Typography>
      <Button title="Login (Mock)" onPress={handleLogin} />
      <Button 
        title="Belum punya akun? Register" 
        variant="ghost" 
        onPress={() => router.push('/(auth)/register')} 
        style={{ marginTop: SPACING.md }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: SPACING.xl, backgroundColor: COLORS.background },
});
`,
  'src/app/(auth)/register.tsx': `import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { SPACING, COLORS } from '@/constants/theme';

export default function Register() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Typography variant="h1" style={{ marginBottom: SPACING.xl }}>Register</Typography>
      <Button title="Kembali ke Login" variant="outline" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: SPACING.xl, backgroundColor: COLORS.background },
});
`,
  'src/app/(auth)/setup.tsx': `import React from 'react';
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
`,
  'src/app/(tabs)/_layout.tsx': `import React from 'react';
import { Tabs } from 'expo-router';
import { Home, FolderKanban, Sparkles, Library, User } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const theme = useAppStore(state => state.theme);
  const isDark = theme === 'dark';
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? COLORS.darkSurface : COLORS.surface,
          borderTopColor: isDark ? COLORS.darkBorder : COLORS.border,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: isDark ? COLORS.darkTextSecondary : COLORS.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="workspace"
        options={{
          title: t('nav.workspace'),
          tabBarIcon: ({ color, size }) => <FolderKanban color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: t('nav.ai'),
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t('nav.library'),
          tabBarIcon: ({ color, size }) => <Library color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('nav.profile'),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
`,
  'src/app/(tabs)/index.tsx': `import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { useAuthStore } from '@/store/useAuthStore';
import { SPACING, COLORS } from '@/constants/theme';

export default function HomeTab() {
  const user = useAuthStore(state => state.user);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Typography variant="h2" style={styles.header}>Selamat pagi, {user?.name} 👋</Typography>
        <Typography variant="subtitle" style={styles.subtitle}>Apa yang ingin kamu selesaikan hari ini?</Typography>
        {/* Mock Focus Areas */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: SPACING.lg },
  header: { marginBottom: SPACING.xs },
  subtitle: { marginBottom: SPACING.xl }
});
`,
  'src/app/(tabs)/workspace.tsx': `import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';

export default function WorkspaceTab() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Typography variant="h2">Ruang Kerja</Typography>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: COLORS.background }, container: { flex: 1, padding: SPACING.lg } });
`,
  'src/app/(tabs)/ai.tsx': `import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';

export default function AITab() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Typography variant="h2">Asisten AI</Typography>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: COLORS.background }, container: { flex: 1, padding: SPACING.lg } });
`,
  'src/app/(tabs)/library.tsx': `import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { SPACING, COLORS } from '@/constants/theme';

export default function LibraryTab() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Typography variant="h2">Perpustakaan Saya</Typography>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: COLORS.background }, container: { flex: 1, padding: SPACING.lg } });
`,
  'src/app/(tabs)/profile.tsx': `import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import { SPACING, COLORS } from '@/constants/theme';

export default function ProfileTab() {
  const logout = useAuthStore(state => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Typography variant="h2" style={{ marginBottom: SPACING.xl }}>Profil</Typography>
        <Button title="Logout" variant="outline" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: COLORS.background }, container: { flex: 1, padding: SPACING.lg } });
`
};

// First, clean up default app directory to avoid conflicts
const appDir = path.join(__dirname, 'app');
if (fs.existsSync(appDir)) {
  fs.rmSync(appDir, { recursive: true, force: true });
}

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Navigation setup complete!');
