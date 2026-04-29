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
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Detect language (simple heuristic — Arabic characters)
    const hasArabic = /[\u0600-\u06FF]/.test(transcription.text);
    const language = hasArabic ? 'ar' : 'en';

    res.json({ text: transcription.text, language });
  } catch (error) {
    console.error('[STT Error]', error.response?.data || error.message);
    // Clean up all possible temp files on error
    try { if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); } catch {}
    // The filePath might have been created
    const ext = req.file?.originalname?.split('.').pop() || 'webm';
    const filePath = req.file ? req.file.path + '.' + ext : null;
    try { if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch {}
    
    res.status(500).json({ error: 'Transcription failed', details: error.message });
  }
});

export default router;
