# NexusAI Studio

> A cinematic, high-performance AI chat interface and multi-model orchestration engine built with React, Node.js, and OpenRouter. Inspired by the sleek aesthetics of ChatGPT, Gemini, and Grok.

![NexusAI Studio Banner](https://img.shields.io/badge/Status-Production--Ready-brightgreen?style=for-the-badge) ![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwindcss) ![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js) ![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

---

## 🌟 Overview

**NexusAI Studio** was born out of a genuine curiosity to explore the boundaries of modern frontend motion design, real-time token streaming architectures, and resilient LLM orchestration. 

It provides users with a fluid, distraction-free environment to interact with multiple open-source and proprietary Large Language Models simultaneously, offering auto-fallback routing, contextual document ingestion, persona simulation, custom theme creation, and power-user keyboard navigation.

---

## ✨ Key Features

### 🧠 1. Multi-Model Intelligence & Resilient Fallback Routing
- **Instant Model Switching**: Switch seamlessly between top-tier open-source models:
  - `GPT OSS 20B`
  - `Gemma 4 31B` & `26B`
  - `Nemotron 3 Ultra 550B` & `Super 120B`
  - `Cohere North Code`
- **Automated Fallback Pipeline**: If an upstream provider rate-limits or fails, the backend silently reroutes the request down a prioritized fallback chain to guarantee unbroken streaming uptime.

### 🎭 2. Dynamic Persona Engine
Inject specialized system prompts on the fly to tailor AI behavior for specific domain tasks:
- **Software Engineer**: Provides clean, typed, well-commented code snippets.
- **Socratic Tutor**: Guides learning through targeted inquiry rather than direct answers.
- **Stand-Up Comedian**: Generates responses infused with sharp humor.
- **General Assistant**: Balanced, professional, all-purpose assistant.

### 📄 3. Contextual In-Browser Document Analysis
- Integrated client-side `FileReader` supporting text files, code (`.py`, `.js`, `.tsx`, `.cpp`, `.rs`), markdown (`.md`), data files (`.json`, `.csv`, `.yaml`), and more.
- Automatically formats uploaded files into structured markdown context blocks for instant document analysis, code review, or data extraction.

### 🎨 4. Cinematic Glassmorphic Interface & Theme Builder
- Built with custom CSS variable design tokens and glassmorphism backdrop filters.
- **Three Core Modes**: Dark Mode (default), Light Mode (high contrast), and **Custom Mode**.
- **Live Theme Builder**: Interactively customize background, surface, and glow accent colors with real-time preview and 6 built-in color presets (*Violet Night, Midnight Blue, Emerald Dark, Rose Dark, Amber Dark, Cyan Dark*).

### ⚡ 5. Real-Time Token Streaming & Message Actions
- **SSE Token Streaming**: Server-Sent Events deliver character-by-character output with a custom animated blinking cursor (`▋`).
- **Rich Markdown Codeblocks**: Syntax highlighting, 1-click code copying, and structured table rendering.
- **Message Utility Suite**:
  - **Inline Edit**: Modify previous user messages to branch conversations.
  - **Regenerate & Stop**: Interruption control for active responses.
  - **Text-to-Speech (TTS)**: Web Speech API synthesis for reading responses aloud.
  - **Feedback & Bookmarks**: Like/dislike tracking and message bookmarking.

### ⌨️ 6. Power User Workflow
- **`Ctrl + K` / `⌘ + K` Command Palette**: Instant modal to search through previous chat titles, switch themes, start new conversations, or trigger app shortcuts.
- **Responsive Mobile Layout**: Collapsible sidebar with spring physics animations and mobile touch overlay backdrop.
- **Session Persistence**: Active conversation state persists across browser refreshes via `localStorage`.

---

## 🛠️ Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                     NexusAI Studio Frontend                 │
   │   React 18 · Vite · Framer Motion · TailwindCSS · Lucide    │
   └──────────────────────────────┬──────────────────────────────┘
                                  │  HTTP / SSE Token Stream
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                   Express Node.js Backend                   │
   │  JWT Auth · Rate Limiting · Auto-Fallback Model Controller   │
   └──────────────┬──────────────────────────────┬───────────────┘
                  │                              │
                  ▼                              ▼
      ┌───────────────────────┐      ┌────────────────────────┐
      │     MongoDB Atlas     │      │   OpenRouter API SDK   │
      │  Users & Chat History │      │ Multi-Model Connection │
      └───────────────────────┘      └────────────────────────┘
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas connection string
- **OpenRouter API Key**: Free key from [openrouter.ai](https://openrouter.ai)

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
```

Configure your `backend/.env` file:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/ai_chat_dashboard
JWT_SECRET=your_super_secret_jwt_key
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Start the backend server:
```bash
node server.js
```

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌐 Deployment

### Vercel Deployment
Both backend and frontend are pre-configured with `vercel.json` rewrite manifests:

1. **Backend**: Deploy `backend/` directory to Vercel or Render. Set environment variables `MONGO_URI`, `JWT_SECRET`, and `OPENROUTER_API_KEY`.
2. **Frontend**: Deploy `frontend/` directory to Vercel. Set `VITE_API_URL` environment variable to your backend domain.

---

## 👨‍💻 Author

Crafted with ❤️ and genuine curiosity by **Aman Sheikh**

- **GitHub**: [@amansheikh3110](https://github.com/amansheikh3110)
- **Project**: [NexusAI Studio Repository](https://github.com/amansheikh3110/Nexus-AI-Studio)

---

*License: MIT — Feel free to use, modify, and build upon this project.*
