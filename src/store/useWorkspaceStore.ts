import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { useAuthStore } from './useAuthStore';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export interface TaskModel { id: string; title: string; desc: string; priority: 'High' | 'Medium' | 'Low'; deadline: string; status: 'Pending' | 'Completed'; type: 'Tugas' | 'Belajar' | 'Kerja'; createdAt?: string; }
export interface NoteModel { id: string; title: string; content: string; date: string; tags: string[]; createdAt?: string; }
export interface ProjectModel { id: string; title: string; progress: number; tasksCount: number; desc: string; createdAt?: string; }

interface WorkspaceState {
  tasks: TaskModel[];
  notes: NoteModel[];
  projects: ProjectModel[];
  isLoading: boolean;
  
  fetchData: () => Promise<void>;

  addTask: (task: Omit<TaskModel, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<TaskModel>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  addNote: (note: Omit<NoteModel, 'id'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<NoteModel>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;

  addProject: (project: Omit<ProjectModel, 'id'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<ProjectModel>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      tasks: [],
      notes: [],
      projects: [],
      isLoading: false,

      fetchData: async () => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;
        set({ isLoading: true });
        try {
          const [resTasks, resNotes, resProj] = await Promise.all([
            fetch(`${BACKEND_URL}/api/tasks?userId=${userId}`),
            fetch(`${BACKEND_URL}/api/notes?userId=${userId}`),
            fetch(`${BACKEND_URL}/api/projects?userId=${userId}`),
          ]);
          const tasks = await resTasks.json();
          const notes = await resNotes.json();
          const projects = await resProj.json();
          set({ tasks, notes, projects });
        } catch (e) {
          console.error('Failed to fetch workspace data:', e);
        } finally {
          set({ isLoading: false });
        }
      },

      addTask: async (task) => {
        const userId = useAuthStore.getState().user?.id || 'anonymous';
        const payload = { ...task, userId };
        const res = await fetch(`${BACKEND_URL}/api/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if(res.ok) { const newTask = await res.json(); set(state => ({ tasks: [newTask, ...state.tasks] })); }
      },
      updateTask: async (id, updates) => {
        const res = await fetch(`${BACKEND_URL}/api/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
        if(res.ok) { const updated = await res.json(); set(state => ({ tasks: state.tasks.map(t => t.id === id ? updated : t) })); }
      },
      deleteTask: async (id) => {
        const res = await fetch(`${BACKEND_URL}/api/tasks/${id}`, { method: 'DELETE' });
        if(res.ok) { set(state => ({ tasks: state.tasks.filter(t => t.id !== id) })); }
      },

      addNote: async (note) => {
        const userId = useAuthStore.getState().user?.id || 'anonymous';
        const payload = { ...note, userId };
        const res = await fetch(`${BACKEND_URL}/api/notes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if(res.ok) { const newNote = await res.json(); set(state => ({ notes: [newNote, ...state.notes] })); }
      },
      updateNote: async (id, updates) => {
        const res = await fetch(`${BACKEND_URL}/api/notes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
        if(res.ok) { const updated = await res.json(); set(state => ({ notes: state.notes.map(n => n.id === id ? updated : n) })); }
      },
      deleteNote: async (id) => {
        const res = await fetch(`${BACKEND_URL}/api/notes/${id}`, { method: 'DELETE' });
        if(res.ok) { set(state => ({ notes: state.notes.filter(n => n.id !== id) })); }
      },

      addProject: async (project) => {
        const userId = useAuthStore.getState().user?.id || 'anonymous';
        const payload = { ...project, userId };
        const res = await fetch(`${BACKEND_URL}/api/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if(res.ok) { const newProj = await res.json(); set(state => ({ projects: [newProj, ...state.projects] })); }
      },
      updateProject: async (id, updates) => {
        const res = await fetch(`${BACKEND_URL}/api/projects/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
        if(res.ok) { const updated = await res.json(); set(state => ({ projects: state.projects.map(p => p.id === id ? updated : p) })); }
      },
      deleteProject: async (id) => {
        const res = await fetch(`${BACKEND_URL}/api/projects/${id}`, { method: 'DELETE' });
        if(res.ok) { set(state => ({ projects: state.projects.filter(p => p.id !== id) })); }
      },
    }),
    { name: 'risetflow-workspace-v2', storage: createJSONStorage(() => AsyncStorage) }
  )
);
