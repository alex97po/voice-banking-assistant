import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import OpenAI from 'openai';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  const mode = req.query.mode || 'accurate';

  try {
    if (mode === 'fast') {
      // Stub for faster-whisper — would call Python subprocess
      // For now, fall back to OpenAI Whisper
      console.log('[STT] Fast mode requested — falling back to OpenAI Whisper');
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Use the original extension so OpenAI correctly detects the format
    const ext = req.file.originalname.split('.').pop() || 'webm';
    const filePath = req.file.path + '.' + ext;
    fs.renameSync(req.file.path, filePath);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      language: undefined, // auto-detect Arabic/English
    });

    // Clean up temp file
    fs.unlinkSync(filePath);

    // Detect language (simple heuristic — Arabic characters)
    const hasArabic = /[\u0600-\u06FF]/.test(transcription.text);
    const language = hasArabic ? 'ar' : 'en';

    res.json({ text: transcription.text, language });
  } catch (error) {
    console.error('[STT Error]', error.message);
    // Clean up temp files on error
    try { fs.unlinkSync(req.file.path); } catch {}
    try { fs.unlinkSync(req.file.path + '.webm'); } catch {}
    res.status(500).json({ error: 'Transcription failed', details: error.message });
  }
});

export default router;
