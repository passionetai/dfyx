# Gemini Chatbot Implementation Plan

This document outlines the plan for adding a Gemini-powered chatbot to the website.

## Requirements Summary

*   **Functionality:** Answer user questions about services and payments based on website content.
*   **UI:** Floating action button (FAB) in the bottom-right corner, opening a chat window.
*   **Context:** Maintain conversation history.
*   **Security:** Use a backend proxy to protect the Gemini API key.

## Implementation Phases

### Phase 1: Backend Proxy Setup

1.  **Technology Choice:** Simple backend application (e.g., Node.js/Express or serverless function).
2.  **API Endpoint:** Create a single API endpoint (e.g., `/api/chat`).
3.  **Functionality:**
    *   Accept POST requests (user message, conversation history).
    *   Load Gemini API key securely from environment variables.
    *   Read `index.html` content for context.
    *   Format prompt for Gemini API (system instructions, website content, history, user message).
    *   Call Gemini API.
    *   Handle response/errors.
    *   Send chatbot response back to frontend.

### Phase 2: Frontend Chat UI Implementation

1.  **HTML (`index.html`):**
    *   Add HTML for FAB (fixed, bottom-right).
    *   Add HTML structure for initially hidden chat window (header, message area, input, send button).
2.  **CSS (`styles.css`):**
    *   Style FAB.
    *   Style chat window (position, size, appearance, responsiveness).
    *   Style message display, input, and button.
3.  **JavaScript (`script.js`):**
    *   **UI Logic:**
        *   FAB click listener to toggle chat window visibility.
        *   Send button/Enter key listeners.
    *   **Chat Logic:**
        *   Maintain conversation history array.
        *   On send: Display user message, add to history, show "typing...", call backend proxy (`/api/chat`).
        *   On response: Remove "typing...", display bot message, add to history, clear input.
        *   Error handling for fetch call.

### Phase 3: Deployment

1.  **Frontend:** Deploy updated static files (`index.html`, `styles.css`, `script.js`).
2.  **Backend:** Deploy proxy application to hosting platform (e.g., Vercel, Netlify, AWS, Google Cloud). Configure Gemini API key securely as an environment variable.

## Visual Flow (Mermaid Diagram)

```mermaid
sequenceDiagram
    participant User
    participant Frontend (JS)
    participant BackendProxy
    participant GeminiAPI

    User->>Frontend: Clicks floating button
    Frontend->>Frontend: Shows Chat Window

    User->>Frontend: Enters message, Clicks Send
    Frontend->>Frontend: Displays User Message
    Frontend->>Frontend: Adds message to local history
    Frontend->>BackendProxy: POST /api/chat (message, history)

    BackendProxy->>BackendProxy: Reads index.html content
    BackendProxy->>BackendProxy: Loads API Key securely
    BackendProxy->>GeminiAPI: Sends Prompt (context, history, message)

    GeminiAPI-->>BackendProxy: Returns Chatbot Response
    BackendProxy-->>Frontend: Sends Response

    Frontend->>Frontend: Displays Chatbot Message
    Frontend->>Frontend: Adds response to local history