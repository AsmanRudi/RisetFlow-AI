require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenAI } = require('@google/genai');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'risetflow_super_secret_key_2026';

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return require('./db').userRepo.getById(decoded.id);
  } catch(e) {
    return null;
  }
};

const { 
  documentRepo, userRepo, chatRepo, taskRepo, noteRepo, projectRepo,
  documentChunkRepo, researchProjectRepo, researchMatrixRepo, 
  studySessionRepo, flashcardRepo, vectorRepo, transactionRepo, alertRepo
} = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

let ai;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadsDir); },
  filename: function (req, file, cb) { cb(null, uuidv4() + path.extname(file.originalname)); }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed!'), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// System prompts based on context modes
const getSystemPrompt = (mode) => {
  switch (mode) {
    case 'study':
    case 'belajar': return "Kamu adalah tutor AI yang membantu murid dan mahasiswa belajar. Jawablah dengan bahasa Indonesia yang ramah, ringkas, mudah dipahami, dan edukatif. Jangan berikan jawaban instan untuk soal ujian, berikan penjelasan logisnya. Gunakan format markdown (heading, list, bold) agar mudah dibaca.\n\nPENTING: Kamu HANYA boleh menjawab pertanyaan yang berkaitan dengan pembelajaran, pendidikan, penjelasan konsep, atau materi sekolah/kuliah. Jika pengguna bertanya di luar konteks ini (misalnya tentang pekerjaan kantor, urusan administratif, atau membuat jurnal akademis), tolak dengan sopan dan sarankan mereka untuk beralih ke 'Mode Riset' atau 'Mode Kerja'.";
    case 'research':
    case 'riset': return "Kamu adalah asisten riset AI. Jawablah dengan bahasa Indonesia yang profesional, akademis, objektif, dan faktual. JANGAN PERNAH mengarang/halusinasi data statistik empiris atau hasil penelitian jika tidak diberikan. Jika diminta membuat riset, berikan rancangan atau hipotesis awal (Judul, Latar Belakang, Rumusan Masalah, Metode), BUKAN klaim bahwa data sudah ada. Gunakan struktur Markdown (Heading, Bullet list, Numbered list).\n\nPENTING: Kamu HANYA boleh menjawab pertanyaan yang berkaitan dengan riset, penelitian, tinjauan literatur, metodologi, dan karya ilmiah/akademis. Jika pengguna bertanya tentang pelajaran dasar (seperti matematika SD/SMP) atau membuat email kerja, tolak dengan sopan dan sarankan mereka menggunakan 'Mode Belajar' atau 'Mode Kerja'.";
    case 'work':
    case 'kerja': return "Kamu adalah asisten profesional produktivitas. Jawablah dengan bahasa Indonesia yang formal, to-the-point, berorientasi solusi. Gunakan struktur markdown dengan poin-poin.\n\nPENTING: Kamu HANYA boleh menjawab pertanyaan terkait produktivitas, karir, manajemen tugas, email, penyusunan laporan kerja, jadwal, atau urusan profesional lainnya. Jika pengguna bertanya tentang teori dasar pelajaran sekolah atau merancang skripsi/penelitian akademis, tolak dengan sopan dan arahkan mereka untuk menggunakan 'Mode Belajar' atau 'Mode Riset'.";
    default: return "Kamu adalah asisten AI dari RisetFlow AI.";
  }
};

// ==========================================
// AI ENDPOINTS
// ==========================================

app.post('/api/chat', async (req, res) => {
  try {
    if (!ai) return res.status(500).json({ error: "API Key Gemini belum diatur di backend." });
    const { message, mode, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required." });

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: { systemInstruction: getSystemPrompt(mode), maxOutputTokens: 4096 },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message });
    return res.json({ response: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    if (error.status === 503) return res.status(503).json({ error: "Server Google Gemini saat ini sedang kelebihan beban (High Demand). Silakan coba beberapa saat lagi." });
    return res.status(500).json({ error: "AI sedang mengalami gangguan. Silakan coba lagi." });
  }
});

// ==========================================
// DOCUMENT ENDPOINTS
// ==========================================

app.post('/api/documents/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded or invalid file type.' });

    const user = userRepo.getAll().find(u => u.id === req.body.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    // Paywall Check
    const tier = user.subscriptionTier || 'free';
    const userDocs = documentRepo.getAll().filter(d => d.userId === user.id);
    if (tier === 'free' && userDocs.length >= 3) {
      return res.status(403).json({ error: 'Free tier hanya dapat mengunggah maksimal 3 dokumen. Silakan upgrade ke Basic atau Pro.' });
    }
    if (tier === 'basic' && userDocs.length >= 10) {
      return res.status(403).json({ error: 'Basic tier hanya dapat mengunggah maksimal 10 dokumen. Silakan upgrade ke Pro.' });
    }

    const docId = uuidv4();
    const filePath = req.file.path;
    const userId = req.body.userId;
    const docMeta = {
      id: docId,
      userId: userId,
      title: req.file.originalname.replace(/\.[^/.]+$/, ""),
      fileName: req.file.originalname,
      fileSize: req.file.size,
      status: 'Processing',
      path: filePath,
    };
    documentRepo.create(docMeta);

    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      let text = data.text.trim();
      if (!text || text.length < 10) {
        documentRepo.update(docId, { status: 'Failed', error: "Dokumen ini tidak memiliki teks yang dapat diekstrak." });
        return;
      }
      
      documentRepo.update(docId, { status: 'Processing - Chunking' });
      const { chunkText } = require('./rag');
      const chunks = chunkText(text, 1000, 200);
      
      documentRepo.update(docId, { status: 'Processing - Embedding' });
      
      for (let i = 0; i < chunks.length; i++) {
         const chunkContent = chunks[i];
         const chunkId = uuidv4();
         
         documentChunkRepo.create({
            id: chunkId,
            documentId: docId,
            content: chunkContent,
            metadata: { index: i }
         });
         
         if (ai) {
           try {
             const embeddingResult = await ai.models.embedContent({
               model: 'gemini-embedding-2',
               contents: chunkContent
             });
             
             vectorRepo.create({
               id: uuidv4(),
               chunkId: chunkId,
               documentId: docId,
               embedding: embeddingResult.embeddings[0].values
             });
           } catch (e) {
             console.error("Embedding error for chunk", i, e);
           }
         }
      }

      documentRepo.update(docId, { status: 'Ready' }); // Done
      res.json(documentRepo.getById(docId));
    } catch (err) {
      console.error(err);
      documentRepo.update(docId, { status: 'Failed' });
      res.status(500).json({ error: 'Pemrosesan dokumen gagal.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Upload dokumen gagal. Silakan coba lagi.' });
  }
});

