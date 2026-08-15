import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  lang: string;
  setLang: (lang: string) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      lang: 'id',
      hasCompletedOnboarding: false,
      activeDocumentId: null,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setLang: (lang) => set({ lang }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setActiveDocumentId: (id) => set({ activeDocumentId: id }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
