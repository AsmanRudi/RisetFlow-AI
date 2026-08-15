const { v4: uuidv4 } = require('uuid');

// Basic text splitter that breaks text into paragraphs, then groups them into chunks
const chunkText = (text, maxChunkSize = 1000, overlap = 200) => {
  if (!text) return [];
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let currentChunk = "";

  for (let p of paragraphs) {
    if ((currentChunk.length + p.length) > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      // Keep overlap from the end of the previous chunk
      const overlapStart = Math.max(0, currentChunk.length - overlap);
      currentChunk = currentChunk.substring(overlapStart) + "\n\n" + p;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + p;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
};

// Calculate Cosine Similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Find Top K chunks by similarity
const findTopK = (queryVector, vectorStore, documentChunksStore, topK = 5, documentIdFilter = null) => {
  let relevantVectors = vectorStore;
  
  if (documentIdFilter) {
    // We need to map which vectors belong to which document, assuming vector obj has documentId
    relevantVectors = vectorStore.filter(v => v.documentId === documentIdFilter);
  }

  const scored = relevantVectors.map(v => ({
    chunkId: v.chunkId,
    score: cosineSimilarity(queryVector, v.embedding)
  }));

  scored.sort((a, b) => b.score - a.score);
  
  const topKScored = scored.slice(0, topK);
  
  // Resolve chunk IDs to actual chunk text
  return topKScored.map(s => {
    const chunk = documentChunksStore.find(c => c.id === s.chunkId);
    return {
      score: s.score,
      content: chunk ? chunk.content : "",
      metadata: chunk ? chunk.metadata : {}
    };
  }).filter(r => r.content !== "");
};

module.exports = {
  chunkText,
  cosineSimilarity,
  findTopK
};