app.get('/api/documents', (req, res) => {
  const userId = req.query.userId;
  let docs = documentRepo.getAll();
  if (userId) docs = docs.filter(doc => doc.userId === userId);
  
  docs = docs.map(doc => {
    const { extractedText, path, ...meta } = doc;
    return meta;
  });
  res.json(docs);
});

app.get('/api/documents/:id', (req, res) => {
  const doc = documentRepo.getById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });
  const { path: filePath, extractedText, ...meta } = doc;
  res.json(meta);
});

app.delete('/api/documents/:id', (req, res) => {
  const doc = documentRepo.getById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Document not found" });
  // Delete physical file if it exists
  if (doc.path && fs.existsSync(doc.path)) {
    try { fs.unlinkSync(doc.path); } catch(e) { /* ignore */ }
  }
  const success = documentRepo.delete(req.params.id);
  if (!success) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

app.post('/api/documents/:id/chat', async (req, res) => {
  try {
    if (!ai) return res.status(500).json({ error: "API Key Gemini belum diatur di backend." });
    const doc = documentRepo.getById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    if (doc.status !== 'Ready') return res.status(400).json({ error: "Dokumen tidak dapat diproses." });

    const { message, mode, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required." });

    // RAG Pipeline
    // 1. Embed query
    const queryEmbeddingResult = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: message
    });

    // 2. Retrieve Top K
    const { findTopK } = require('./rag');
    const topChunks = findTopK(queryEmbeddingResult.embeddings[0].values, vectorRepo.getAll(), documentChunkRepo.getAll(), 5, doc.id);
    
    let contextText = topChunks.map((c, i) => `[Excerpt ${i+1}]:\n${c.content}`).join("\n\n");
    if (!contextText) contextText = "No relevant context found in document.";

    const docPrompt = `\nYou are analyzing the user's uploaded document titled "${doc.title}".\nAI HANYA BOLEH MENJAWAB BERDASARKAN KONTEKS DOKUMEN BERIKUT. JANGAN MENGARANG FAKTA. Jika informasi tidak ditemukan di konteks, jawab secara eksplisit: "Informasi tersebut tidak ditemukan dalam dokumen."\n\n=== RELEVANT DOCUMENT CONTEXT ===\n${contextText}\n====================================`;
    const systemInstruction = getSystemPrompt(mode) + docPrompt;

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: { systemInstruction, maxOutputTokens: 4096 },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message });
    return res.json({ response: response.text });
  } catch (error) {
    if (error.status === 503) return res.status(503).json({ error: "Server Google Gemini saat ini sedang kelebihan beban (High Demand). Silakan coba beberapa saat lagi." });
    return res.status(500).json({ error: "AI sedang mengalami gangguan. Silakan coba lagi." });
  }
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Lengkapi semua field' });
  
  const existingUser = userRepo.getAll().find(u => u.email === email);
  if (existingUser) return res.status(400).json({ error: 'Email sudah terdaftar' });

  const hashedPwd = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
  
  const user = userRepo.create({ 
    id, name, email, password: hashedPwd, token, 
    subscriptionTier: 'free', 
    isAdmin: false 
  });
  
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser, token });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = userRepo.getAll().find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Email atau kata sandi salah' });

  let isMatch = false;
  if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    isMatch = (user.password === password);
    if (isMatch) {
       const hashed = await bcrypt.hash(password, 10);
       userRepo.update(user.id, { password: hashed });
    }
  }

  if (!isMatch) return res.status(401).json({ error: 'Email atau kata sandi salah' });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  userRepo.update(user.id, { token });
  
  const { password: _, ...safeUser } = userRepo.getById(user.id);
  res.json({ user: safeUser, token });
});

