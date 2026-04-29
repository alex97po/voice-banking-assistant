import { useAuth } from '../contexts/AuthContext';
import { USERS } from '../lib/constants';

export default function TopBar({ sttMode, setSttMode, ttsMode, setTtsMode }) {
  const { currentUser, logout } = useAuth();
  const user = USERS[currentUser];

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-between p-4 md:px-6 gap-4 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]"
    >
      {/* Left: User info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: user?.gradient || 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: 'white',
          }}
        >
          {user?.avatar}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-arabic)' }}>
            {user?.nameAr}
          </div>
        </div>
      </div>

      {/* Center: Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>STT</span>
          <div className="toggle-pill">
            <button
              className={sttMode === 'fast' ? 'active' : ''}
              onClick={() => setSttMode('fast')}
            >
              Fast
            </button>
            <button
              className={sttMode === 'accurate' ? 'active' : ''}
              onClick={() => setSttMode('accurate')}
            >
              Accurate
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>TTS</span>
          <div className="toggle-pill">
            <button
              className={ttsMode === 'browser' ? 'active' : ''}
              onClick={() => setTtsMode('browser')}
            >
              Browser
            </button>
            <button
              className={ttsMode === 'elevenlabs' ? 'active' : ''}
              onClick={() => setTtsMode('elevenlabs')}
            >
              ElevenLabs
            </button>
          </div>
        </div>
      </div>

      {/* Right: Logout */}
      <button
        onClick={logout}
        style={{
          padding: '8px 18px',
          borderRadius: 10,
          border: '1px solid var(--border-subtle)',
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontFamily: 'var(--font-sans)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-red)';
          e.currentTarget.style.color = 'var(--accent-red)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        Logout
      </button>
    </div>
  );
}
