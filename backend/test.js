require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  const models = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.7-flash'];
  for (const model of models) {
    try {
      const chat = ai.chats.create({ model });
      const res = await chat.sendMessage({ message: 'Hi' });
      console.log(`${model} success:`, res.text);
    } catch (e) {
      console.error(`${model} error:`, e.status, e.message);
    }
  }
}
run();