app.post('/api/auth/logout', (req, res) => {
  // Stateless dummy logout
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.put('/api/auth/profile', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  let user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });

  const { name, avatar, email, role, username, birthdate, address, institution, password } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (avatar !== undefined) updates.avatar = avatar;
  if (email !== undefined) updates.email = email;
  if (role !== undefined) updates.role = role;
  if (username !== undefined) updates.username = username;
  if (birthdate !== undefined) updates.birthdate = birthdate;
  if (address !== undefined) updates.address = address;
  if (institution !== undefined) updates.institution = institution;
  if (password) updates.password = await bcrypt.hash(password, 10);

  user = userRepo.update(user.id, updates);
  
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// ==========================================
// SUPER ADMIN ENDPOINTS
// ==========================================

const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const user = verifyToken(token);
  if (!user || !user.isAdmin) return res.status(403).json({ error: 'Forbidden: Admin access required' });
  
  req.adminUser = user;
  next();
};

app.get('/api/admin/users', requireAdmin, (req, res) => {
  const users = userRepo.getAll().map(u => {
    const { password, token, ...safeUser } = u;
    return safeUser;
  });
  res.json(users);
});

app.put('/api/admin/users/:id', requireAdmin, (req, res) => {
  const user = userRepo.getById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { subscriptionTier, isAdmin } = req.body;
  const updates = {};
  if (subscriptionTier !== undefined) updates.subscriptionTier = subscriptionTier;
  if (isAdmin !== undefined) updates.isAdmin = isAdmin;

  const updatedUser = userRepo.update(user.id, updates);
  const { password, token, ...safeUser } = updatedUser;
  res.json(safeUser);
});

