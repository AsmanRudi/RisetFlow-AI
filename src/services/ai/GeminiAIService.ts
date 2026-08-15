import { Platform } from 'react-native';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface AIServiceResponse {
  content: string;
  sources?: { title: string; type: string }[];
}

export class GeminiAIService {
  async chat(message: string, mode: 'belajar' | 'riset' | 'kerja', history: any[] = [], documentId: string | null = null): Promise<AIServiceResponse> {
    try {
      const formattedHistory = history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        text: msg.content
      }));

      const endpoint = documentId 
        ? `${BACKEND_URL}/api/documents/${documentId}/chat` 
        : `${BACKEND_URL}/api/chat`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          mode,
          history: formattedHistory
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan pada server AI.');
      }

      return {
        content: data.response
      };
    } catch (e) {
      console.error('GeminiAIService Error:', e);
      // Fallback message strictly according to user instructions
      throw new Error('AI sedang mengalami gangguan. Silakan coba lagi.');
    }
  }
}

export const aiService = new GeminiAIService();
