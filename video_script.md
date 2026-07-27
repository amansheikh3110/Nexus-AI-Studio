# 🎬 NexusAI Studio — Detailed Code & Video Walkthrough Guide
> **Total Target Duration:** 4 to 5 Minutes  
> **Presenter:** Aman Sheikh  
> **Goal:** High-impact demo covering Web App Features + Detailed Code Walkthrough (File by File, Line by Line).

---

## 🖥️ STEP 1: Pre-Recording Editor Setup (Open these tabs in VS Code beforehand)

Arrange your VS Code tabs in this exact order so you can click through them smoothly:

1. **Tab 1:** `frontend/src/context/AuthContext.jsx` (Scroll to lines 17–40)
2. **Tab 2:** `frontend/src/components/ChatArea.jsx` (Scroll to lines 44–65 and 105–160)
3. **Tab 3:** `frontend/src/components/ChatInput.jsx` (Scroll to lines 40–75)
4. **Tab 4:** `frontend/src/components/Sidebar.jsx` (Scroll to lines 20–55)
5. **Tab 5:** `frontend/api/index.js` (Scroll to lines 18–28 and 110–175)

---

## 🎬 STEP 2: Complete Scene-by-Scene Script & On-Screen Actions

---

### 📍 PART A: LIVE WEB APP DEMO (Minutes 0:00 – 2:15)

#### **Scene 1: Login & Cloud Authentication (0:00 – 0:45)**
* **On-Screen Action:**  
  1. Start recording on the live website: `https://nexus-ai-studio-two.vercel.app`.
  2. Click **"Sign up"**, type username `aman_evaluator` and password `password123`.
  3. Click **"Create Account"** $\rightarrow$ App transitions to the main dashboard.
  4. Switch to browser Tab 2 (**MongoDB Atlas**) $\rightarrow$ Click **Refresh** on `users` collection to show `aman_evaluator` document.
* **Exact Script to Say:**  
  > *"Hello everyone! My name is Aman Sheikh, and today I'm demonstrating **NexusAI Studio**—a production-grade, multi-model AI chat platform.*
  >
  > *Let's start by creating a new account. When I click 'Create Account', our React frontend sends a POST request to our Vercel Serverless Express API. If we switch to MongoDB Atlas, we can see `aman_evaluator` instantly saved in our cloud database with a bcrypt-hashed password."*

---

#### **Scene 2: Multi-Model Switching & Real-Time Token Streaming (0:45 – 1:30)**
* **On-Screen Action:**  
  1. Switch back to the web app.
  2. Click the **Model Selector** dropdown at the bottom left (highlight `Gemma 4`, `Nemotron 550B`, `Cohere North`).
  3. Type prompt: *"Write a 2-line poem about space exploration."* and press Enter.
  4. Watch the 3-dot loading state transition into real-time character-by-character token streaming with the blinking cursor (`▋`).
* **Exact Script to Say:**  
  > *"Next, let's explore multi-model LLM inference. I can select from several open models like Gemma 4, Nemotron, or Cohere.*
  >
  > *When I hit Enter, the screen immediately switches away from the welcome view to display a 3-dot loading state. Then, tokens stream in real-time character-by-character using Server-Sent Events (SSE). If a model fails or hits API limits, our backend silently attempts a fallback chain across 6 alternative models."*

---

#### **Scene 3: AI Personas & Document File Ingestion (1:30 – 2:15)**
* **On-Screen Action:**  
  1. Click the **Persona Dropdown** $\rightarrow$ Select `Software Engineer`.
  2. Click the **Paperclip (Attachment)** button.
  3. Select any text/code file (e.g. `User.js` or `.txt`). Show the removable tag pill above the input bar.
  4. Type: *"Explain this file in 1 sentence."* and click Send.
* **Exact Script to Say:**  
  > *"NexusAI Studio also supports dynamic system personas like 'Software Engineer' or 'Socratic Tutor'.*
  >
  > *Furthermore, we built client-side document ingestion. By clicking the paperclip icon, I can attach code or text files. The app reads the contents using browser `FileReader`, renders a tag pill, and automatically feeds the raw code as a formatted block into the LLM prompt."*