app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  if (req.params.id === req.adminUser.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }
  const success = userRepo.delete(req.params.id);
  if (!success) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

  // ==========================================
  // TRANSACTIONS ENDPOINTS

  app.post('/api/transactions/upgrade', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const user = verifyToken(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    const { tier } = req.body;
    
    // Check if there is already a pending transaction
    const existing = transactionRepo.getAll().find(t => t.userId === user.id && t.status === 'pending');
    if (existing) return res.status(400).json({ error: 'Anda sudah memiliki permintaan upgrade yang sedang diproses.' });

    const trx = transactionRepo.create({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      tier: tier || 'pro',
      status: 'pending'
    });

    res.json(trx);
  });

  app.get('/api/transactions/my-pending', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const user = verifyToken(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    const pending = transactionRepo.getAll().find(t => t.userId === user.id && t.status === 'pending');
    res.json({ pending: pending || null });
  });

  app.get('/api/admin/transactions', requireAdmin, (req, res) => {
    const trxs = transactionRepo.getAll();
    res.json(trxs);
  });

  app.post('/api/admin/transactions/:id/approve', requireAdmin, (req, res) => {
    const trx = transactionRepo.getById(req.params.id);
    if (!trx) return res.status(404).json({ error: 'Transaction not found' });
    if (trx.status !== 'pending') return res.status(400).json({ error: 'Transaction is not pending' });

    transactionRepo.update(trx.id, { status: 'approved' });
    
    const user = userRepo.getById(trx.userId);
    if (user) {
      userRepo.update(user.id, { subscriptionTier: trx.tier });
    }

    res.json({ success: true, transaction: transactionRepo.getById(trx.id) });
  });

  app.post('/api/admin/transactions/:id/reject', requireAdmin, (req, res) => {
    const trx = transactionRepo.getById(req.params.id);
    if (!trx) return res.status(404).json({ error: 'Transaction not found' });
    if (trx.status !== 'pending') return res.status(400).json({ error: 'Transaction is not pending' });

    transactionRepo.update(trx.id, { status: 'rejected' });
    res.json({ success: true, transaction: transactionRepo.getById(trx.id) });
  });

  // ==========================================
  // ALERTS ENDPOINTS

  app.post('/api/admin/alerts', requireAdmin, (req, res) => {
    const { userId, message } = req.body;
    if (!userId || !message) return res.status(400).json({ error: 'userId and message required' });
    
    const user = userRepo.getById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const alert = alertRepo.create({
      userId,
      userEmail: user.email,
      userName: user.name,
      message,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
    });

    res.json(alert);
  });

  app.get('/api/admin/alerts', requireAdmin, (req, res) => {
    const alerts = alertRepo.getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(alerts);
  });

  app.put('/api/admin/alerts/:id', requireAdmin, (req, res) => {
    const { message } = req.body;
    const alert = alertRepo.getById(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    
    // reset expiry when edited so they can see it for another 5 mins
    const updated = alertRepo.update(alert.id, { 
      message,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });
    res.json(updated);
  });

  app.delete('/api/admin/alerts/:id', requireAdmin, (req, res) => {
    const success = alertRepo.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Alert not found' });
    res.json({ success: true });
  });

  app.get('/api/alerts/my-active', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const user = verifyToken(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    const now = new Date();
    // Get latest active alert for user
    const activeAlert = alertRepo.getAll().find(a => a.userId === user.id && new Date(a.expiresAt) > now);
    
    res.json({ alert: activeAlert || null });
  });

  // ==========================================
  // CRUD ENDPOINTS (Generic Builder)
// ==========================================
const createCrudEndpoints = (resourceName, repo) => {
  const basePath = `/api/${resourceName}`;

  app.get(basePath, (req, res) => {
    const userId = req.query.userId;
    let items = repo.getAll();
    if (userId) {
      items = items.filter(item => item.userId === userId);
    }
    res.json(items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  });

  app.get(`${basePath}/:id`, (req, res) => {
    const item = repo.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  });

  app.post(basePath, (req, res) => {
    const item = repo.create(req.body);
    res.json(item);
  });

  app.put(`${basePath}/:id`, (req, res) => {
    const item = repo.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  });

  app.delete(`${basePath}/:id`, (req, res) => {
    const success = repo.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  });
};

createCrudEndpoints('chats', chatRepo);
createCrudEndpoints('tasks', taskRepo);
createCrudEndpoints('notes', noteRepo);
createCrudEndpoints('projects', projectRepo);
createCrudEndpoints('research-projects', researchProjectRepo);
createCrudEndpoints('research-matrices', researchMatrixRepo);
createCrudEndpoints('study-sessions', studySessionRepo);
createCrudEndpoints('flashcards', flashcardRepo);

// ==========================================
// HELPER: Get document chunks context
// ==========================================
const getDocChunksContext = (documentId, maxChunks = 15) => {
  const chunks = documentChunkRepo.getAll().filter(c => c.documentId === documentId);
  return chunks.slice(0, maxChunks).map(c => c.content).join("\n\n");
};

const getMultiDocContext = (documentIds, maxChunksPerDoc = 10) => {
  return documentIds.map(docId => {
    const doc = documentRepo.getById(docId);
    const chunks = documentChunkRepo.getAll().filter(c => c.documentId === docId);
    const text = chunks.slice(0, maxChunksPerDoc).map(c => c.content).join("\n\n");
    return `=== DOCUMENT: "${doc ? doc.title : docId}" ===\n${text}`;
  }).join("\n\n---\n\n");
};

const geminiCall = async (systemInstruction, prompt, maxTokens = 4096) => {
  if (!ai) throw new Error("API Key Gemini belum diatur di backend.");
  const chat = ai.chats.create({
    model: 'gemini-3.6-flash',
    config: { systemInstruction, maxOutputTokens: maxTokens }
  });
  const response = await chat.sendMessage({ message: prompt });
  return response.text;
};

// ==========================================
// RESEARCH ENDPOINTS
// ==========================================

// Paper Analysis
app.post('/api/research/analysis', async (req, res) => {
  try {
    const { documentId } = req.body;
    if (!documentId) return res.status(400).json({ error: 'documentId required' });
    const doc = documentRepo.getById(documentId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const context = getDocChunksContext(documentId, 20);
    if (!context) return res.status(400).json({ error: 'No text content found for this document.' });

    const prompt = `Analisis paper/dokumen akademis berikut secara komprehensif. Berikan analisis dalam format JSON dengan field berikut:
{
  "title": "judul paper",
  "authors": "penulis (jika ditemukan)",
  "year": "tahun (jika ditemukan)",
  "objective": "tujuan penelitian",
  "methodology": "metodologi yang digunakan",
  "variables": ["variabel-variabel yang diteliti"],
  "sample": "sampel/populasi penelitian",
  "findings": ["temuan utama"],
  "limitations": ["keterbatasan penelitian"],
  "conclusion": "kesimpulan utama",
  "keywords": ["kata kunci"]
}

Jika informasi tertentu tidak ditemukan dalam teks, isi dengan "Tidak ditemukan dalam dokumen".
HANYA gunakan informasi dari konteks yang diberikan. JANGAN mengarang data.

=== DOCUMENT CONTEXT ===
${context}`;

    const result = await geminiCall(
      "You are a research analysis assistant. Analyze academic papers and return structured JSON. Only use information found in the provided context. Do NOT fabricate data.",
      prompt
    );

    res.json({ analysis: result, documentId, documentTitle: doc.title });
  } catch (err) {
    console.error("Paper analysis error:", err);
    res.status(500).json({ error: "Gagal menganalisis paper." });
  }
});

// Automatic Summary
app.post('/api/research/summary', async (req, res) => {
  try {
    const { documentId } = req.body;
    if (!documentId) return res.status(400).json({ error: 'documentId required' });
    const doc = documentRepo.getById(documentId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const context = getDocChunksContext(documentId, 20);
    const prompt = `Buatkan ringkasan komprehensif dari dokumen berikut dalam Bahasa Indonesia. Sertakan:

1. **Ringkasan Utama** (2-3 paragraf)
2. **Poin-Poin Kunci** (bullet points)
3. **Temuan Utama** (key findings)
4. **Metodologi** (jika ada)
5. **Kesimpulan**

Gunakan format markdown. HANYA berdasarkan konteks yang diberikan.

=== DOCUMENT CONTEXT ===
${context}`;

    const result = await geminiCall(
      "You are a document summarization assistant. Create comprehensive summaries in Indonesian. Only use information from the provided context.",
      prompt
    );

    res.json({ summary: result, documentId, documentTitle: doc.title });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Gagal membuat ringkasan." });
  }
});

// Research Matrix (improved: supports multiple documents)
app.post('/api/research/matrix', async (req, res) => {
  try {
    const { documentIds } = req.body;
    if (!documentIds || !documentIds.length) return res.status(400).json({ error: 'documentIds required' });

    const context = getMultiDocContext(documentIds, 10);

    const prompt = `Buatlah Research Matrix dari dokumen-dokumen berikut. Untuk SETIAP dokumen, ekstrak informasi berikut dan format sebagai JSON array:

[
  {
    "documentTitle": "judul dokumen",
    "author": "penulis",
    "year": "tahun",
    "objective": "tujuan penelitian",
    "method": "metodologi",
    "sample": "sampel/populasi",
    "variables": "variabel",
    "finding": "temuan utama",
    "limitation": "keterbatasan"
  }
]

HANYA gunakan informasi yang ditemukan dalam konteks. Jika tidak ditemukan, tulis "Tidak ditemukan".

=== DOCUMENTS ===
${context}`;

    const result = await geminiCall(
      "You are a research matrix assistant. Extract structured research information from multiple documents. Return only valid JSON array. Only use information from the provided context.",
      prompt
    );

    res.json({ matrix: result, documentIds });
  } catch (err) {
    console.error("Research matrix error:", err);
    res.status(500).json({ error: "Gagal membuat research matrix." });
  }
});

// Literature Review Generator
app.post('/api/research/literature-review', async (req, res) => {
  try {
    const { documentIds, topic } = req.body;
    if (!documentIds || !documentIds.length) return res.status(400).json({ error: 'documentIds required' });

    const context = getMultiDocContext(documentIds, 12);

    const prompt = `Buatlah tinjauan pustaka (literature review) yang komprehensif berdasarkan dokumen-dokumen berikut.${topic ? ` Topik fokus: "${topic}".` : ''}

Struktur tinjauan pustaka:
1. **Pendahuluan** - Gambaran umum topik dan pentingnya
2. **Tinjauan Literatur** - Pembahasan setiap sumber dengan sitasi (sebutkan judul dokumen/penulis)
3. **Perbandingan dan Sintesis** - Temuan yang konsisten dan berbeda antar studi
4. **Kesimpulan Tinjauan** - Ringkasan status pengetahuan saat ini

Gunakan format akademis. Setiap klaim harus menyebutkan sumber dokumennya.
HANYA berdasarkan dokumen yang diberikan. JANGAN mengarang referensi.

=== DOCUMENTS ===
${context}`;

    const result = await geminiCall(
      "You are an academic literature review writer. Write comprehensive literature reviews in Indonesian based only on the provided documents. Always cite sources by document title.",
      prompt,
      8192
    );

    res.json({ literatureReview: result, documentIds });
  } catch (err) {
    console.error("Literature review error:", err);
    res.status(500).json({ error: "Gagal membuat tinjauan pustaka." });
  }
});

// Research Gap Detection
app.post('/api/research/gap', async (req, res) => {
  try {
    const { documentIds } = req.body;
    if (!documentIds || !documentIds.length) return res.status(400).json({ error: 'documentIds required' });

    const context = getMultiDocContext(documentIds, 12);

    const prompt = `Analisis dokumen-dokumen berikut dan identifikasi:

1. **Research Gaps** - Area yang belum diteliti atau belum cukup dieksplorasi
2. **Kontradiksi** - Temuan yang bertentangan antar studi
3. **Keterbatasan Metodologi** - Kelemahan metodologi yang umum
4. **Area untuk Penelitian Lanjutan** - Topik yang perlu diteliti lebih lanjut
5. **Rekomendasi** - Saran penelitian berdasarkan gap yang ditemukan

Untuk setiap poin, sebutkan sumber dokumennya sebagai bukti pendukung.
HANYA berdasarkan dokumen yang diberikan. JANGAN mengarang.

Format output dalam markdown terstruktur.

=== DOCUMENTS ===
${context}`;

    const result = await geminiCall(
      "You are a research gap analysis expert. Identify gaps, contradictions, and unexplored areas based only on the provided documents. Always cite sources.",
      prompt,
      6144
    );

    res.json({ gaps: result, documentIds });
  } catch (err) {
    console.error("Research gap error:", err);
    res.status(500).json({ error: "Gagal mendeteksi research gap." });
  }
});

// Research Conclusion Generator
app.post('/api/research/conclusion', async (req, res) => {
  try {
    const { documentIds, researchQuestion } = req.body;
    if (!documentIds || !documentIds.length) return res.status(400).json({ error: 'documentIds required' });

    const context = getMultiDocContext(documentIds, 12);

    const prompt = `Berdasarkan dokumen-dokumen berikut, susun kesimpulan penelitian yang komprehensif.${researchQuestion ? ` Pertanyaan penelitian: "${researchQuestion}".` : ''}

Struktur kesimpulan:
1. **Ringkasan Temuan Utama** - Sintesis dari semua temuan
2. **Jawaban atas Pertanyaan Penelitian** (jika ada)
3. **Implikasi Teoritis** - Kontribusi terhadap teori
4. **Implikasi Praktis** - Aplikasi di dunia nyata
5. **Keterbatasan** - Limitasi yang perlu diakui
6. **Saran untuk Penelitian Selanjutnya**

Setiap klaim harus berdasarkan evidence dari dokumen. Sebutkan sumbernya.
JANGAN mengarang data atau fakta.

=== DOCUMENTS ===
${context}`;

    const result = await geminiCall(
      "You are an academic conclusion writer. Synthesize research findings into comprehensive conclusions in Indonesian. Only use evidence from the provided documents.",
      prompt,
      6144
    );

    res.json({ conclusion: result, documentIds });
  } catch (err) {
    console.error("Research conclusion error:", err);
    res.status(500).json({ error: "Gagal menyusun kesimpulan." });
  }
});

// ==========================================
// STUDY ENDPOINTS
// ==========================================

// Study: Explain Material
app.post('/api/study/explain', async (req, res) => {
  try {
    const { documentId, topic } = req.body;
    if (!documentId) return res.status(400).json({ error: 'documentId required' });

    const context = getDocChunksContext(documentId, 15);
    const prompt = `Jelaskan materi berikut dengan cara yang mudah dipahami oleh siswa/mahasiswa.${topic ? ` Fokus pada topik: "${topic}".` : ''}

Gunakan:
- Bahasa yang sederhana dan ramah
- Contoh konkret
- Analogi yang mudah dipahami
- Poin-poin penting yang disorot
- Diagram konseptual jika perlu (dalam teks)

HANYA berdasarkan materi yang diberikan.

=== MATERIAL ===
${context}`;

    const result = await geminiCall(
      "You are a friendly educational tutor. Explain complex material in simple, easy-to-understand Indonesian. Use examples and analogies.",
      prompt
    );

    res.json({ explanation: result, documentId });
  } catch (err) {
    console.error("Explain error:", err);
    res.status(500).json({ error: "Gagal menjelaskan materi." });
  }
});

// Study: Summary
app.post('/api/study/summary', async (req, res) => {
  try {
    const { documentId } = req.body;
    if (!documentId) return res.status(400).json({ error: 'documentId required' });

    const context = getDocChunksContext(documentId, 15);
    const prompt = `Buatkan rangkuman materi belajar berikut yang ringkas dan mudah dipahami:

1. **Ringkasan** (2-3 paragraf)
2. **Konsep Utama** (bullet points)
3. **Poin Penting yang Harus Diingat**
4. **Hubungan Antar Konsep**

Format dalam markdown yang rapi.

=== MATERIAL ===
${context}`;

    const result = await geminiCall(
      "You are a study summary assistant. Create concise, student-friendly summaries in Indonesian.",
      prompt
    );

    res.json({ summary: result, documentId });
  } catch (err) {
    console.error("Study summary error:", err);
    res.status(500).json({ error: "Gagal membuat rangkuman." });
  }
});

// Study: Quiz Generator
app.post('/api/study/quiz', async (req, res) => {
  try {
    const { documentId, count } = req.body;
    if (!documentId) return res.status(400).json({ error: 'documentId required' });

    const numQuestions = count || 5;
    const context = getDocChunksContext(documentId, 10);

    const prompt = `Buatlah ${numQuestions} soal pilihan ganda berdasarkan materi berikut. Format sebagai JSON array:

[
  {
    "question": "pertanyaan",
    "options": ["A. pilihan1", "B. pilihan2", "C. pilihan3", "D. pilihan4"],
    "answer": "A",
    "explanation": "penjelasan mengapa jawaban ini benar"
  }
]

Soal harus menguji pemahaman, bukan hanya hafalan. Variasikan tingkat kesulitan.
HANYA berdasarkan materi yang diberikan.

=== MATERIAL ===
${context}`;

    const result = await geminiCall(
      "You are an educational quiz generator. Create multiple-choice questions in Indonesian. Return only valid JSON array.",
      prompt
    );

    res.json({ quiz: result, documentId });
  } catch (err) {
    console.error("Quiz error:", err);
    res.status(500).json({ error: "Gagal membuat quiz." });
  }
});

// Study: Flashcard Generator
app.post('/api/study/flashcards', async (req, res) => {
  try {
    const { documentId, count } = req.body;
    if (!documentId) return res.status(400).json({ error: 'documentId required' });

    const numCards = count || 10;
    const context = getDocChunksContext(documentId, 10);

    const prompt = `Buatlah ${numCards} flashcard berdasarkan materi berikut. Format sebagai JSON array:

[
  {
    "front": "pertanyaan / istilah / konsep",
    "back": "jawaban / definisi / penjelasan singkat"
  }
]

Flashcard harus mencakup konsep-konsep kunci dari materi.
HANYA berdasarkan materi yang diberikan.

=== MATERIAL ===
${context}`;

    const result = await geminiCall(
      "You are a flashcard generator. Create study flashcards in Indonesian. Return only valid JSON array.",
      prompt
    );

    res.json({ flashcards: result, documentId });
  } catch (err) {
    console.error("Flashcard error:", err);
    res.status(500).json({ error: "Gagal membuat flashcard." });
  }
});

// Study: Practice Questions
app.post('/api/study/practice', async (req, res) => {
  try {
    const { documentId, type } = req.body;
    if (!documentId) return res.status(400).json({ error: 'documentId required' });

    const context = getDocChunksContext(documentId, 10);
    const questionType = type || 'mixed';

    const prompt = `Buatlah 5 soal latihan (${questionType === 'essay' ? 'essay' : questionType === 'short' ? 'jawaban singkat' : 'campuran essay dan jawaban singkat'}) berdasarkan materi berikut. Format sebagai JSON array:

[
  {
    "type": "essay" atau "short_answer",
    "question": "pertanyaan",
    "sampleAnswer": "contoh jawaban yang baik",
    "points": "poin penilaian utama"
  }
]

=== MATERIAL ===
${context}`;

    const result = await geminiCall(
      "You are an educational practice question generator. Create practice questions in Indonesian. Return only valid JSON array.",
      prompt
    );

    res.json({ questions: result, documentId });
  } catch (err) {
    console.error("Practice error:", err);
    res.status(500).json({ error: "Gagal membuat soal latihan." });
  }
});

// Study: Study Plan
app.post('/api/study/plan', async (req, res) => {
  try {
    const { documentId, daysAvailable, hoursPerDay } = req.body;
    if (!documentId) return res.status(400).json({ error: 'documentId required' });

    const days = daysAvailable || 7;
    const hours = hoursPerDay || 2;
    const context = getDocChunksContext(documentId, 15);

    const prompt = `Buatlah rencana belajar (study plan) untuk materi berikut:
- Waktu tersedia: ${days} hari
- Jam belajar per hari: ${hours} jam

Format sebagai JSON:
{
  "title": "judul rencana belajar",
  "totalDays": ${days},
  "hoursPerDay": ${hours},
  "schedule": [
    {
      "day": 1,
      "topic": "topik hari ini",
      "activities": ["aktivitas 1", "aktivitas 2"],
      "goals": "target hari ini",
      "duration": "estimasi waktu"
    }
  ],
  "tips": ["tips belajar 1", "tips 2"]
}

=== MATERIAL ===
${context}`;

    const result = await geminiCall(
      "You are a study planning assistant. Create structured study plans in Indonesian. Return only valid JSON.",
      prompt
    );

    res.json({ plan: result, documentId });
  } catch (err) {
    console.error("Study plan error:", err);
    res.status(500).json({ error: "Gagal membuat rencana belajar." });
  }
});

// Study: AI Tutor (context-aware chat for study mode)
app.post('/api/study/tutor', async (req, res) => {
  try {
    const { documentId, message, history = [] } = req.body;
    if (!documentId || !message) return res.status(400).json({ error: 'documentId and message required' });

    const context = getDocChunksContext(documentId, 10);

    const systemInstruction = `Kamu adalah tutor AI yang sabar dan ramah. Kamu sedang membantu siswa memahami materi yang sudah diberikan.

ATURAN:
1. Jawab HANYA berdasarkan materi yang diberikan
2. Jika siswa bertanya di luar materi, katakan bahwa kamu hanya bisa membantu dengan materi ini
3. Gunakan bahasa yang mudah dipahami
4. Berikan contoh dan analogi
5. Dorong siswa untuk berpikir kritis

=== MATERIAL YANG DIPELAJARI ===
${context}`;

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: { systemInstruction, maxOutputTokens: 4096 },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message });
    res.json({ response: response.text });
  } catch (err) {
    console.error("Tutor error:", err);
    res.status(500).json({ error: "AI Tutor sedang mengalami gangguan." });
  }
});

// ==========================================
// WORK ENDPOINTS
// ==========================================

// Work: Document Assistant (general document Q&A)
app.post('/api/work/document-assistant', async (req, res) => {
  try {
    const { documentId, question } = req.body;
    if (!documentId || !question) return res.status(400).json({ error: 'documentId and question required' });

    const doc = documentRepo.getById(documentId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    // RAG: embed query, find relevant chunks, answer
    let contextText = "";
    if (ai) {
      const queryEmbeddingResult = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: question
      });
      const { findTopK } = require('./rag');
      const topChunks = findTopK(queryEmbeddingResult.embeddings[0].values, vectorRepo.getAll(), documentChunkRepo.getAll(), 5, documentId);
      contextText = topChunks.map((c, i) => `[Bagian ${i + 1}]:\n${c.content}`).join("\n\n");
    }

    if (!contextText) {
      contextText = getDocChunksContext(documentId, 5);
    }

    const prompt = `Berdasarkan dokumen "${doc.title}", jawab pertanyaan berikut secara profesional:

Pertanyaan: ${question}

=== KONTEKS DOKUMEN ===
${contextText}

Jika informasi tidak ditemukan, jawab: "Informasi tersebut tidak ditemukan dalam dokumen."`;

    const result = await geminiCall(
      "You are a professional document assistant. Answer questions based only on the provided document context. Be concise and professional. Answer in Indonesian.",
      prompt
    );

    res.json({ answer: result, documentId });
  } catch (err) {
    console.error("Document assistant error:", err);
    res.status(500).json({ error: "Document assistant gagal." });
  }
});

// Work: Report Summary
app.post('/api/work/report-summary', async (req, res) => {
  try {
    const { documentId } = req.body;
    if (!documentId) return res.status(400).json({ error: 'documentId required' });
    const doc = documentRepo.getById(documentId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const context = getDocChunksContext(documentId, 15);

    const prompt = `Buatlah executive summary / ringkasan laporan dari dokumen "${doc.title}" berikut:

1. **Ringkasan Eksekutif** (1 paragraf, padat dan to-the-point)
2. **Poin-Poin Utama** (bullet points)
3. **Data/Angka Penting** (jika ada)
4. **Rekomendasi/Langkah Selanjutnya** (jika relevan)
5. **Action Items** (jika ada)

Format dalam markdown profesional.

=== DOCUMENT CONTEXT ===
${context}`;

    const result = await geminiCall(
      "You are a professional report summarization assistant. Create executive summaries in Indonesian. Be concise and action-oriented.",
      prompt
    );

    res.json({ summary: result, documentId, documentTitle: doc.title });
  } catch (err) {
    console.error("Report summary error:", err);
    res.status(500).json({ error: "Gagal membuat ringkasan laporan." });
  }
});

// Work: Knowledge Search (search across all documents)
app.post('/api/work/knowledge-search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'query required' });

    let results = [];

    if (ai) {
      const queryEmbeddingResult = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: query
      });
      const { findTopK } = require('./rag');
      const topChunks = findTopK(queryEmbeddingResult.embeddings[0].values, vectorRepo.getAll(), documentChunkRepo.getAll(), 10, null);

      results = topChunks.map(chunk => {
        // Find which document this chunk belongs to
        const allChunks = documentChunkRepo.getAll();
        const chunkRecord = allChunks.find(c => c.content === chunk.content);
        const doc = chunkRecord ? documentRepo.getById(chunkRecord.documentId) : null;
        return {
          content: chunk.content.substring(0, 300) + (chunk.content.length > 300 ? '...' : ''),
          score: chunk.score,
          documentId: chunkRecord ? chunkRecord.documentId : null,
          documentTitle: doc ? doc.title : 'Unknown'
        };
      });
    }

    // Also search notes
    const allNotes = noteRepo.getAll();
    const matchingNotes = allNotes.filter(n =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5).map(n => ({
      type: 'note',
      id: n.id,
      title: n.title,
      content: (n.content || '').substring(0, 200)
    }));

    res.json({ documentResults: results, noteResults: matchingNotes, query });
  } catch (err) {
    console.error("Knowledge search error:", err);
    res.status(500).json({ error: "Knowledge search gagal." });
  }
});

