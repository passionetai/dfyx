require('dotenv').config(); // Load environment variables from .env file
console.log('Starting server...');
const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const fs = require('fs').promises; // Use promises version of fs
const cors = require('cors'); // Import CORS middleware
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Use environment port or default to 3000

// --- Configuration ---
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("Error: GEMINI_API_KEY not found in environment variables.");
    process.exit(1); // Exit if API key is missing
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Or your preferred model

const generationConfig = {
    temperature: 0.9, // Adjust creativity (0-1)
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048, // Adjust max response length
};

// Safety settings to block harmful content
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// --- Middleware ---
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all origins (simplest for local dev)

// --- API Endpoint ---
app.post('/api/chat', async (req, res) => {
    try {
        console.log('Received chat request');
        const { message, history } = req.body; // Get message and history from frontend
        console.log('Message:', message);
        console.log('History length:', history ? history.length : 0);

        if (!message) {
            console.log('Error: Message is required');
            return res.status(400).json({ error: 'Message is required' });
        }

        // Ensure history is an array, default to empty if not provided or invalid
        const validHistory = Array.isArray(history) ? history : [];

        // --- Get Website Context ---
        let websiteContext = "No website context available."; // Default context
        try {
            const htmlPath = path.join(__dirname, 'index.html');
            const htmlContent = await fs.readFile(htmlPath, 'utf8');
            // Basic text extraction (consider a more robust HTML parser for complex sites)
            const bodyContentMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyContentMatch && bodyContentMatch[1]) {
                // Remove script/style tags and excessive whitespace
                websiteContext = bodyContentMatch[1]
                    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                    .replace(/<[^>]+>/g, ' ') // Remove remaining HTML tags
                    .replace(/\s\s+/g, ' ') // Collapse multiple spaces
                    .trim();
                 // Limit context size if needed
                 if (websiteContext.length > 10000) { // Example limit
                    websiteContext = websiteContext.substring(0, 10000) + "... (truncated)";
                 }
            }
        } catch (err) {
            console.warn("Warning: Could not read or parse index.html for context.", err.message);
            // Proceed without website context or with default
        }


        // --- System Instruction ---
        const systemInstruction = `You are a helpful assistant for TechSolutions DFY. Your goal is to answer user questions based ONLY on the provided website context. Be friendly and concise. If the answer isn't in the context, politely state that you don't have that information. Do not make up information.

        Website Context:
        ---
        ${websiteContext}
        ---
        `;

        // --- Start Chat with History ---
        // Note: Gemini API expects history in a specific format.
        // Ensure the history sent from the frontend matches this structure.
        // The frontend code currently sends { role: 'user'/'model', parts: [{ text: 'message' }] } which is correct.
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
                // Add system instruction as the first 'user' turn, followed by a placeholder 'model' turn
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "Okay, I understand. I will answer questions based on the provided website context." }] },
                // Append the actual conversation history from the frontend
                ...validHistory
            ],
        });

        // --- Send User Message and Get Response ---
        console.log('Sending message to Gemini API...');
        const result = await chat.sendMessage(message); // Send the new user message
        const response = result.response;
        const botReply = response.text();
        console.log('Received response from Gemini API');

        res.json({ reply: botReply });
        console.log('Response sent to client');

    } catch (error) {
        console.error("Error processing chat request:", error);
        // Check for specific safety feedback
        if (error.response && error.response.promptFeedback) {
             console.error("Prompt Feedback:", error.response.promptFeedback);
             res.status(400).json({ error: "Request blocked due to safety settings.", details: error.response.promptFeedback });
        } else {
             console.error("Stack trace:", error.stack);
             res.status(500).json({ error: 'Failed to get response from AI model' });
        }
    }
});

// --- Serve Static Files (Optional, for testing) ---
// If you want to test the frontend and backend together easily,
// you can serve the static files from the same server.
// Otherwise, you'll run the frontend separately (e.g., using a simple HTTP server or opening index.html directly)
// and ensure the fetch URL in script.js points to this backend server (e.g., http://localhost:3000/api/chat).
// app.use(express.static(__dirname)); // Serves files from the current directory

// --- Serve Static Files ---
app.use(express.static(__dirname)); // Serves files from the current directory

// --- Start Server ---
const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log("GEMINI_API_KEY:", API_KEY ? "Found" : "Not found");
    console.log("Run 'npm install express @google/generative-ai dotenv' if you haven't already.");
});

// Keep the server running
process.on('SIGINT', () => {
    console.log('Server shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

console.log('Server setup complete. Waiting for requests...');