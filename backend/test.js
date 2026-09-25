require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "sk-or-v1-dummy-fallback-key-for-init",
  timeout: 12000,
  maxRetries: 0,
});

async function test() {
  const models = [
    "inclusionai/ling-3.0-flash-fin:free",
    "poolside/laguna-s-2.1:free",
    "dots-studio/dots-3-note-preview:free",
    "nvidia/nemotron-3.5-lightning:free",
    "nvidia/nemotron-3-ultra-550b-a55b:free"
  ];

  for (const m of models) {
    console.log(`\nTesting ${m}...`);
    try {
      const stream = await openai.chat.completions.create({
        model: m,
        messages: [{ role: 'user', content: 'Hello' }],
        stream: true,
      }, { timeout: 4000 });
      console.log(`Success for ${m}! Stream started.`);
      break;
    } catch (e) {
      console.error(`Failed ${m}:`, e.message);
    }
  }
}

test();
