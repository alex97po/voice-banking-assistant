const BASE = '/api';

export async function transcribeAudio(audioBlob, mode = 'accurate') {
  const formData = new FormData();
  const ext = audioBlob.type.includes('mp4') ? 'm4a' : 'webm';
  formData.append('audio', audioBlob, `recording.${ext}`);

  const res = await fetch(`${BASE}/transcribe?mode=${mode}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Transcription failed');
  return res.json();
}

export async function sendChat(userId, messages, pendingAction = null) {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, messages, pendingAction }),
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}

export async function getAccounts(userId) {
  const res = await fetch(`${BASE}/banking/accounts/${userId}`);
  if (!res.ok) throw new Error('Failed to load accounts');
  return res.json();
}

export async function getTransactions(userId, limit = 20) {
  const res = await fetch(`${BASE}/banking/transactions/${userId}?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to load transactions');
  return res.json();
}

export async function getCards(userId) {
  const res = await fetch(`${BASE}/banking/cards/${userId}`);
  if (!res.ok) throw new Error('Failed to load cards');
  return res.json();
}

export async function getBeneficiaries(userId) {
  const res = await fetch(`${BASE}/banking/beneficiaries/${userId}`);
  if (!res.ok) throw new Error('Failed to load beneficiaries');
  return res.json();
}

export async function getUserData(userId) {
  const res = await fetch(`${BASE}/banking/user/${userId}`);
  if (!res.ok) throw new Error('Failed to load user');
  return res.json();
}

export async function synthesizeSpeech(text, language) {
  const res = await fetch(`${BASE}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (data.fallback) return null; // signal to use browser TTS
    throw new Error('TTS failed');
  }
  return res.blob();
}

export async function getHealth() {
  const res = await fetch(`${BASE}/health`);
  return res.json();
}
