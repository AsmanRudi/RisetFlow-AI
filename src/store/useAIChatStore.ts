import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Message } from '@/features/ai/components/AIChatState';
import { useAuthStore } from './useAuthStore';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export type AIMode = 'belajar' | 'riset' | 'kerja';

export interface ChatSession {
  id: string;
  userId?: string;
  title: string;
  mode: AIMode;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface AIChatState {
  sessions: ChatSession[];
  fetchChats: () => Promise<void>;
  createSession: (mode: AIMode) => Promise<string>;
  addMessage: (sessionId: string, message: Message) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
}

export const useAIChatStore = create<AIChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      fetchChats: async () => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;
        try {
          const res = await fetch(`${BACKEND_URL}/api/chats?userId=${userId}`);
          if (res.ok) {
            const data = await res.json();
            set({ sessions: data });
          }
        } catch (e) {
          console.error("Failed to fetch chats", e);
        }
      },
      createSession: async (mode) => {
        const userId = useAuthStore.getState().user?.id || 'anonymous';
        const id = Date.now().toString();
        const newSession: ChatSession = {
          id,
          userId,
          title: `Sesi ${mode.charAt(0).toUpperCase() + mode.slice(1)} Baru`,
          mode,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        // Optimistic
        set(state => ({ sessions: [newSession, ...state.sessions] }));
        
        try {
          await fetch(`${BACKEND_URL}/api/chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSession)
          });
        } catch (e) {
          console.error("Failed to create chat session on backend", e);
        }
        
        return id;
      },
      addMessage: async (sessionId, message) => {
        // Optimistic update
        set(state => {
          const sessions = state.sessions.map(s => {
            if (s.id === sessionId) {
              return {
                ...s,
                messages: [...s.messages, message],
                updatedAt: new Date().toISOString(),
              };
            }
            return s;
          });
          return { sessions };
        });
        
        // Sync to backend
        try {
          const session = get().sessions.find(s => s.id === sessionId);
          if (session) {
            await fetch(`${BACKEND_URL}/api/chats/${sessionId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(session)
            });
          }
        } catch (e) {
          console.error("Failed to sync message to backend", e);
        }
      },
      deleteSession: async (sessionId) => {
        set(state => ({
          sessions: state.sessions.filter(s => s.id !== sessionId)
        }));
        
        try {
          await fetch(`${BACKEND_URL}/api/chats/${sessionId}`, { method: 'DELETE' });
        } catch (e) {
          console.error("Failed to delete chat session on backend", e);
        }
      },
      updateSessionTitle: async (sessionId, title) => {
        set(state => ({
          sessions: state.sessions.map(s => s.id === sessionId ? { ...s, title } : s)
        }));
        
        try {
          const session = get().sessions.find(s => s.id === sessionId);
          if (session) {
            await fetch(`${BACKEND_URL}/api/chats/${sessionId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(session)
            });
          }
        } catch (e) {
          console.error("Failed to sync title to backend", e);
        }
      }
    }),
    {
      name: 'risetflow-ai-chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
