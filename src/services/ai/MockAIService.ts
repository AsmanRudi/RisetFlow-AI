export interface AIServiceResponse {
  content: string;
  sources?: { title: string; type: string }[];
}

export class MockAIService {
  async chat(message: string, mode: 'belajar' | 'riset' | 'kerja'): Promise<AIServiceResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let content = '';
        let sources = undefined;

        if (mode === 'belajar') {
          content = `Tentu, saya akan bantu jelaskan materi ini.\n\n**Konsep Dasar**\nIni adalah konsep penting dalam pembelajaran. Jika kita menganalogikannya...\n\nApakah kamu ingin saya buatkan **quiz singkat** untuk menguji pemahamanmu?`;
        } else if (mode === 'riset') {
          content = `Berdasarkan paper yang Anda sertakan:\n\n**Tujuan Penelitian:** Mengukur efektivitas AI.\n**Metode:** Eksperimen kuantitatif.\n**Potensi Research Gap:** Belum banyak studi pada sampel pelajar sekolah dasar di area rural.`;
          sources = [{ title: 'AI in Education.pdf', type: 'paper' }];
        } else {
          content = `Berikut ringkasan meeting/tugas:\n\n- **Keputusan 1:** Revisi UI hari ini.\n- **Action Item:** Menyusun laporan mingguan.\n\nAda dokumen lain yang perlu saya ekstrak task-nya?`;
        }

        resolve({ content, sources });
      }, 1500); // Simulate network delay
    });
  }
}

export const aiService = new MockAIService();
