import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function testSingleModel(modelName) {
  const ai = new GoogleGenAI({ apiKey });
  console.log(`Testing API generateContent with model "${modelName}"...`);
  
  const response = await ai.models.generateContent({
    model: modelName,
    contents: 'Respond with JSON: {"status": "ok", "workingModel": "' + modelName + '"}',
    config: {
      responseMimeType: 'application/json'
    }
  });

  console.log('✅ API TEST SUCCESS!');
  console.log('Model:', modelName);
  console.log('Response:', response.text);
  return response.text;
}

const targetModel = process.argv[2] || 'gemini-2.0-flash';
testSingleModel(targetModel).catch((err) => {
  console.error('❌ API TEST FAILED:', err.status || err.message);
  process.exit(1);
});