// Work: AI Work Assistant (context-aware chat for work mode)
app.post('/api/work/assistant', async (req, res) => {
  try {
    const { message, documentId, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });

    let contextText = "";
    if (documentId) {
      const doc = documentRepo.getById(documentId);
      if (doc) {
        if (ai) {
          const queryEmbeddingResult = await ai.models.embedContent({
            model: 'gemini-embedding-2',
            contents: message
          });
          const { findTopK } = require('./rag');
          const topChunks = findTopK(queryEmbeddingResult.embeddings[0].values, vectorRepo.getAll(), documentChunkRepo.getAll(), 5, documentId);
          contextText = topChunks.map((c, i) => `[Bagian ${i + 1}]:\n${c.content}`).join("\n\n");
        }
        if (!contextText) contextText = getDocChunksContext(documentId, 5);
      }
    }

    const systemInstruction = `Kamu adalah asisten kerja profesional. Bantu pengguna dengan tugas-tugas produktivitas, penulisan email, analisis laporan, dan manajemen kerja.

${contextText ? `=== KONTEKS DOKUMEN ===\n${contextText}\n===\n\nGunakan konteks dokumen di atas untuk menjawab jika relevan.` : ''}

Gunakan bahasa Indonesia yang formal dan profesional.`;

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: { systemInstruction, maxOutputTokens: 4096 },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message });
    res.json({ response: response.text });
  } catch (err) {
    console.error("Work assistant error:", err);
    res.status(500).json({ error: "Asisten kerja gagal." });
  }
});

