# Arabic Voice Banking Assistant

A zero-install, browser-based demo of an AI-powered voice banking assistant with Arabic/English bilingual support.

## Quick Start

```bash
# 1. Clone and install
npm run install:all

# 2. Set up environment
cp .env.example .env
# Edit .env with your API keys

# 3. Run
npm run dev
```

Opens at **http://localhost:5173**

## Required API Keys

| Key | Required | Purpose |
|-----|----------|---------|
| `ANTHROPIC_API_KEY` | ✅ Yes | Claude AI agent (tool-use) |
| `OPENAI_API_KEY` | ✅ Yes | Whisper STT (speech-to-text) |
| `ELEVENLABS_API_KEY` | Optional | Premium Arabic TTS |
| `ELEVENLABS_VOICE_ID` | Optional | Custom voice selection |

## Architecture

```
Browser (React) ──► Express Server ──► Claude API (tool-use)
     │                    │
     ├─ Voice capture     ├─ STT (Whisper)
     ├─ TTS (browser)     ├─ Banking tools (in-memory)
     └─ Confirm modal     └─ ElevenLabs TTS (optional)
```

## Demo Users

| User | Accounts | Cards |
|------|----------|-------|
| **Ahmed Al-Mansouri** | AED 24,500 · USD 8,200 · EUR 3,150 | Visa Platinum · MC Classic |
| **Sara Al-Hashimi** | AED 51,200 · USD 22,000 | Visa Signature |

## Demo Script

1. Open URL → show login screen. "Two users, isolated data."
2. Login as Ahmed → show accounts and cards
3. English: "What's my AED balance?" → instant answer
4. "Convert 500 AED to USD" → confirm modal → Authorize → balances update
5. Toggle STT to Accurate, ask in Arabic: "كم رصيدي بالدولار؟" → Arabic response
6. "Transfer 1000 AED to Rania" → confirm modal
7. Logout → login as Sara → different data

## Operations

| Operation | Type | Confirmation |
|-----------|------|-------------|
| Check balance | Read | No |
| View transactions | Read | No |
| Exchange rates | Read | No |
| Convert currency | **Write** | ✅ Required |
| Transfer funds | **Write** | ✅ Required |
| Block card | **Write** | ✅ Required |
| List beneficiaries | Read | No |
| List cards | Read | No |
