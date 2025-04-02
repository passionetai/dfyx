// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('hidden');
    } else {
        backToTopButton.classList.add('hidden');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile Menu Toggle (would need implementation)
// Currently just using icons, would need to add the actual menu functionality

// Form Submission Handling
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically handle form submission via AJAX
        alert('Thank you for your message! We will contact you soon.');
        form.reset();
    });
}



// Chatbot UI Logic
const chatFab = document.getElementById('chat-fab');
const chatWindow = document.getElementById('chat-window');
const closeChatButton = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');

let conversationHistory = []; // To store { role: 'user'/'model', parts: [{ text: 'message' }] }

// --- Event Listeners ---

if (chatFab) {
    chatFab.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        chatFab.classList.toggle('open'); // Optional: for styling the FAB icon when open
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    });
}

if (closeChatButton) {
    closeChatButton.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
        chatFab.classList.remove('open');
    });
}

if (sendChatButton) {
    sendChatButton.addEventListener('click', handleSendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
}

// --- Functions ---

function handleSendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText === '') return;

    displayMessage(messageText, 'user');
    conversationHistory.push({ role: 'user', parts: [{ text: messageText }] });
    chatInput.value = '';
    showTypingIndicator();

    // TODO: Send message and history to backend proxy
    sendMessageToServer(messageText, conversationHistory);
}

function displayMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'user' ? 'message-user' : 'message-bot');

    const contentDiv = document.createElement('div');
    // Basic text sanitization (replace < and > to prevent HTML injection)
    // For more robust sanitization, consider a library like DOMPurify
    const sanitizedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    contentDiv.innerHTML = `<p class="text-sm">${sanitizedText}</p>`; // Use innerHTML carefully

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.classList.add('message-bot'); // Align like a bot message
    typingDiv.innerHTML = `
        <div class="typing-indicator p-3">
            <span></span><span></span><span></span>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Placeholder for backend communication
async function sendMessageToServer(message, history) {
    // --- Send message and history to backend proxy ---
    try {
        // Assuming the backend server is running on localhost:3000
        // If your backend is deployed elsewhere, change this URL
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Send the new message and the current history
            body: JSON.stringify({ message: message, history: history })
        });

        removeTypingIndicator(); // Remove typing indicator once response starts processing

        if (!response.ok) {
             const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' })); // Try to get error details
             console.error('Backend error:', response.status, errorData);
             displayMessage(`Sorry, there was an error contacting the server (${response.status}). ${errorData.error || ''}`, 'bot');
             // Don't add server error messages to history
             return; // Stop processing on error
        }

        const data = await response.json();
        const botResponse = data.reply; // Assumes backend sends { reply: "..." }

        if (botResponse) {
            displayMessage(botResponse, 'bot');
            // Add the *actual* bot response to history for the next turn
            conversationHistory.push({ role: 'model', parts: [{ text: botResponse }] });
        } else {
             console.error('Invalid response structure from backend:', data);
             displayMessage('Sorry, I received an unexpected response from the server.', 'bot');
        }

    } catch (error) {
        console.error('Error sending message:', error);
        removeTypingIndicator(); // Ensure indicator is removed on network error too
        displayMessage('Sorry, I couldn\'t connect to the chat service. Please check your connection or try again later.', 'bot');
        // Don't add network error messages to history
    }
}

// Add initial bot message to history (optional)
// conversationHistory.push({ role: 'model', parts: [{ text: 'Hello! How can I help you today?' }] });
