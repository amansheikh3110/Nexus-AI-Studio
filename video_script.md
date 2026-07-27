# 🎬 NexusAI Studio — Explanation Video Script & Walkthrough Guide
> **Target Duration:** 3 – 5 Minutes  
> **Presenter:** Aman Sheikh  
> **Topic:** App Walkthrough, Architecture, AI Integration, and Live Demo  

---

## 📋 Pre-Recording Checklist (Prepare Before Hitting Record)

1. **Browser Tab 1:** [Live Demo App](https://nexus-ai-studio-two.vercel.app) (Open on the Login page).
2. **Browser Tab 2:** [MongoDB Atlas Dashboard](https://cloud.mongodb.com) (Open on `ai_chat_dashboard` collections).
3. **Browser Tab 3:** [GitHub Repository](https://github.com/amansheikh3110/Nexus-AI-Studio).
4. **IDE (VS Code):** Open on `Nexus-AI-Studio` folder showing `frontend/` and `backend/`.

---

## ⏱️ Scene-by-Scene Script & Action Guide

### **Scene 1: Introduction & Authentication (0:00 – 0:45)**

🎥 **What to Show on Screen:**
- Start on the **NexusAI Studio Login/Signup screen**.
- Type a new username (e.g., `demo_user`) and password, click **Create Account**.
- Transition smoothly to the main chat dashboard home screen.

🗣️ **What to Say (Exact Script):**
> *"Hi everyone, my name is Aman Sheikh, and today I'm excited to present **NexusAI Studio**—a high-performance, multi-model AI chat platform inspired by ChatGPT, Gemini, and Grok.*
>
> *I built this project out of a deep curiosity for generative AI systems, real-time token streaming, and modern motion design. Let me start by creating a new user account. As you can see, the authentication system uses secure JWT tokens and bcrypt password hashing."*

---

### **Scene 2: Data Persistence in MongoDB Atlas (0:45 – 1:20)**

🎥 **What to Show on Screen:**
- Switch to **Browser Tab 2 (MongoDB Atlas)**.
- Refresh the `users` collection page to reveal the newly created `demo_user` document.
- Switch back to the chat interface.

🗣️ **What to Say (Exact Script):**
> *"If we check our MongoDB Atlas cloud database in real time, you can see the new user document immediately saved in the `users` collection. All user profiles and conversation histories are permanently persisted in the cloud."*

---

### **Scene 3: Multi-Model LLM Switching & Token Streaming (1:20 – 2:20)**

🎥 **What to Show on Screen:**
- Click the **Model Selector** dropdown at the bottom left of the input bar.
- Highlight models: `GPT OSS 20B`, `Gemma 4 31B`, `Nemotron 550B`, `Cohere North`.
- Type a prompt: *"Explain quantum computing in 2 concise sentences."* and hit Enter.
- Show the 3-dot loading animation, followed by character-by-character token streaming with the blinking cursor (`▋`).

🗣️ **What to Say (Exact Script):**
> *"One of the core architectural features of NexusAI Studio is resilient multi-model orchestration. Users can switch between leading models on the fly.*
>
> *Behind the scenes, our Node.js backend features an automated fallback pipeline. If a primary LLM is rate-limited or degrades, the system silently reroutes down a fallback chain of 6+ models to ensure zero downtime.*
>
> *Notice how tokens stream in character-by-character using Server-Sent Events (SSE) and native browser `TextDecoder` streams for an instantaneous, low-latency experience."*

---

### **Scene 4: AI Personas & Document Parsing (2:20 – 3:20)**

🎥 **What to Show on Screen:**
- Click the **Persona Dropdown** (e.g. select `Software Engineer`).
- Click the **Paperclip (Attachment)** button in the chat bar.
- Select a code file (e.g. `App.jsx` or a `.py` file). Show the attached file tag pill.
- Type: *"Explain what this file does."* and send.
- Show the assistant formatting response with syntax highlighting and code copying.

🗣️ **What to Say (Exact Script):**
> *"NexusAI Studio also supports dynamic system personas. Here I can set the persona to 'Software Engineer' to get domain-tailored technical responses.*
>
> *Additionally, we built a client-side document parser. By clicking the paperclip icon, users can attach code or data files (`.js`, `.py`, `.json`, `.csv`). The app parses the file using `FileReader` and injects it into the LLM context as a code block. The model analyzes the file and formats its response using syntax highlighting and 1-click code copying."*

---

### **Scene 5: Power User Tools & Code Architecture (3:20 – 4:20)**

🎥 **What to Show on Screen:**
- Press `Ctrl + K` (or `⌘ + K`) to open the **Command Palette**. Search for a chat.
- Click the **Theme Builder** icon in the sidebar. Toggle between Dark, Light, and Custom color themes.
- Briefly show VS Code workspace structure (`frontend/`, `backend/`, `api/index.js`).

🗣️ **What to Say (Exact Script):**
> *"For power users, we included a global Command Palette accessible via `Ctrl+K` to search past conversations or trigger shortcuts instantly.*
>
> *We also built a custom Theme Engine with dark mode, high-contrast light mode, and a live color picker. Architectural decisions like Serverless MongoDB connection pooling and CSS custom property design tokens keep the app fast and smooth.*
>
> *All code is cleanly structured into a React 18 Vite frontend and an Express Node serverless backend."*

---

### **Scene 6: Wrap-up & Time Spent (4:20 – 5:00)**

🎥 **What to Show on Screen:**
- Show the **GitHub Repository page** and **Vercel Live URL**.

🗣️ **What to Say (Exact Script):**
> *"In total, I spent approximately **15 focused hours** designing, building, debugging, and deploying NexusAI Studio.*
>
> *The entire codebase is open-source on GitHub, fully documented with a LaTeX project report, and hosted live on Vercel. Thank you for watching!"*

---

## 📌 Video Upload Instructions
1. Record your screen using **Loom**, **OBS Studio**, or **Windows Game Bar** (`Win + Alt + R`).
2. Follow the script above scene by scene.
3. Upload to **Loom** or **Google Drive** (Ensure link access is set to *"Anyone with the link can view"*).
