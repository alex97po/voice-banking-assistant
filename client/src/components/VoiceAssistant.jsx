import { useState, useRef, useEffect, useCallback } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTTS } from '../hooks/useTTS';
import { transcribeAudio, sendChat } from '../lib/api';
import { isArabic } from '../lib/constants';
import ChatBubble from './ChatBubble';
import Waveform from './Waveform';
import ConfirmModal from './ConfirmModal';

export default function VoiceAssistant({ userId, sttMode, ttsMode, onDataChange }) {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [status, setStatus] = useState('idle');
  const scrollRef = useRef(null);

  const { isRecording, startRecording, stopRecording, getAnalyserData } = useAudioRecorder();
  const { speak, stop: stopSpeech } = useTTS();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const processVoiceInput = useCallback(async (audioBlob) => {
    setIsProcessing(true);
    setStatus('Transcribing...');

    try {
      // Step 1: Transcribe
      const { text, language } = await transcribeAudio(audioBlob, sttMode);
      if (!text?.trim()) {
        setStatus('idle');
        setIsProcessing(false);
        return;
      }

      // Add user message
      const userMsg = { role: 'user', content: text };
      setMessages((prev) => [...prev, userMsg]);
      const newHistory = [...chatHistory, { role: 'user', content: text }];
      setChatHistory(newHistory);

      // Step 2: Send to agent
      setStatus('Thinking...');
      const result = await sendChat(userId, newHistory);

      if (result.pendingAction) {
        // Write operation — show confirmation
        setPendingAction(result.pendingAction);
        if (result.response) {
          const assistantMsg = { role: 'assistant', content: result.response };
          setMessages((prev) => [...prev, assistantMsg]);
        }
      } else {
        // Read operation — show response
        const assistantMsg = { role: 'assistant', content: result.response };
        setMessages((prev) => [...prev, assistantMsg]);
        setChatHistory((prev) => [...prev, { role: 'assistant', content: result.response }]);

        // TTS
        const lang = isArabic(result.response) ? 'ar' : 'en';
        speak(result.response, lang, ttsMode === 'elevenlabs');
      }
    } catch (err) {
      console.error('Voice processing error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsProcessing(false);
      setStatus('idle');
    }
  }, [userId, sttMode, ttsMode, chatHistory, speak]);

  const handlePttDown = useCallback(async () => {
    stopSpeech();
    try {
      await startRecording();
    } catch (err) {
      console.error('Microphone access denied');
    }
  }, [startRecording, stopSpeech]);

  const handlePttUp = useCallback(async () => {
    const blob = await stopRecording();
    if (blob && blob.size > 1000) {
      processVoiceInput(blob);
    }
  }, [stopRecording, processVoiceInput]);

  const handleAuthorize = useCallback(async () => {
    if (!pendingAction) return;
    setIsProcessing(true);
    setStatus('Executing...');

    try {
      const confirmed = { ...pendingAction, confirmed: true };
      const result = await sendChat(userId, chatHistory, confirmed);

      const assistantMsg = {
        role: 'assistant',
        content: result.response || '✅ Transaction completed.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setChatHistory((prev) => [...prev, { role: 'assistant', content: assistantMsg.content }]);

      const lang = isArabic(assistantMsg.content) ? 'ar' : 'en';
      speak(assistantMsg.content, lang, ttsMode === 'elevenlabs');

      onDataChange?.();
    } catch (err) {
      console.error('Authorization error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Failed to execute. Please try again.' },
      ]);
    } finally {
      setPendingAction(null);
      setIsProcessing(false);
      setStatus('idle');
    }
  }, [pendingAction, userId, chatHistory, ttsMode, speak, onDataChange]);

  const handleCancel = useCallback(() => {
    setPendingAction(null);
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: 'Transaction cancelled.' },
    ]);
    setChatHistory((prev) => [
      ...prev,
      { role: 'assistant', content: 'Transaction cancelled.' },
    ]);
  }, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-subtle)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: isProcessing ? 'var(--accent-gold)' : 'var(--accent-green)',
              boxShadow: isProcessing
                ? '0 0 8px var(--accent-gold-glow)'
                : '0 0 8px var(--accent-green-glow)',
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Voice Assistant</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {status !== 'idle' ? status : 'Ready'}
          </span>
        </div>

        {/* Chat area */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎙️</div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>Hold the button to speak</div>
              <div style={{ fontSize: 12 }}>Ask about your balance, transactions, or make transfers</div>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} index={i} />
          ))}
          {isProcessing && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
              <div
                style={{
                  padding: '10px 20px',
                  borderRadius: '16px 16px 16px 4px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: 14,
                  color: 'var(--text-muted)',
                }}
              >
                <span style={{
                  display: 'inline-block',
                  animation: 'shimmer 1.5s infinite',
                  backgroundImage: 'linear-gradient(90deg, var(--text-muted), var(--text-secondary), var(--text-muted))',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {status}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Waveform + PTT */}
        <div
          style={{
            padding: '16px 20px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Waveform getAnalyserData={getAnalyserData} isRecording={isRecording} />

          <button
            className={`ptt-button ${isRecording ? 'recording' : ''}`}
            onMouseDown={handlePttDown}
            onMouseUp={handlePttUp}
            onMouseLeave={() => { if (isRecording) handlePttUp(); }}
            onTouchStart={(e) => { e.preventDefault(); handlePttDown(); }}
            onTouchEnd={(e) => { e.preventDefault(); handlePttUp(); }}
            disabled={isProcessing}
            style={{ opacity: isProcessing ? 0.5 : 1 }}
          >
            {isRecording ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {isRecording ? 'Release to send' : 'Hold to speak'}
          </span>
        </div>
      </div>

      <ConfirmModal
        pendingAction={pendingAction}
        onAuthorize={handleAuthorize}
        onCancel={handleCancel}
      />
    </>
  );
}
