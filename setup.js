const fs = require('fs');
const path = require('path');

const files = {
  'src/store/useAppStore.ts': `import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  language: 'id' | 'en';
  hasCompletedOnboarding: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: 'id' | 'en') => void;
  completeOnboarding: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'id',
      hasCompletedOnboarding: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
`,
  'src/store/useAuthStore.ts': `import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'student' | 'researcher' | 'teacher' | 'professional' | null;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateRole: (role) => set((state) => ({ user: state.user ? { ...state.user, role } : null })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
`,
  'src/i18n/index.ts': `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import id from './locales/id.json';
import en from './locales/en.json';

const resources = {
  en: { translation: en },
  id: { translation: id },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'id', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
`,
  'src/i18n/locales/id.json': `{
  "common": {
    "welcome": "Selamat datang di RisetFlow",
    "create": "✨ Buat",
    "loading": "Memuat...",
    "error": "Terjadi masalah.",
    "retry": "Coba Lagi"
  },
  "nav": {
    "home": "Beranda",
    "workspace": "Ruang Kerja",
    "ai": "Asisten AI",
    "library": "Perpustakaan Saya",
    "profile": "Profil"
  },
  "onboarding": {
    "title1": "Semua pekerjaanmu dalam satu tempat",
    "desc1": "Catatan, dokumen, tugas, penelitian, dan project.",
    "title2": "AI yang memahami pekerjaanmu",
    "desc2": "Gunakan AI berdasarkan dokumen dan knowledge milikmu.",
    "title3": "Belajar lebih cerdas",
    "desc3": "Ubah materi menjadi rangkuman, quiz, dan flashcard.",
    "title4": "Riset tanpa kehilangan konteks",
    "desc4": "Kelola paper, literature review, citation, dan research project.",
    "title5": "Siap memulai?",
    "desc5": "Bangun workspace AI milikmu.",
    "start": "Mulai Sekarang"
  }
}`,
  'src/i18n/locales/en.json': `{
  "common": {
    "welcome": "Welcome to RisetFlow",
    "create": "✨ Create",
    "loading": "Loading...",
    "error": "Something went wrong.",
    "retry": "Try Again"
  },
  "nav": {
    "home": "Home",
    "workspace": "Workspace",
    "ai": "AI Assistant",
    "library": "My Library",
    "profile": "Profile"
  },
  "onboarding": {
    "title1": "All your work in one place",
    "desc1": "Notes, documents, tasks, research, and projects.",
    "title2": "AI that understands your work",
    "desc2": "Use AI based on your documents and knowledge.",
    "title3": "Learn smarter",
    "desc3": "Turn materials into summaries, quizzes, and flashcards.",
    "title4": "Research without losing context",
    "desc4": "Manage papers, literature reviews, citations, and research projects.",
    "title5": "Ready to start?",
    "desc5": "Build your AI workspace.",
    "start": "Start Now"
  }
}`,
  'src/constants/theme.ts': `export const COLORS = {
  primary: '#4F46E5', // Indigo for AI
  primaryLight: '#818CF8',
  success: '#10B981', // Green for progress
  warning: '#F59E0B', // Orange for focus
  danger: '#EF4444',  // Red for urgent/error
  
  // Light Theme
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  
  // Dark Theme
  darkBackground: '#111827',
  darkSurface: '#1F2937',
  darkText: '#F9FAFB',
  darkTextSecondary: '#9CA3AF',
  darkBorder: '#374151',
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
  fontFamily: 'System', // Will use Inter/System font
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  }
};
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Setup complete!');
