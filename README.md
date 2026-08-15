# RisetFlow AI 🚀

**RisetFlow AI** adalah aplikasi *All-in-One* asisten pintar bertenaga AI (berbasis LLM Google Gemini) yang dirancang khusus untuk memfasilitasi kebutuhan produktivitas, riset akademis, dan proses belajar mengajar. Dibangun menggunakan **React Native (Expo)** di sisi antarmuka dan **Node.js** di sisi *backend*, aplikasi ini memadukan ekosistem ruang kerja cerdas dengan fitur interaksi data secara mendalam.

---

## 🎯 Nilai Tambah (Value Proposition)
Di era di mana informasi bertebaran secara bebas, **RisetFlow AI** tidak sekadar menjawab pertanyaan secara umum (seperti ChatGPT pada umumnya). RisetFlow AI menyediakan **Pipeline RAG (Retrieval-Augmented Generation)** lokal yang memungkinkan AI untuk "membaca" dokumen PDF Anda sendiri dan memberikan insight, rangkuman, matriks riset, hingga menguji materi berupa kuis—dengan menyebutkan rujukan langsung ke dokumen yang Anda unggah tanpa risiko halusinasi data. 

Sangat ideal dan *scalable* untuk menargetkan pangsa pasar **Mahasiswa, Dosen/Peneliti, Guru, dan Profesional**.

---

## ✨ Fitur Utama

### 🤖 1. AI Berbasis Konteks (Context-Aware AI Assistant)
AI menyesuaikan gaya komunikasi dan tingkat kedalaman analisis berdasarkan *role* yang dipilih:
- **Mode Belajar:** Tutor ramah untuk murid/mahasiswa.
- **Mode Riset:** Asisten akademis objektif untuk *Literature Review*, analisis Gap, dan ekstraksi *Research Matrix*.
- **Mode Kerja:** Asisten profesional, to-the-point, berorientasi solusi.

### 📚 2. Document Intelligence & Smart Library
- **Upload & Parsing PDF:** Otomatis mengekstrak teks, memecah *chunks*, dan melakukan *embedding* (vektorisasi) ke dalam *database*.
- **Chat With PDF:** Tanyakan apapun mengenai isi buku atau jurnal, dan AI akan merangkum serta mencari kutipan yang persis ada di dalam file Anda.

### 💼 3. Workspace Terintegrasi
- **Task & Project Management:** Manajemen tugas dan proyek yang terisolasi aman untuk setiap pengguna.
- **Notes:** Catatan cerdas yang tersinkronisasi langsung ke *backend*.

### 👤 4. Profil Pengguna Dinamis & Real-time
- **Data Tersinkronisasi & Terisolasi:** Setiap riwayat *chat*, file PDF, hingga *task* dienkripsi secara privat per-User ID di *database*.
- **Smart Autocomplete:** Terintegrasi dengan **API Universitas Global (Hipolabs)** dan **OpenStreetMap (Nominatim)** untuk pengisian data institusi dan alamat secara instan tanpa API Key berbayar.
- Dukungan penggantian *Password* yang aman dan Kalender (*Date Picker*) responsif baik pada platform *Mobile* maupun *Web*.

---

## 🛠 Teknologi di Balik RisetFlow AI (Tech Stack)

### Frontend (Mobile & Web)
- **Framework:** React Native / Expo (Cross-Platform iOS, Android, Web)
- **State Management:** Zustand (bersama integrasi *Persist Middleware* & *AsyncStorage*)
- **Routing:** Expo Router
- **UI & Styling:** Kustomisasi Vanilla CSS + komponen fungsional interaktif
- **Peta & Lokasi:** OpenStreetMap API

### Backend & AI Pipeline
- **Environment:** Node.js, Express.js
- **Database:** JSON Document-based Repository Pattern (Sangat ringan dan mudah diekspor untuk *beta testing*)
- **AI Core:** Google GenAI (Gemini 3.6 Flash & Gemini Embedding 2)
- **Data Parser:** `pdf-parse` & algoritma RAG (*Chunking* & Cosine Similarity)

---

## 📈 Peluang Bisnis & Skalabilitas (Bagi Investor & Perekrut)
1. **Model Bisnis Fleksibel:** Sangat mudah dikembangkan menjadi layanan berbasis langganan (SaaS - *Freemium to Pro*) dengan batasan jumlah dokumen atau *queries* API.
2. **Arsitektur Modular:** Backend CRUD bersifat generik (Generic Builder), sangat memudahkan penambahan fitur baru (seperti *Flashcards*, *Study Sessions*, dll.) hanya dengan 2 baris kode.
3. **Privasi Data Tinggi:** Dengan struktur *database* yang langsung mengisolasi data per-UID dari level API, aplikasi menjamin integritas riset dan keamanan data pengguna.

---
*RisetFlow AI dikembangkan untuk mengubah cara pelajar dan profesional berinteraksi dengan ribuan halaman literatur menjadi sekadar hitungan detik.* 💡
