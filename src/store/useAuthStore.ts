import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export type UserRole = 'student' | 'researcher' | 'teacher' | 'professional' | null;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username?: string;
  birthdate?: string;
  address?: string;
  institution?: string;
  avatar?: string;
  subscriptionTier?: 'free' | 'basic' | 'pro';
  isAdmin?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateRole: (role: UserRole) => void;
  updateProfile: (data: Partial<UserProfile> & { password?: string }) => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (res.ok) {
            set({ user: data.user, token: data.token, isAuthenticated: true });
          } else {
            throw new Error(data.error || 'Login failed');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          const data = await res.json();
          if (res.ok) {
            set({ user: data.user, token: data.token, isAuthenticated: true });
          } else {
            throw new Error(data.error || 'Register failed');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateRole: (role) => set((state) => ({ user: state.user ? { ...state.user, role } : null })),
      
      updateProfile: async (data) => {
        const { token, user } = get();
        if (!token || !user) return;
        set(state => ({ user: state.user ? { ...state.user, ...data } : null }));
        try {
          const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
          });
          if (res.ok) {
            const result = await res.json();
            set({ user: result.user });
          }
        } catch (e) {
          console.error('Update profile failed', e);
        }
      },

      fetchMe: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            set({ user: data.user });
          } else if (res.status === 401 || res.status === 403) {
            // Auto logout if token is invalid/expired
            get().logout();
          }
        } catch (e) {
          console.error('Fetch me failed', e);
        }
      },
    }),
    {
      name: 'auth-storage-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
