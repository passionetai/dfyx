require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// Configure Gemini
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY not found in environment variables.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log('Received chat request');
    const { message, history } = req.body;
    
    if (!message) {
      console.log('Error: Message is required');
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log('Message:', message);
    console.log('History length:', history ? history.length : 0);
    
    // System instruction
    const systemInstruction = `You are a helpful assistant for TechSolutions DFY. Your goal is to answer user questions helpfully. Be friendly and concise.`;
    
    // Start chat
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "I understand. I'll be a helpful assistant for TechSolutions DFY." }] },
        ...(Array.isArray(history) ? history : [])
      ],
    });
    
    console.log('Sending message to Gemini API...');
    const result = await chat.sendMessage(message);
    const botReply = result.response.text();
    console.log('Received response from Gemini API');
    
    res.json({ reply: botReply });
    console.log('Response sent to client');
    
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Failed to get response from AI model' });
  }
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Open http://localhost:3000/test-chat.html to test the chatbot');
});

// Keep the process running
process.stdin.resume();
