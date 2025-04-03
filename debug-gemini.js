require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API connection...');
    
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("Error: GEMINI_API_KEY not found in environment variables.");
      return;
    }
    
    console.log('API Key found, initializing Gemini...');
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    console.log('Getting model...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log('Sending test prompt...');
    const result = await model.generateContent('Say hello in one word');
    
    console.log('Response received:');
    console.log(result.response.text());
    console.log('Gemini API test successful!');
  } catch (error) {
    console.error('Error testing Gemini API:', error);
  }
}

testGeminiAPI();
