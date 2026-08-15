# Product Requirements Document (PRD) - RisetFlow AI 🚀

## 1. Ringkasan Eksekutif & Visi
**RisetFlow AI** adalah platform ekosistem cerdas berbasis AI yang dirancang untuk pelajar, dosen, peneliti, dan profesional. Visi dari produk ini adalah menjadi satu pintu (*all-in-one workspace*) untuk mengelola produktivitas sekaligus berinteraksi dengan ribuan lembar literatur secara presisi menggunakan teknologi *Retrieval-Augmented Generation* (RAG) tanpa ada halusinasi data.

---

## 2. Fase 1: Selesai Dikerjakan (Current State)
Ini adalah status fitur yang telah sukses kita selesaikan dan siap digunakan pada Fase 1:

### 2.1. Autentikasi & Manajemen Profil Dinamis
- ✅ Registrasi & Login (berbasis Tokenisasi JWT terisolasi per-User).
- ✅ Manajemen Profil Dinamis dengan kalender otomatis (*Date Picker* multi-platform).
- ✅ *Smart Autocomplete* terintegrasi OpenStreetMap (Alamat) & Hipolabs (Universitas).
- ✅ Fitur ganti *password* dan pemilihan *Role* (Mahasiswa/Dosen/Guru/Profesional).

### 2.2. Manajemen Ruang Kerja (Workspace)
- ✅ Sistem CRUD penuh untuk mengelola *Projects*, *Tasks* (To-Do List), dan *Notes*.
- ✅ Keamanan data terenkapsulasi penuh berdasarkan UID pengguna.

### 2.3. RAG Pipeline & Document Intelligence
- ✅ Ekstraksi teks otomatis dari unggahan PDF (`pdf-parse`).
- ✅ Vektorisasi cerdas (*Embedding*) teks menjadi pecahan matriks yang dapat ditelusuri.
- ✅ *Chat With PDF*: Mengobrol dan menanyakan isi dokumen secara presisi.

### 2.4. Ekosistem AI Berbasis Konteks
- ✅ 3 Mode Utama AI: **Belajar** (Ramah & Edukatif), **Riset** (Akademis & Faktual), dan **Kerja** (Profesional & Praktis).
- ✅ **Research Tools:** *Paper Analysis, Literature Review, Matrix Builder, Gap Detection, Conclusion Synthesis*.
- ✅ **Study Tools:** *Explain Material, Summary, Auto-Quiz, Auto-Flashcards*.

---

## 3. Analisis Kondisi Proyek Saat Ini
Berdasarkan sistem yang telah berjalan, berikut adalah analisis teknis untuk menentukan arah pengembangan:
- **Kekuatan (Strengths)**: *Backend Generic Builder* kita sangat modular. Penambahan Endpoint baru hanya butuh 2 baris kode. Pipeline AI RAG berjalan mulus.
- **Kelemahan (Weaknesses)**: *Database* saat ini masih menggunakan penyimpanan JSON di sistem file (*file-based*). Sangat ringan untuk *Beta Testing*, namun berisiko konflik (*race condition*) jika digunakan ratusan pengguna bersamaan. *Password* belum di-*hash*.
- **Peluang (Opportunities)**: Belum banyak kompetitor di ranah akademis Indonesia yang menggabungkan *Workspace* Trello/Notion dengan *AI PDF Reader* sekaligus.

---

## 4. Fase 2: Rencana Pengembangan Selanjutnya (Next Target)
Agar tidak melenceng, pengembangan kita berikutnya akan dibagi menjadi 3 prioritas utama yang berurutan:

### Prioritas 1: Sistem Langganan & Super Admin [SELESAI ✅]
*(Fokus: Persiapan Monetisasi & Kontrol Keamanan)*
1. **Model Database & Paywall**: Menerapkan tingkatan `free`, `basic`, dan `pro` pada *user model* serta mengunci fitur *upload* berdasarkan tier.
2. **Super Admin Dashboard**: Membuat peran khusus admin dan layar dasbor untuk memantau/mengelola tier seluruh pengguna.

### Prioritas 1B: Modernisasi Database & Keamanan 
*(Fokus: Persiapan Produksi Skala Besar)*
1. **Migrasi Database**: Mengganti sistem baca/tulis `db.json` dengan sistem database sungguhan seperti **SQLite** (untuk lokal) atau **MongoDB/PostgreSQL**.
2. **Kriptografi Keamanan**: Menggunakan `bcrypt` untuk melakukan enkripsi/hashing *password* pengguna saat login/register.
3. **Validasi JWT Asli**: Mengganti "dummy token" dengan *JSON Web Token* bersertifikat yang memiliki waktu kadaluarsa (*expiration*).

