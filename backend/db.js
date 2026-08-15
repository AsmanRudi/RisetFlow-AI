const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'db.json');

// Initialize DB with all collections if not exists
const defaultDB = {
  documents: [],
  users: [],
  chats: [],
  tasks: [],
  notes: [],
  projects: [],
  documentChunks: [],
  researchProjects: [],
  researchMatrices: [],
  studySessions: [],
  flashcards: [],
  vectors: []
};

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(defaultDB));
} else {
  // Ensure all collections exist in older DB files
  let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  let updated = false;
  Object.keys(defaultDB).forEach(key => {
    if (!data[key]) {
      data[key] = [];
      updated = true;
    }
  });
  if (updated) fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading DB:", error);
    return defaultDB;
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing DB:", error);
  }
};

const createRepo = (collectionName) => ({
  getAll: () => readDB()[collectionName] || [],
  
  getById: (id) => {
    const arr = readDB()[collectionName] || [];
    return arr.find(item => item.id === id);
  },
  
  create: (item) => {
    const db = readDB();
    if (!db[collectionName]) db[collectionName] = [];
    const newItem = { 
      ...item, 
      id: item.id || uuidv4(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString()
    };
    db[collectionName].push(newItem);
    writeDB(db);
    return newItem;
  },
  
  update: (id, updates) => {
    const db = readDB();
    if (!db[collectionName]) return null;
    const index = db[collectionName].findIndex(item => item.id === id);
    if (index !== -1) {
      db[collectionName][index] = { 
        ...db[collectionName][index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      writeDB(db);
      return db[collectionName][index];
    }
    return null;
  },

  delete: (id) => {
    const db = readDB();
    if (!db[collectionName]) return false;
    const initialLength = db[collectionName].length;
    db[collectionName] = db[collectionName].filter(item => item.id !== id);
    if (db[collectionName].length !== initialLength) {
      writeDB(db);
      return true;
    }
    return false;
  }
});

const documentRepo = createRepo('documents');
const userRepo = createRepo('users');
const taskRepo = createRepo('tasks');
const noteRepo = createRepo('notes');
const projectRepo = createRepo('projects');
const documentChunkRepo = createRepo('documentChunks');
const researchProjectRepo = createRepo('researchProjects');
const researchMatrixRepo = createRepo('researchMatrices');
const studySessionRepo = createRepo('studySessions');
const flashcardRepo = createRepo('flashcards');
const vectorRepo = createRepo('vectors');
const chatRepo = createRepo('chats');

module.exports = { 
  documentRepo,
  userRepo,
  chatRepo,
  taskRepo,
  noteRepo,
  projectRepo,
  documentChunkRepo,
  researchProjectRepo,
  researchMatrixRepo,
  studySessionRepo,
  flashcardRepo,
  vectorRepo
};