// ==========================================
// GENERAL RAG QUERY (context-aware)
// ==========================================

app.post('/api/rag/query', async (req, res) => {
  try {
    if (!ai) return res.status(500).json({ error: "API Key Gemini belum diatur di backend." });
    const { query, documentIds, mode } = req.body;
    if (!query) return res.status(400).json({ error: 'query required' });

    // Embed query
    const queryEmbeddingResult = await ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: query
    });
    const queryVector = queryEmbeddingResult.embeddings[0].values;

    // Search across specified documents or all
    const { findTopK } = require('./rag');
    let allResults = [];

    if (documentIds && documentIds.length > 0) {
      for (const docId of documentIds) {
        const results = findTopK(queryVector, vectorRepo.getAll(), documentChunkRepo.getAll(), 3, docId);
        allResults.push(...results.map(r => ({ ...r, documentId: docId })));
      }
    } else {
      allResults = findTopK(queryVector, vectorRepo.getAll(), documentChunkRepo.getAll(), 5, null);
    }

    // Sort by score and take top results
    allResults.sort((a, b) => b.score - a.score);
    const topResults = allResults.slice(0, 5);

    const contextText = topResults.map((c, i) => `[Source ${i + 1}]:\n${c.content}`).join("\n\n");
    const systemInstruction = getSystemPrompt(mode || 'riset') + `\n\nAI HANYA BOLEH MENJAWAB BERDASARKAN KONTEKS BERIKUT. JANGAN MENGARANG FAKTA.\nJika informasi tidak ditemukan, jawab: "Informasi tersebut tidak ditemukan dalam dokumen yang tersedia."\n\n=== RELEVANT CONTEXT ===\n${contextText || "No relevant context found."}`;

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: { systemInstruction, maxOutputTokens: 4096 }
    });

    const response = await chat.sendMessage({ message: query });

    // Build sources array
    const sources = topResults.map((r, i) => {
      const chunkRecord = documentChunkRepo.getAll().find(c => c.content === r.content);
      const doc = chunkRecord ? documentRepo.getById(chunkRecord.documentId) : null;
      return {
        title: doc ? doc.title : `Source ${i + 1}`,
        type: 'document',
        score: r.score
      };
    });

    res.json({ response: response.text, sources });
  } catch (err) {
    console.error("RAG query error:", err);
    res.status(500).json({ error: "Gagal memproses pertanyaan." });
  }
});

// ==========================================
// AUTO-SUMMARY ON DOCUMENT UPLOAD STATUS CHECK
// ==========================================

app.get('/api/documents/:id/summary', async (req, res) => {
  try {
    const doc = documentRepo.getById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    if (doc.status !== 'Ready') return res.status(400).json({ error: 'Document not ready' });

    const context = getDocChunksContext(req.params.id, 15);
    const result = await geminiCall(
      "You are a document summarization assistant. Create a concise summary in Indonesian.",
      `Buatkan ringkasan singkat (3-5 kalimat) dari dokumen berikut:\n\n${context}`,
      1024
    );

    res.json({ summary: result, documentId: req.params.id });
  } catch (err) {
    console.error("Doc summary error:", err);
    res.status(500).json({ error: "Gagal membuat ringkasan." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
