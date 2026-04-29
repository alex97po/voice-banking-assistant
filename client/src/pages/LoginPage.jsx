import { useAuth } from '../contexts/AuthContext';
import { USERS } from '../lib/constants';

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div
      className="min-h-screen flex flex-col bg-mesh relative"
      style={{
        background: 'var(--bg-primary)',
      }}
    >
      <div className="glow-overlay" />
      {/* Logo bar */}
      <div
        style={{
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          🏦
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>Emirates Digital Bank</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Voice Banking Assistant Demo</div>
        </div>
      </div>

      {/* Main panels */}
      <div
        className="flex-1 flex flex-col md:flex-row gap-6 p-6 md:p-8 md:pt-0"
      >
        {Object.values(USERS).map((user, idx) => (
          <button
            key={user.id}
            onClick={() => login(user.id)}
            className="animate-fade-in-up"
            style={{
              flex: '1 0 auto',
              minHeight: 180,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              borderRadius: 20,
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: 'var(--font-sans)',
              animationDelay: `${idx * 0.15}s`,
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--border-accent)';
              e.currentTarget.style.boxShadow = '0 8px 40px rgba(14, 165, 233, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Background gradient glow */}
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `radial-gradient(circle at center, ${idx === 0 ? 'rgba(14, 165, 233, 0.04)' : 'rgba(167, 139, 250, 0.04)'}, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Avatar */}
            <div
              className="w-16 h-16 md:w-20 md:h-20"
              style={{
                borderRadius: 20,
                background: user.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 800,
                color: 'white',
                boxShadow: `0 8px 32px ${idx === 0 ? 'rgba(14, 165, 233, 0.2)' : 'rgba(124, 58, 237, 0.2)'}`,
              }}
            >
              {user.avatar}
            </div>

            {/* Name */}
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <div
                className="text-lg md:text-xl"
                style={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 2,
                }}
              >
                {user.name}
              </div>
              <div
                className="text-rtl text-sm md:text-base"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-arabic)',
                  marginBottom: 8,
                }}
              >
                {user.nameAr}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  marginBottom: 16,
                }}
              >
                {user.subtitle}
              </div>
            </div>

            {/* Login CTA */}
            <div
              style={{
                padding: '10px 32px',
                borderRadius: 12,
                background: idx === 0
                  ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(14, 165, 233, 0.05))'
                  : 'linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(167, 139, 250, 0.05))',
                border: `1px solid ${idx === 0 ? 'rgba(14, 165, 233, 0.2)' : 'rgba(167, 139, 250, 0.2)'}`,
                color: idx === 0 ? 'var(--accent-blue)' : 'var(--accent-purple)',
                fontSize: 14,
                fontWeight: 600,
                zIndex: 1,
              }}
            >
              Sign In →
            </div>
          </button>
        ))}
      </div>

      <div
        className="relative z-10"
        style={{
          padding: '16px 32px',
          textAlign: 'center',
          fontSize: 11,
          color: 'var(--text-muted)',
        }}
      >
        Demo environment · Two isolated user sessions · No real banking data
      </div>
    </div>
  );
}
