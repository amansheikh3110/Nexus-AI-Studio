const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OpenAI } = require('openai');
const User = require('./models/User');
const Chat = require('./models/Chat');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serverless MongoDB connection pool helper
let cachedDb = null;
const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_chat_dashboard';
  cachedDb = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
  return cachedDb;
};

// OpenRouter API setup
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "sk-or-v1-dummy-fallback-key-for-init",
});

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    await connectDB();
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });
    
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    user = new User({ username, passwordHash });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
    res.json({ token, username });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    await connectDB();
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
    res.json({ token, username });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// --- Chat Routes ---
app.get('/api/chats', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const chats = await Chat.find({ userId: req.user }).select('title createdAt').sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.post('/api/chats', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const newChat = new Chat({
      userId: req.user,
      title: 'New Chat',
      messages: []
    });
    await newChat.save();
    res.json(newChat);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.get('/api/chats/:id', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.delete('/api/chats/:id', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json({ message: 'Chat deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// OpenRouter Chat Completion Route
app.post('/api/chats/:id/message', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const { message, model, persona } = req.body;
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    
    if (chat.messages.length === 0) {
      chat.title = message.substring(0, 30) + '...';
    }
    
    chat.messages.push({ role: 'user', content: message });
    
    let apiMessages = [];
    if (persona) {
       apiMessages.push({ role: 'system', content: persona });
    }
    
    const recentMessages = chat.messages.slice(-10).map(m => ({
       role: m.role,
       content: m.content
    }));
    apiMessages = [...apiMessages, ...recentMessages];
    
    await chat.save();
    
    const fallbackModels = [
      "openai/gpt-oss-20b:free",
      "google/gemma-4-31b-it:free",
      "google/gemma-4-26b-a4b-it:free",
      "nvidia/nemotron-3-ultra-550b-a55b:free",
      "nvidia/nemotron-3-super-120b-a12b:free",
      "cohere/north-mini-code:free"
    ];

    let modelsToTry = [model || "google/gemini-2.0-flash-exp:free"];
    for (const fb of fallbackModels) {
       if (!modelsToTry.includes(fb)) modelsToTry.push(fb);
    }

    let stream = null;
    let successfulModel = null;

    for (const m of modelsToTry) {
       try {
          stream = await openai.chat.completions.create({
            model: m,
            messages: apiMessages,
            stream: true,
          });
          successfulModel = m;
          break; // Connection succeeded!
       } catch (apiErr) {
          console.warn(`[Fallback] Model ${m} failed: ${apiErr.message}. Trying next...`);
       }
    }

    if (!stream) {
       throw new Error("All fallback models failed to respond.");
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullResponse += content;
        res.write(content);
      }
    }
    
    res.end();
    
    chat.messages.push({ role: 'assistant', content: fullResponse });
    await chat.save();
    
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
       res.status(500).json({ error: err.message || 'AI API error' });
    } else {
       res.end();
    }
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let mongoStatus = 'disconnected';
  try {
    await connectDB();
    mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  } catch (err) {
    mongoStatus = err.message;
  }
  res.json({
    status: 'ok',
    mongo: mongoStatus,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
