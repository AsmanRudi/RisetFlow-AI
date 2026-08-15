const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.list();
    console.log(response);
  } catch (e) {
    console.error(e);
  }
}
run();