---

---

### 📍 PART B: DEAILED CODE WALKTHROUGH (Minutes 2:15 – 4:30)

*Switch screen capture to **VS Code**.*

---

#### **Code File 1: `frontend/src/context/AuthContext.jsx` (2:15 – 2:50)**
* **On-Screen Action:**  
  - Click VS Code Tab 1 (`AuthContext.jsx`).
  - Highlight lines 17–36 (`_auth` function) with your mouse cursor.
* **Exact Script to Say:**  
  > *"Now let's look at the codebase. Here in `AuthContext.jsx`, lines 17 to 36 handle authentication state management.*
  >
  > *The `_auth` function issues POST requests to `/api/auth/login` or `/api/auth/register`, parses the returned JSON payload safely, and stores the JWT bearer token and username in browser `localStorage`. This keeps the user session authenticated across page refreshes."*

---

#### **Code File 2: `frontend/src/components/ChatArea.jsx` (2:50 – 3:30)**
* **On-Screen Action:**  
  - Click VS Code Tab 2 (`ChatArea.jsx`).
  - Highlight lines 44–58 (`ignoreNextLoadRef` guard in `useEffect`).
  - Scroll down and highlight lines 110–155 (the SSE streaming reader loop).
* **Exact Script to Say:**  
  > *"Moving to `ChatArea.jsx`, lines 44 to 58 solve a critical race condition. When creating a new chat session, we use an `ignoreNextLoadRef` guard to prevent `useEffect` from overwriting local state with an empty array before the server finishes streaming.*
  >
  > *Down in lines 110 to 155, `handleSendMessage` handles real-time response streaming. It consumes `response.body.getReader()`, decodes text chunks using `TextDecoder`, and continuously appends incoming tokens to React state so the UI updates instantly as AI generates responses."*

---

#### **Code File 3: `frontend/src/components/ChatInput.jsx` (3:30 – 3:55)**
* **On-Screen Action:**  
  - Click VS Code Tab 3 (`ChatInput.jsx`).
  - Highlight lines 40–60 (`handleFileUpload` function using `FileReader`).
* **Exact Script to Say:**  
  > *"In `ChatInput.jsx`, lines 40 to 60 contain `handleFileUpload`. It uses the native `FileReader` API to read local files asynchronously, extract raw text contents, and pass them up to `ChatArea` as code blocks without requiring expensive server uploads."*

---

#### **Code File 4: `frontend/api/index.js` (Backend API & Fallback) (3:55 – 4:40)**
* **On-Screen Action:**  
  - Click VS Code Tab 5 (`frontend/api/index.js`).
  - Highlight lines 18–28 (`connectDB` serverless pooling helper).
  - Scroll to lines 135–165 (the `fallbackModels` array and `for (const m of modelsToTry)` loop).
* **Exact Script to Say:**  
  > *"Finally, looking at our serverless API entrypoint in `frontend/api/index.js`:*
  >
  > *Lines 18 to 28 implement `connectDB()`, a serverless connection pooling helper. It reuses existing Mongoose connection instances across lambda invocations to eliminate cold-start buffering timeouts.*
  >
  > *Lines 135 to 165 contain our automated model fallback loop. It attempts inference on the requested model, and if an API error occurs, it iterates through fallback models like Gemma, Nemotron, and Cohere until streaming succeeds."*

---

### 📍 PART C: CONCLUSION & TIME SPENT (Minutes 4:40 – 5:00)

* **On-Screen Action:**  
  - Switch browser to Tab 3 (**GitHub Repository**).
* **Exact Script to Say:**  
  > *"Overall, I spent approximately **15 hours** designing the glassmorphic UI system, implementing SSE token streaming, optimizing serverless database connections, and deploying the app live.*
  >
  > *Thank you for your time and evaluation!"*
