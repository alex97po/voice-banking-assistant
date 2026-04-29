import { Router } from 'express';
import { handleChat } from '../agent.js';

const router = Router();

router.post('/', async (req, res) => {
  const { userId, messages, pendingAction } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const result = await handleChat(userId, messages, pendingAction);
    res.json(result);
  } catch (error) {
    console.error('[Chat Error]', error.message);
    res.status(500).json({ error: 'Agent error', details: error.message });
  }
});

export default router;
