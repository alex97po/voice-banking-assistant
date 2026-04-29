import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
import express from 'express';
import cors from 'cors';
import transcribeRouter from './routes/transcribe.js';
import chatRouter from './routes/chat.js';
import bankingRouter from './routes/banking.js';
import ttsRouter from './routes/tts.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/transcribe', transcribeRouter);
app.use('/api/chat', chatRouter);
app.use('/api/banking', bankingRouter);
app.use('/api/tts', ttsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    features: {
      stt: !!process.env.OPENAI_API_KEY,
      agent: !!process.env.ANTHROPIC_API_KEY,
      tts_elevenlabs: !!process.env.ELEVENLABS_API_KEY,
    },
  });
});

// Serve static assets from the React client in production
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🏦 Voice Banking Server running on port ${PORT}`);
  console.log(`   STT (Whisper):    ${process.env.OPENAI_API_KEY ? '✅ configured' : '❌ missing OPENAI_API_KEY'}`);
  console.log(`   AI Agent:         ${process.env.ANTHROPIC_API_KEY ? '✅ configured' : '❌ missing ANTHROPIC_API_KEY'}`);
  console.log(`   TTS (ElevenLabs): ${process.env.ELEVENLABS_API_KEY ? '✅ configured' : '⚠️  using browser TTS'}\n`);
});
