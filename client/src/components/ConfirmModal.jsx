export default function ConfirmModal({ pendingAction, onAuthorize, onCancel }) {
  if (!pendingAction) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="glass-card animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 440,
          padding: 32,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'var(--accent-gold-glow)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 24,
            }}
          >
            🔐
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            {pendingAction.title}
          </h2>
          <p
            className="text-rtl"
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-arabic)',
            }}
          >
            {pendingAction.titleAr}
          </p>
        </div>

        {/* Summary */}
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: 8 }}>
            {pendingAction.summary}
          </p>
          <p
            className="text-rtl"
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-arabic)',
            }}
          >
            {pendingAction.summaryAr}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: 12,
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--text-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onAuthorize}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.3)';
            }}
          >
            Authorize
          </button>
        </div>
      </div>
    </div>
  );
}
