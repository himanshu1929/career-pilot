import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function testAllModels() {
  try {
    const ai = new GoogleGenAI({ apiKey });

    console.log('Fetching all available models from Google GenAI SDK...');
    const response = await ai.models.list();

    const availableModels = [];
    const asyncIterable = response;

    for await (const model of asyncIterable) {
      if (model.supportedActions && model.supportedActions.includes('generateContent')) {
        const cleanName = model.name.replace('models/', '');
        availableModels.push(cleanName);
      }
    }

    console.log(`Found ${availableModels.length} models supporting generateContent:`, availableModels);

    for (const modelName of availableModels) {
      console.log(`\nTesting API call for model: "${modelName}"...`);
      try {
        const res = await ai.models.generateContent({
          model: modelName,
          contents: 'Say hello in 3 words.',
        });
        console.log(`✅ SUCCESS WITH MODEL: "${modelName}"!`);
        console.log('Output:', res.text);
        return modelName;
      } catch (err) {
        console.log(`❌ Failed "${modelName}":`, err.status || err.message.slice(0, 150));
      }
      // Wait 1 second between requests to avoid rate limit
      await new Promise(r => setTimeout(r, 1200));
    }

  } catch (err) {
    console.error('Model listing error:', err);
  }
}

testAllModels();