### Prioritas 2: Implementasi Antarmuka "Study & Research Tools" (*Frontend Interactivity*)
*(Fokus: Menghidupkan fitur AI ke dalam wujud visual yang nyata di UI)*
1. **Flashcard Deck UI**: Saat ini AI sudah bisa merancang flashcard JSON, namun antarmuka kartu (*Card Flip* animasi depan/belakang) untuk latihan hapalan belum diimplementasikan di sisi pengguna.
2. **Interactive Quiz Engine**: Menyajikan layar khusus di mana pengguna bisa menjawab kuis hasil tebakan AI dengan sistem skor *real-time*.
3. **Multi-Document Synthesis**: Membuat antarmuka di mana pengguna dapat memilih lebih dari satu dokumen (mencentang 3 jurnal), lalu AI melakukan perbandingan (*Literature Review*) di layar.

### Prioritas 3: Polish Animasi, Audio, & Ekspor Data (*User Experience*)
*(Fokus: Premium Feel & Retensi Pengguna)*
1. **TTS (Text-to-Speech)**: Opsi agar AI membacakan hasil kuis/rangkuman belajar menggunakan suara (*Voice Assistant*).
2. **Export to PDF/Word**: Fitur tombol **Download** agar hasil *Literature Review* atau *Research Matrix* bisa langsung di-ekspor pengguna ke format Microsoft Word atau Excel.
3. **Dark/Light Mode Sync**: Transisi mulus di seluruh komponen aplikasi yang merespons preferensi OS HP pengguna.

---

## 5. Fase 3: Fitur Kompetitif & Diferensiasi Pasar (Advanced LLM Capabilities)
Untuk memastikan **RisetFlow AI** mampu bersaing di pasar LLM global (melawan ChatGPT, Claude, atau Perplexity) dan tetap relevan bagi *Mahasiswa, Dosen, Guru, dan Pekerja*, berikut adalah *roadmap* fitur inovatif jangka panjang:

### 5.1. *Autonomous Agentic Workflows* (Agen Otonom)
- **Auto-Literature Reviewer**: Pekerja/Peneliti dapat mengunggah 20 PDF, lalu meninggalkan aplikasi. AI Agent akan bekerja di latar belakang (selama beberapa jam) untuk membaca seluruh PDF dan menyusun *Full Literature Review* 15 halaman secara mandiri.
- **Smart Web Researcher**: Jika dokumen kurang lengkap, AI dapat mencari jurnal tambahan secara *real-time* di internet (terkoneksi dengan *Google Scholar* atau *Semantic Scholar* API) untuk melengkapi argumen.

### 5.2. Kolaborasi Tim & Institusi (*Multiplayer Workspace*)
- **Shared Research Board**: Mahasiswa atau tim pekerja dapat berbagi satu *workspace* proyek, di mana semua anggota dapat "mengobrol" dengan dokumen PDF yang sama.
- **Tutor Bersama (Co-Pilot)**: Guru dapat membuat "Ruang Belajar" (*Study Room*) yang diisi oleh murid-muridnya, dan AI akan menguji kuis mereka secara serentak.

### 5.3. Integrasi Ekosistem Riset & Produktivitas
- **Citation Manager Sync**: Integrasi langsung dengan **Mendeley** atau **Zotero** agar sitasi otomatis tersusun dalam format APA, MLA, atau IEEE.
- **Cloud Drive Connect**: Integrasi Google Drive / OneDrive untuk menarik dokumen secara langsung tanpa perlu proses *download-upload* manual.

### 5.4. *Multimodal & OCR (Optical Character Recognition)*
- **Voice-to-Text & Text-to-Voice (Voice Assistant)**: Pengguna bisa melakukan riset atau tanya jawab saat mengemudi/berjalan menggunakan suara (seperti *ChatGPT Voice*).
- **Handwriting OCR**: Mahasiswa dapat memfoto catatan tulisan tangan di papan tulis, lalu AI akan merangkum dan mendigitalkannya secara instan.
- **Chart & Image Analysis**: AI tidak hanya membaca teks PDF, namun bisa menganalisa makna dari grafik, diagram batang, atau gambar di dalam jurnal/laporan kerja.

---

### 5.5. Pembaruan Selesai (Fase 2.5 - Keamanan & Admin)
- **Sistem Keamanan Lapis Baja**: Autentikasi sepenuhnya menggunakan **JWT** dan enkripsi *password* menggunakan **Bcrypt**. Auto-migration untuk sandi *plaintext* lama saat *login*.
- **Super Admin Dashboard**: Manajemen terpusat untuk Data Pengguna, Konfirmasi Pembayaran Pro, dan Pengiriman Notifikasi/Pesan massal ke pengguna (Banners).
- **Pro Tools Hub & Paywall**: Antarmuka Pusat Komando Pro (dengan 3 pilar: Multi-Doc, Auto-Agent, Web Researcher) yang diamankan oleh *ProGuard*. Bypass otomatis diterapkan khusus untuk Super Admin.
- **Auto-Logout Security**: Klien akan otomatis didepak ke layar *login* dan dipaksa untuk re-autentikasi jika JWT kadaluarsa atau terdapat ketidaksesuaian otoritas.

---
**Catatan untuk Kolaborasi**: Harap perbarui dokumen PRD ini jika ada penambahan fitur baru yang diusulkan agar arah perancangan RisetFlow AI tetap berada di jalurnya.
