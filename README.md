# AI Chat Dashboard (Option B)

This is a complete, full-stack implementation of the **AI Chat Dashboard** take-home project for Megaminds IT Services. 

## Features Built
1. **Full-Stack Authentication:** Secure user registration and login using **JSON Web Tokens (JWT)** and **bcrypt** password hashing.
2. **MongoDB Integration:** All users and chat histories are permanently stored in MongoDB.
3. **Multi-Model LLM Switching:** Built with **OpenRouter**, allowing users to seamlessly switch between different LLMs (Gemini, Llama 3, Mistral) on the fly via a dropdown.
4. **AI Personas:** A custom dropdown injects system prompts so the AI adopts specific personas (e.g., Expert Programmer, Grumpy Pirate).
5. **Real-Time Streaming:** The chat UI streams responses character-by-character for a ChatGPT-like experience.
6. **Premium UI:** Custom, sleek dark-mode CSS with a sidebar history and seamless messaging.

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **AI Integration:** OpenRouter API (via official `openai` SDK)

---

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` (already created) with your OpenRouter Key:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/ai_chat_dashboard
   JWT_SECRET=super_secret_jwt_key_12345
   OPENROUTER_API_KEY="your_actual_key_here"
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## Recording Your Demo Video
1. **Show Auth:** Start on the login screen. Create a new account to show the JWT flow.
2. **Show UI:** Highlight the ChatGPT-style interface (sidebar for history, dropdowns at the top).
3. **Demo Personas:** Select "Grumpy Pirate" and ask it a question to prove the system prompts work.
4. **Demo Model Switching:** Change the dropdown to `Llama 3` and ask another question. Point out the streaming text!
5. **Show Database:** Briefly open MongoDB Compass to show that users and `messages` arrays are saving properly.
