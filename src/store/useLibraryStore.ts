import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { useAuthStore } from './useAuthStore';

// Define the real document type coming from backend Phase 3
export interface DocumentModel {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  status: 'Uploading' | 'Processing' | 'Ready' | 'Failed';
  createdAt: string;
  updatedAt: string;
}

interface LibraryState {
  documents: DocumentModel[];
  isLoading: boolean;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (fileUri: string, fileName: string, mimeType: string) => Promise<DocumentModel>;
  deleteDocument: (id: string) => Promise<void>;
}

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      documents: [],
      isLoading: false,
      fetchDocuments: async () => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;
        set({ isLoading: true });
        try {
          const res = await fetch(`${BACKEND_URL}/api/documents?userId=${userId}`);
          if(res.ok) {
            const data = await res.json();
            set({ documents: data });
          }
        } catch (e) {
          console.error("Failed to fetch documents", e);
        } finally {
          set({ isLoading: false });
        }
      },
      uploadDocument: async (fileUri, fileName, mimeType) => {
        // Optimistic UI for uploading status
        const tempId = `temp-${Date.now()}`;
        const tempDoc: DocumentModel = {
          id: tempId,
          title: fileName.replace(/\.[^/.]+$/, ""),
          fileName,
          fileSize: 0,
          status: 'Uploading',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(state => ({ documents: [tempDoc, ...state.documents] }));
        
        try {
          const userId = useAuthStore.getState().user?.id || 'anonymous';
          const formData = new FormData();
          formData.append('userId', userId);

          if (Platform.OS === 'web') {
            // Web: fetch the blob from the URI and append as File
            const response = await fetch(fileUri);
            const blob = await response.blob();
            formData.append('document', blob, fileName);
          } else {
            // React Native (Android/iOS): use uri/name/type object
            formData.append('document', {
              uri: fileUri,
              name: fileName,
              type: mimeType
            } as any);
          }

          const res = await fetch(`${BACKEND_URL}/api/documents/upload`, {
            method: 'POST',
            body: formData,
            // Do NOT set Content-Type header — let fetch auto-set multipart boundary
          });
          
          if (!res.ok) {
            const errBody = await res.text();
            throw new Error(`Upload failed: ${res.status} ${errBody}`);
          }
          
          const uploadedDoc = await res.json();
          // Replace temp doc with uploaded doc (which is in 'Processing' or 'Ready' state)
          set(state => ({
            documents: state.documents.map(d => d.id === tempId ? uploadedDoc : d)
          }));
          return uploadedDoc;
        } catch (e) {
          console.error("Upload error", e);
          set(state => ({
            documents: state.documents.map(d => d.id === tempId ? { ...d, status: 'Failed' } : d)
          }));
          throw e;
        }
      },
      deleteDocument: async (id: string) => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/documents/${id}`, { method: 'DELETE' });
          if (res.ok) {
            set(state => ({ documents: state.documents.filter(d => d.id !== id) }));
          }
        } catch (e) {
          console.error("Delete document error", e);
        }
      }
    }),
    { name: 'risetflow-library-v2', storage: createJSONStorage(() => AsyncStorage) }
  )
);
