require('dotenv').config();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

async function testChatbot() {
  try {
    console.log('Testing chatbot functionality...');
    
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("Error: GEMINI_API_KEY not found in environment variables.");
      return;
    }
    
    console.log('API Key found, initializing Gemini...');
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    console.log('Getting model...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Safety settings
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];
    
    // Generation config
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
    
    // System instruction
    const systemInstruction = `You are a helpful assistant for TechSolutions DFY. Your goal is to answer user questions based on the provided context. Be friendly and concise.`;
    
    console.log('Starting chat...');
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Okay, I understand. I will answer questions based on the provided context." }] },
      ],
    });
    
    console.log('Sending test message...');
    const result = await chat.sendMessage('What services do you offer?');
    
    console.log('Response received:');
    console.log(result.response.text());
    console.log('Chatbot test successful!');
  } catch (error) {
    console.error('Error testing chatbot:', error);
  }
}

testChatbot();
